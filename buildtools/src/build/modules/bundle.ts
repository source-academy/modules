import fs from 'fs/promises'
import { build as esbuild } from 'esbuild'
import { commonEsbuildOptions, outputBundleOrTab } from './commons'

export async function buildBundle(bundleDir: string) {
  let actualManifest;
  try {
    const rawManifest = await fs.readFile(`${bundleDir}/manifest.json`, 'utf-8')
    actualManifest = JSON.parse(rawManifest)
  } catch (error) {
    throw new Error(`${bundleDir} is not a valid bundle!`)
  }

  const { outputFiles: [result]} = await esbuild({
    ...commonEsbuildOptions,
    entryPoints: [`${bundleDir}/src/index.ts`],
    tsconfig: `${bundleDir}/tsconfig.json`
  })

  await outputBundleOrTab(result, 'build')
}