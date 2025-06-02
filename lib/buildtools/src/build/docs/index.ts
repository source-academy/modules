import fs from 'fs/promises';
import chalk from 'chalk';
import type { ProjectReflection } from 'typedoc';
import { compareSeverity, type AwaitedReturn, type BuildResult } from '../../utils';
import type { ResolvedBundle } from '../manifest';
import { initTypedoc } from './docsUtils';
import { buildJson } from './json';

/**
 * A more efficient version of documentation building to avoid
 * having to instantiate typedoc multiple times
 */
export async function buildDocs(resolvedBundles: Record<string, ResolvedBundle>, outDir: string, errorChecking: boolean): Promise<BuildResult> {
  const warnings: string[] = [];

  const [[project, app]] = await Promise.all([
    initTypedoc(resolvedBundles, errorChecking),
    fs.mkdir(`${outDir}/jsons`, { recursive: true })
  ]);

  const validModules = new Set(Object.keys(resolvedBundles));

  const unknownChildren = project.children!.filter(({ name }) => !validModules.has(name));
  for (const unknownChild of unknownChildren) {
    warnings.push(`Unknown module ${unknownChild.name} present in html output`);
  }

  const jsonPromises = Object.keys(resolvedBundles)
    .map((bundleName): Promise<BuildResult> => {
      const reflection = project.getChildByName(bundleName);
      if (!reflection) {
        return Promise.resolve({
          severity: 'warn',
          warnings: [`Did not find documentation for ${bundleName}. Did you forget a @module tag?`],
          errors: []
        });
      }

      return buildJson(bundleName, reflection as ProjectReflection, outDir);
    });

  const [, ...jsonResults] = await Promise.all([
    app.generateDocs(project, `${outDir}/documentation`),
    ...jsonPromises
  ]);

  return jsonResults.reduce((res, result): BuildResult => ({
    severity: compareSeverity(res.severity, result.severity),
    errors: [...res.errors, ...result.errors],
    warnings: [...res.warnings, ...result.warnings]
  }), {
    severity: warnings.length > 0 ? 'warn' : 'success',
    warnings,
    errors: []
  });
}

export function formatBuildDocsResult({ severity, errors, warnings }: AwaitedReturn<typeof buildDocs>, outDir: string) {
  switch (severity) {
    case 'error':
      return errors.map(error => `${chalk.blueBright('[Docs]')}: ${chalk.redBright(error)}`).join('\n');
    case 'warn':
      return [
        ...warnings.map(warning => `${chalk.blueBright('[Docs]')}: ${chalk.yellowBright(warning)}`),
        `${chalk.blueBright('[Docs]')}: ${chalk.greenBright(`Docs written to ${outDir}/documentation/index.html`)}`
      ].join('\n');
    case 'success':
      return `${chalk.blueBright('[Docs]')}: ${chalk.greenBright(`Docs written to ${outDir}/documentation/index.html`)}`;
  }
}

export { buildJson };
