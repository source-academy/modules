import pathlib from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
    resolve: {
      preserveSymlinks: true,
      alias:[{
        find: /^js-slang\/context/,
        replacement: pathlib.resolve('./src/mockModuleContext')
      }]
    },
    define: {
      'process.env': env
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis'
        },
      }
    },
  };
});
