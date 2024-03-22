import { bundlesOption } from '@src/commandUtils';
import { createBuildCommand, type BuildInputs, createBuildCommandHandler, type AwaitedReturn } from '../utils';
import { initTypedoc, type TypedocResult } from './docsUtils';
import { buildHtml } from './html';
import { buildJsons } from './json';

export async function buildDocs(inputs: BuildInputs, outDir: string, tdResult: TypedocResult): Promise<
  AwaitedReturn<typeof buildJsons> & { html: AwaitedReturn<typeof buildHtml> }
> {
  const [jsonsResult, htmlResult] = await Promise.all([
    buildJsons(inputs, outDir, tdResult[0]),
    buildHtml(inputs, outDir, tdResult)
  ])

  return {
    ...jsonsResult,
    html: htmlResult
  }
}

const docsCommandHandler = createBuildCommandHandler(async (inputs, { srcDir, outDir, verbose }) => {
  const tdResult = await initTypedoc(inputs.bundles, srcDir, verbose)
  return buildDocs(inputs, outDir, tdResult)
}, false)

export const getBuildDocsCommand = () => createBuildCommand(
  'docs',
  'Build HTML and json documentation'
)
  .addOption(bundlesOption)
  .action(opts => docsCommandHandler({
    ...opts,
    tabs: []
  }))

export { getBuildJsonsCommand } from './json'
export { getBuildHtmlCommand } from './html'

export { buildJsons, buildHtml }
