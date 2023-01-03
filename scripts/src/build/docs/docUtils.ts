import { type ProjectReflection, Application, TSConfigReader, TypeDocReader } from 'typedoc';

import type { BuildOptions } from '../../scriptUtils';
import { wrapWithTimer } from '../buildUtils';

export const initTypedoc = wrapWithTimer((bundles: string[], buildOpts: BuildOptions) => new Promise<[Application, ProjectReflection]>((resolve, reject) => {
  try {
    const app = new Application();
    app.options.addReader(new TSConfigReader());
    app.options.addReader(new TypeDocReader());

    app.bootstrap({
      categorizeByGroup: true,
      entryPoints: bundles.map((bundle) => `${buildOpts.srcDir}/bundles/${bundle}/index.ts`),
      excludeInternal: true,
      logger: 'none',
      name: 'Source Academy Modules',
      readme: `${buildOpts.srcDir}/README.md`,
      tsconfig: `${buildOpts.srcDir}/tsconfig.json`,
    });
    const project = app.convert();
    if (!project) reject(new Error('Failed to initialize typedoc - Make sure to check that the source files have no compilation errors!'));
    else resolve([app, project]);
  } catch (error) {
    reject(error);
  }
}));
