import type { ProjectReflection } from 'typedoc'
import { resolveAllBundles } from '../modules/manifest'
import { initTypedoc } from './docsUtils'
import { buildJson } from './json'
import chalk from 'chalk'

/**
 * A more efficient version of documentation building to avoid
 * having to instantiate typedoc multiple times
 */
export async function buildDocs(bundlesDir: string, outDir: string) {
  const manifest = await resolveAllBundles(bundlesDir)
  const [project, app] = await initTypedoc(manifest)

  const jsonPromises = Object.keys(manifest)
    .map(async bundleName => {
      const reflection = project.getChildByName(bundleName)
      if (!reflection) {
        console.warn(`${chalk.yellow('[warning]:')} Did not find documentation for ${bundleName}. Did you include a @module tag?`)
        return;
      }

      await buildJson(bundleName, reflection as ProjectReflection, outDir)
    })

  await Promise.all([
    ...jsonPromises,
    app.generateDocs(project, `${outDir}/documentation`)
  ])
}


export { buildJson }