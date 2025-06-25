// Devserver Vite Config
/// <reference types="@vitest/browser/providers/playwright" />

import pathlib from 'path';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { loadEnv, defineConfig } from 'vite'
import { mergeConfig } from 'vitest/config';
import type { BrowserCommand } from 'vitest/node';
import rootConfig from '../vitest.config';

const setLocalStorage: BrowserCommand<[key: string, value: any]> = async (ctx, key, value) => {
  if (ctx.provider.name === 'playwright') {
    await ctx.page.evaluate(([key, value]) => localStorage.setItem(key, value), [key, value])
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  // const modulesDir = pathlib.resolve(import.meta.dirname, '..', 'build') 

  return mergeConfig(
    rootConfig, {
      root: import.meta.dirname,
      plugins: [
        nodePolyfills({
          include: ['path']
        }),
        react(),
      ],
      resolve: {
        preserveSymlinks: true,
        alias:[{
          find: /^js-slang\/context/,
          replacement: pathlib.resolve(import.meta.dirname, 'src', 'mockModuleContext.ts')
        }]
      },
      /* Experimental for serving modules using the dev server
      server: {
        port: 8022,
        strictPort: true,
        proxy: {
          '/modules': {
            target: 'http://localhost:8022',
            rewrite(path) {
              const finalPath = path.replace('/modules', modulesDir)
              return `/@fs/${finalPath}`
            }
          }
        },
        fs: {
          allow: [
            searchForWorkspaceRoot(import.meta.dirname),
            modulesDir
          ]
        }
      },
      */
      define: {
        'process.env': env
      },
      optimizeDeps: {
        esbuildOptions: {
          // Node.js global to browser globalThis
          define: {
            global: 'globalThis'
          }
        },
        include: [
          "vite-plugin-node-polyfills/shims/buffer",
          "vite-plugin-node-polyfills/shims/global",
          "vite-plugin-node-polyfills/shims/process",
          '../build/tabs/*.js'
        ],
      },
      test: {
        name: 'Dev Server',
        include: [
          `${import.meta.dirname}/**/__tests__/**/*.ts*`
        ],
        browser: {
          enabled: true,
          headless: true,
          provider: 'playwright',
          instances: [{
            browser: 'chromium',
            screenshotFailures: false
          }],
          commands: {
            setLocalStorage
          }
        }
      }
    }
  );
})
