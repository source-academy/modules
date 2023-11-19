import pathlib from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: 'devserver',
  resolve: {
    preserveSymlinks: true,
    alias: [{
      find: /^js-slang\/context/,
      replacement: pathlib.resolve('./devserver/src/mockModuleContext')
    }]
  },
  define: {
    'process.env.NODE_ENV': "'development'",
  },
})
