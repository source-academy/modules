import type { Application, ProjectReflection } from 'typedoc';

import type { BuildOptions } from '../../scriptUtils';
import { wrapWithTimer } from '../buildUtils';
import type { BuildResult } from '../types';

export default wrapWithTimer(async (app: Application, project: ProjectReflection, buildOpts: BuildOptions): Promise<BuildResult> => {
  try {
    await app.generateDocs(project, `${buildOpts.outDir}/documentation`);
    return {
      severity: 'success',
    };
  } catch (error) {
    return {
      severity: 'error',
      error,
    };
  }
});
