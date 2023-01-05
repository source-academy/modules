import { type ProjectReflection, Application, TSConfigReader } from 'typedoc';

import type { BuildOptions } from '../../scriptUtils';
import { wrapWithTimer } from '../buildUtils';

export const initTypedoc = wrapWithTimer((buildOpts: BuildOptions) => new Promise<[Application, ProjectReflection]>((resolve, reject) => {
  try {
    const app = new Application();
    app.options.addReader(new TSConfigReader());

    app.bootstrap({
      categorizeByGroup: true,
      entryPoints: buildOpts.modules.map((bundle) => `${buildOpts.srcDir}/bundles/${bundle}/index.ts`),
      excludeInternal: true,
      logger: 'none',
      name: 'Source Academy Modules',
      readme: `${buildOpts.srcDir}/README.md`,
      tsconfig: `${buildOpts.srcDir}/tsconfig.json`,
      skipErrorChecking: true,
    });
    const project = app.convert();
    if (!project) reject(new Error('Failed to initialize typedoc - Make sure to check that the source files have no compilation errors!'));
    else resolve([app, project]);
  } catch (error) {
    reject(error);
  }
}));
