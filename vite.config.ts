import pathlib from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'devserver',
  resolve: {
    preserveSymlinks: true,
  },
  define: {
    'process.env.NODE_ENV': "'development'",
  }
})
