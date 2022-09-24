import { Application, ProjectReflection, TSConfigReader, TypeDocReader } from 'typedoc';

import { SOURCE_PATH } from '../../constants';
import { modules as manifest } from '../../utilities';

export type DocsProject = {
  buildTime: number;
  app: Application;
  project: ProjectReflection;
};

export const initTypedoc = (): DocsProject => {
  const app = new Application();
  app.options.addReader(new TSConfigReader());
  app.options.addReader(new TypeDocReader());

  app.bootstrap({
    entryPoints: Object.keys(manifest)
      .map(
        (bundle) => `${SOURCE_PATH}/bundles/${bundle}/functions.ts`,
      ),
    tsconfig: 'src/tsconfig.json',
    theme: 'default',
    excludeInternal: true,
    categorizeByGroup: true,
    name: 'Source Academy Modules',
    logger: 'none',
  });

  const project = app.convert();
  if (!project) {
    throw new Error('Docs Error: Failed to initialize Typedoc project');
  }
  return {
    app,
    project,
    buildTime: new Date()
      .getTime(),
  };
};
