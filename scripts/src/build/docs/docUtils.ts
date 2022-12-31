import { Application, TSConfigReader, TypeDocReader } from 'typedoc';

import type { BuildOptions } from '../../scriptUtils';

export const initTypedoc = (bundles: string[], buildOpts: BuildOptions) => {
  const app = new Application();
  app.options.addReader(new TSConfigReader());
  app.options.addReader(new TypeDocReader());

  app.bootstrap({
    categorizeByGroup: true,
    entryPoints: bundles.map((bundle) => `${buildOpts.srcDir}/bundles/${bundle}/index.ts`),
    excludeInternal: true,
    tsconfig: `${buildOpts.srcDir}/tsconfig.json`,
    logger: 'none',
    name: 'Source Academy Modules',
  });

  return app;
};
