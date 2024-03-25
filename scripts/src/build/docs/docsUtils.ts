import * as td from 'typedoc'
import { expandBundleNames } from '../utils'

export async function initTypedoc(bundles: string[], srcDir: string, verbose: boolean) {
  const app = await td.Application.bootstrap({
    categorizeByGroup: true,
    entryPoints: expandBundleNames(srcDir, bundles),
    excludeInternal: true,
    // logger: watch ? 'none' : undefined,
    logLevel: verbose ? 'Info' : 'Error',
    name: 'Source Academy Modules',
    readme: './scripts/src/build/docs/docsreadme.md',
    tsconfig: `${srcDir}/tsconfig.json`,
    skipErrorChecking: true
  })

  app.options.addReader(new td.TSConfigReader())
  const project = await app.convert()
  if (!project) {
    throw new Error('Failed to initialize typedoc - Make sure to check that the source files have no compilation errors!')
  }
  return [project, app] as [td.ProjectReflection, td.Application]
}

export type TypedocResult = Awaited<ReturnType<typeof initTypedoc>>
