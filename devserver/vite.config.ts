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
        customResolver(source, importer, options) {
          const newSource = pathlib.resolve(import.meta.dirname, '../lib/modules-lib/src', source);
          return this.resolve(newSource, importer, options);
        },
      }, {
        find: /^@sourceacademy\/bundle-(.+)/,
        replacement: '$1',
        customResolver(source, importer, options) {
          const [bundleName, everythingElse] = source.split('/', 2);
          const newSource = pathlib.resolve(import.meta.dirname, '../src/bundles', bundleName, 'src', everythingElse);
          return this.resolve(newSource, importer, options);
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
        '@blueprintjs/core',
        '@blueprintjs/icons',
        'ace-builds',
        'ace-builds/src-noconflict/ace',
        'ace-builds/src-noconflict/ext-language_tools',
        'ace-builds/src-noconflict/ext-searchbox',
        'classnames',
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
