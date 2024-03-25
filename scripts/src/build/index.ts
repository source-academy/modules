import { Command } from '@commander-js/extra-typings'
import { bundlesOption, tabsOption } from '@src/commandUtils'
import { buildDocs, getBuildDocsCommand, getBuildHtmlCommand, getBuildJsonsCommand } from './docs'
import { initTypedoc } from './docs/docsUtils'
import { buildModules, getBuildBundlesCommand, getBuildTabsCommand } from './modules'
import { createBuildCommand, type BuildTask, createBuildCommandHandler } from './utils'

const buildAll: BuildTask = async (inputs, opts) => {
  const tdResult = await initTypedoc(inputs.bundles, opts.srcDir, opts.verbose)

  const [modulesResult, docsResult] = await Promise.all([
    buildModules(inputs, opts),
    buildDocs(inputs, opts.outDir, tdResult)
  ])

  return {
    ...modulesResult,
    ...docsResult
  }
}

const buildAllCommandHandler = createBuildCommandHandler(buildAll, true)
const getBuildAllCommand = () => createBuildCommand('all', 'Build bundles and tabs and documentation')
  .addOption(bundlesOption)
  .addOption(tabsOption)
  .action(buildAllCommandHandler)

const getBuildCommand = () => new Command('build')
  .addCommand(getBuildAllCommand(), { isDefault: true })
  .addCommand(getBuildBundlesCommand())
  .addCommand(getBuildDocsCommand())
  .addCommand(getBuildHtmlCommand())
  .addCommand(getBuildJsonsCommand())
  .addCommand(getBuildTabsCommand())

export default getBuildCommand
