/// <reference types="vitest" />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/view',

  server: {
    port: 3000,
    host: '0.0.0.0',
  },

  preview: {
    port: 3000,
    host: '0.0.0.0',
  },

  plugins: [react(), nxViteTsPaths()],

  //@ts-ignore
  test: {
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/view',
      provider: 'v8',
    },
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },

  build: {
    outDir: '../../dist/apps/view',
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },
    target: 'es2015',
  },
});
