import os from 'os';
import path, { join } from 'path';
import { CONFIG } from './config';
import * as fs from 'fs';
import { lstat, readlink, rm, symlink } from 'fs/promises';

export const fromHost = (path: string): string => {
  const dockerMountPoint = '/mnt/host';
  if (!CONFIG.running_in_docker) return path;
  if (path.startsWith(dockerMountPoint)) return path;
  const pathInDocker = path === '/' ? dockerMountPoint : join(dockerMountPoint, path);
  return pathInDocker;
};

export const PLATFORM_IS_WINDOWS = os.platform() === 'win32';

// Like existsSync but based on lstat so it also returns true for broken symlinks.
// Returns false only when the path definitely does not exist (ENOENT/ENOTDIR).
const lstatExists = (p: string): boolean => {
  try {
    fs.lstatSync(p);
    return true;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;
    return !(code === 'ENOENT' || code === 'ENOTDIR');
  }
}

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
    throw new Error(`Symlink chain longer than ${maxDepth}: ${[...seen, p].join(' → ')}`);
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
      } catch (e) {
        // Intentionally ignore errors while probing parent directories
      }
    }

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
}

const OS_CANDIDATES = [
  '/etc/lsb-release', // Linux Standard Base distro info
  '/etc/os-release', // Freedesktop OS metadata
  '/usr/lib/os-release', // Fallback OS metadata location
  '/etc/openwrt_release', // OpenWrt-specific release info
];

export const refreshHostOsRelease = async(): Promise<void> => {
  if (!CONFIG.running_in_docker) return;

  // At least one candidate must exist in the host
  const hostPaths = OS_CANDIDATES.filter(p => lstatExists(fromHost(p)));
  if (hostPaths.length === 0) return;

  // Track the files that we can resolve from the host
  const symlinkedLocals = new Set<string>();

  for (const local of hostPaths) {
    try {
      const realFile = await resolveSymlink(fromHost(local));

      // Remove the local copy of the os-path even if there is no hostPath
      await rm(local, { force: true });
      if (fs.existsSync(realFile)) {
        await symlink(realFile, local, 'file');
        symlinkedLocals.add(local);
      }
    } catch (e) {
      // Error resolving the symlink, warn
      console.warn(e);
    }
  }

  // If at least one symlink was created, remove any remaining candidate files that still exist as they do not represent the host, but the container
  if (symlinkedLocals.size > 0) {
    for (const candidate of OS_CANDIDATES) {
      if (!symlinkedLocals.has(candidate) && lstatExists(candidate)) {
        try {
          await rm(candidate, { force: true });
        } catch (e) {
          console.warn(e);
        }
      }
    }
  }
}
