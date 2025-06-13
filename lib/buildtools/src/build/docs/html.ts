import type { Application, ProjectReflection } from 'typedoc';
import type { HTMLResult } from '../../types.js';
import { createBuilder } from '../buildUtils.js';

export const {
  builder: buildHtml,
  formatter: formatHtmlResult
} = createBuilder<[app: Application, project: ProjectReflection], HTMLResult>(async (outDir, app, project) => {
  /**
    Because of the way Typedoc generates HTML documentation, it is not possible
    to regenerate the HTML documentation for a specific bundle. Instead, the documentation
    for every single bundle must be generated at once.
  */
  const outpath = `${outDir}/documentation`;
  try {
    await app.generateDocs(project, outpath);
    return [{
      severity: 'success',
      assetType: 'html',
      message: `HTML documentation written to ${outpath}/index.html`
    }];
  } catch (error) {
    return [{
      severity: 'error',
      assetType: 'html',
      message: `${error}`
    }];
  }
});
