import pathlib from 'path';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { defineConfig } from 'vitest/config';

const outDir = pathlib.join(import.meta.dirname, '../../build');

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
  ],
  optimizeDeps: {
    include: [
      'vite-plugin-node-polyfills/shims/buffer',
      'vite-plugin-node-polyfills/shims/global',
      'vite-plugin-node-polyfills/shims/process'
    ]
  },
  test: {
    watch: false,
    alias: [
      {
        find: /^#bundle\/(.+)$/,
        replacement: pathlib.join(import.meta.dirname, '../../build/bundles/$1.js')
      },
      {
        find: /^#tab\/(.+)$/,
        replacement: pathlib.join(import.meta.dirname, '../../build/tabs/$1.js')
      }
    ],
    root: import.meta.dirname,
    name: 'Module Validation',
    testTimeout: 10000,
    environment: 'jsdom',
    coverage: {
      include: [
        pathlib.join(outDir, 'bundles', '*.js'),
        pathlib.join(outDir, 'tabs', '*.js'),
      ]
    },
    include: ['./tests/**/*.test.{ts,tsx}'],
    browser: {
      screenshotFailures: false,
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{
        browser: 'chromium'
      }]
    }
  }
});
