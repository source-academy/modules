// Devserver Vite Config
/// <reference types="@vitest/browser/providers/playwright" />

import fs from 'fs/promises';
import pathlib from 'path';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { loadEnv, defineConfig, type UserConfig } from 'vite'
import { defineProject } from 'vitest/config';
import type { BrowserCommand } from 'vitest/node';

const setLocalStorage: BrowserCommand<[key: string, value: any]> = async (ctx, key, value) => {
  if (ctx.provider.name === 'playwright') {
    await ctx.page.evaluate(([key, value]) => localStorage.setItem(key, value), [key, value])
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const viteConfig: UserConfig = {
    root: import.meta.dirname,
    plugins: [
      nodePolyfills({
        include: ['path']
      }),
      react(),
    ],
    resolve: {
      preserveSymlinks: true,
      alias: [{
        find: /^js-slang\/context/,
        replacement: pathlib.resolve(import.meta.dirname, 'src', 'mockModuleContext.ts')
      }, {
        // This alias configuration allows us to edit the modules library and have the changes
        // be reflected in real time when in hot-reload mode
        find: /^@sourceacademy\/modules-lib/,
        replacement: '.',
        async customResolver(source) {
          const newSource = pathlib.resolve(import.meta.dirname, '../lib/modules-lib/src', source)
          const extensions = ['.tsx', '.ts', '/index.ts']

          for (const each of extensions) {
            try {
              await fs.access(`${newSource}${each}`, fs.constants.R_OK)
              return `${newSource}${each}`
            } catch {}
          }

          return undefined;
        },
      }],
    },
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
        '../build/tabs/*.js',
        'ace-builds',
        'ace-builds/src-noconflict/ace',
        'ace-builds/src-noconflict/ext-language_tools',
        'ace-builds/src-noconflict/ext-searchbox',
        'classnames',
        'js-slang/dist/createContext',
        'js-slang/dist/editors/ace/modes/source',
        'js-slang/dist/editors/ace/theme/source',
        'js-slang/dist/types',
        'js-slang/dist/utils/stringify',
        'react/jsx-dev-runtime',
        'react-ace',
        'react-ace/lib/ace',
        're-resizable',
        "vite-plugin-node-polyfills/shims/buffer",
        "vite-plugin-node-polyfills/shims/global",
        "vite-plugin-node-polyfills/shims/process",
      ],
    },
  }

  const testConfig = defineProject({
    test: {
      root: import.meta.dirname,
      name: 'Dev Server',
      include: ['**/__tests__/**/*.{ts,tsx}'],
      browser: {
        enabled: true,
        provider: 'playwright',
        instances: [{
          browser: 'chromium'
        }],
        commands: {
          setLocalStorage
        }
      }
    }
  })

  return {
    ...viteConfig,
    ...testConfig,
  }
})
