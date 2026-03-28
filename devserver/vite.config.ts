// Devserver Vite Config

import pathlib from 'path';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { loadEnv } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { defineProject } from 'vitest/config';
import type { BrowserCommand } from 'vitest/node';

const setLocalStorage: BrowserCommand<[key: string, value: any]> = async (ctx, key, value) => {
  if (ctx.provider.name === 'playwright') {
    await ctx.page.evaluate(([key, value]) => localStorage.setItem(key, value), [key, value]);
  }
};

export default defineProject(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    root: import.meta.dirname,
    plugins: [
      nodePolyfills({
        include: ['path']
      }),
      react(),
    ],
    legacy: {
      inconsistentCjsInterop: true
    },
    resolve: {
      preserveSymlinks: true,
      alias: [
        {
          find: /^js-slang\/context/,
          replacement: pathlib.resolve(import.meta.dirname, 'src', 'mockModuleContext.ts')
        },
        {
        // This alias configuration allows us to edit the modules library and bundles and have those changes
        // be reflected in real time when in hot-reload mode
          find: /^@sourceacademy\/modules-lib\/(.+)/,
          replacement: pathlib.resolve(import.meta.dirname, '../lib/modules-lib/src/$1')
        },
        {
          find: /^@sourceacademy\/bundle-(\w+)$/,
          replacement: pathlib.resolve(import.meta.dirname, '../src/bundles/$1/src/index.ts')
        },
        {
          find: /^@sourceacademy\/bundle-(\w+?)\/(.+)$/,
          replacement: pathlib.resolve(import.meta.dirname, '../src/bundles/$1/src/$2')
        }
      ],
    },
    define: {
      'process.env': env,
      global: 'globalThis'
    },
    optimizeDeps: {
      include: [
        '../build/tabs/*.js',
        '@blueprintjs/core',
        '@blueprintjs/icons',
        'ace-builds',
        'ace-builds/src-noconflict/ace',
        'ace-builds/src-noconflict/ext-language_tools',
        'ace-builds/src-noconflict/ext-searchbox',
        'classnames',
        'es-toolkit',
        'gl-matrix',
        'js-slang',
        'js-slang/dist/createContext',
        'js-slang/dist/editors/ace/modes/source',
        'js-slang/dist/editors/ace/theme/source',
        'js-slang/dist/modules/loader',
        'js-slang/dist/types',
        'js-slang/dist/utils/stringify',
        'react/jsx-dev-runtime',
        'react-ace',
        'react-ace/lib/ace',
        're-resizable',
        'vite-plugin-node-polyfills/shims/buffer',
        'vite-plugin-node-polyfills/shims/global',
        'vite-plugin-node-polyfills/shims/process',
        'vitest-browser-react'
      ],
    },
    test: {
      root: import.meta.dirname,
      name: 'Dev Server',
      include: ['**/__tests__/**/*.test.{ts,tsx}'],
      browser: {
        enabled: true,
        provider: playwright(),
        instances: [{
          browser: 'chromium'
        }],
        commands: {
          setLocalStorage
        }
      }
    }
  };
});
