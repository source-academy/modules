import type { ProjectReflection } from 'typedoc'
import type { ResolvedBundle } from '../manifest'
import { initTypedoc } from './docsUtils'
import { buildJson } from './json'
import chalk from 'chalk'

/**
 * A more efficient version of documentation building to avoid
 * having to instantiate typedoc multiple times
 */
export async function buildDocs(manifest: Record<string, ResolvedBundle>, outDir: string) {
  const [project, app] = await initTypedoc(manifest)

  const validModules = new Set(Object.keys(manifest))

  const unknownChildren = project.children.filter(({ name }) => !validModules.has(name))
  if (unknownChildren.length > 0) {
    console.warn(`${chalk.yellow('[warning]')} Unknown modules present in html output`)
  }

  const jsonPromises = Object.keys(manifest)
    .map(async bundleName => {
      const reflection = project.getChildByName(bundleName)
      if (!reflection) {
        console.warn(`${chalk.yellow('[warning]')} Did not find documentation for ${bundleName}. Did you forget a @module tag?`)
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