import fs from 'fs/promises';
import type { ProjectReflection } from 'typedoc';
import type { HTMLResult, JsonResultEntry, ResolvedBundle } from '../../types.js';
import { initTypedoc } from './docsUtils.js';
import { buildHtml } from './html.js';
import { buildJson } from './json.js';

/**
 * A more efficient version of documentation building to avoid
 * having to instantiate typedoc multiple times\
 * Build both JSON documentation and HTML documentation
 */
export async function buildDocs(resolvedBundles: Record<string, ResolvedBundle>, outDir: string): Promise<(HTMLResult | JsonResultEntry)[]> {
  const warnings: string[] = [];

  const [[project, app]] = await Promise.all([
    initTypedoc(resolvedBundles),
    fs.mkdir(`${outDir}/jsons`, { recursive: true }),
  ]);

  const validModules = new Set(Object.keys(resolvedBundles));

  const unknownChildren = project.children!.filter(({ name }) => !validModules.has(name));
  for (const unknownChild of unknownChildren) {
    warnings.push(`Unknown module ${unknownChild.name} present in html output. Did you forget to include typedocOptions in your tsconfig?`);
  }

  const jsonPromises = Object.values(resolvedBundles)
    .map((bundle): Promise<JsonResultEntry[]> => {
      const reflection = project.getChildByName(bundle.name);
      if (!reflection) {
        return Promise.resolve([{
          severity: 'warn',
          assetType: 'json',
          inputName: bundle.name,
          message: `Did not find documentation for ${bundle.name}. Did you forget a @module tag?`,
        }]);
      }

      return buildJson(outDir, bundle, reflection as ProjectReflection);
    });

  const [htmlResult, ...jsonResults] = await Promise.all([
    buildHtml(`${outDir}/documentation`, app, project),
    ...jsonPromises
  ]);

  return [
    ...jsonResults.flat(),
    ...htmlResult
  ];
}

export { buildJson };
