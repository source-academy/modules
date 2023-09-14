import pathlib from 'path'
import { type ProxyOptions, defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react'

const port = 8022
const proxyConfig = ['bundles', 'tabs', 'jsons', 'documentation'].reduce((res, asset) => ({
  ...res,
  [`/${asset}`]: {
    target: `http://localhost:${port}`,
    rewrite: path => {
      const newPath = `/@fs/${path.replace(`/${asset}`, pathlib.resolve(`./build/${asset}`))}`
      return newPath;
    }
  }
}), {} as Record<string, ProxyOptions>)

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
  server: {
    port,
    proxy: proxyConfig,
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        '../build'
      ]
    }
  }
})
