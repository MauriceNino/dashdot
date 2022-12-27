import { join } from 'path';
import { CONFIG } from './config';

export const fromHost = (path: string): string => {
  const pathInDocker = path === '/' ? '/mnt/host' : join('/mnt/host/', path);
  return CONFIG.running_in_docker ? pathInDocker : path;
};
