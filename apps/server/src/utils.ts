import * as fs from 'node:fs';
import { lstat, readlink, rm, symlink } from 'node:fs/promises';
import os from 'node:os';
import path, { join } from 'node:path';
import { CONFIG } from './config';

export const fromHost = (path: string): string => {
  const dockerMountPoint = '/mnt/host';
  if (!CONFIG.running_in_docker) return path;
  if (path.startsWith(dockerMountPoint)) return path;
  const pathInDocker =
    path === '/' ? dockerMountPoint : join(dockerMountPoint, path);
  return pathInDocker;
};

export const PLATFORM_IS_WINDOWS = os.platform() === 'win32';

/**
 * Recursively resolve `p`.
 *  - Rewrites absolute hops so they stay inside HOST_PREFIX.
 *  - Detects loops.
 *  - Stops after hitting a real file or exceeding `maxDepth`.
 *
 * @throws {Error} if a loop is detected or the chain is too deep.
 */
export const resolveSymlink = async (
  p: string,
  seen = new Set<string>(),
  maxDepth = 32,
): Promise<string> => {
  p = path.resolve(p);

  if (seen.has(p)) {
    throw new Error(`Symlink loop detected at ${p}`);
  }
  if (seen.size >= maxDepth) {
    throw new Error(
      `Symlink chain longer than ${maxDepth}: ${[...seen, p].join(' → ')}`,
    );
  }
  seen.add(p);

  let stat: fs.Stats;
  try {
    stat = await lstat(p);
  } catch (err) {
    const parts: string[] = [];
    let probe = p;
    while (probe !== '/') {
      const parent = path.dirname(probe);
      parts.unshift(path.basename(probe));
      if (parent === probe) throw err;
      probe = parent;
      try {
        stat = await lstat(probe);
        break;
      } catch (_e) {
        // Intentionally ignore errors while probing parent directories
      }
    }

    //@ts-expect-error
    if (!stat.isSymbolicLink()) {
      throw new Error(`lstat failed for ${p}: ${(err as Error).message}`);
    }

    const resolved = await resolveSymlink(probe, seen, maxDepth);
    return resolveSymlink(join(resolved, ...parts), seen, maxDepth);
  }

  if (!stat.isSymbolicLink()) {
    return p;
  }

  let target = await readlink(p);
  if (!path.isAbsolute(target)) {
    target = path.resolve(path.dirname(p), target);
  }

  target = fromHost(target);

  return resolveSymlink(target, seen, maxDepth);
};

const LOCAL_OS_PATHS = ['/etc/os-release', '/usr/lib/os-release'];
const HOST_OS_CANDIDATES = [
  '/mnt/host/etc/os-release',
  '/mnt/host/usr/lib/os-release',
];

export const refreshHostOsRelease = async (): Promise<void> => {
  if (!CONFIG.running_in_docker) return;

  const hostPath = HOST_OS_CANDIDATES.find((p) => fs.lstatSync(p));
  if (!hostPath) return;

  const realFile = await resolveSymlink(hostPath);

  for (const local of LOCAL_OS_PATHS) {
    if (fs.existsSync(local)) {
      // Recurse in case os-release is a directory for some reason
      await rm(local, { recursive: true, force: true });
      await symlink(realFile, local, 'file');
    }
  }
};
