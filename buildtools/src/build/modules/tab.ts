import fs from 'fs/promises'
import { build as esbuild } from 'esbuild'
import { commonEsbuildOptions, outputBundleOrTab } from './commons'

export async function buildTab(tabDir: string) {
  let actualManifest;
  try {
    const rawManifest = await fs.readFile(`${tabDir}/manifest.json`, 'utf-8')
    actualManifest = JSON.parse(rawManifest)
  } catch (error) {
    throw new Error(`${tabDir} is not a valid tab!`)
  }

  const { outputFiles: [result]} = await esbuild({
    ...commonEsbuildOptions,
    entryPoints: [`${tabDir}/src/index.ts`],
    external: [
      ...commonEsbuildOptions.external,
      'react',
      'react-ace',
      'react-dom',
      'react/jsx-runtime',
      '@blueprintjs/*'
    ],
    tsconfig: `${tabDir}/tsconfig.json`
  })

  await outputBundleOrTab(result, 'build')
}