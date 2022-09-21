import { CommandInfo, createCommand, joinArrays } from '../../utilities';
import { getDb } from '../buildUtils';
import copy from '../misc';

import commandInfo from './command.json' assert { type: 'json'};
import { buildHtml, logHtmlResult, logHtmlStart, shouldBuildHtml } from './html';
import { buildJsons, getJsonsToBuild, logJsonResult, logJsonStart } from './jsons';
import { initTypedoc } from './utils';

type DocsCommandOptions = Partial<{
  bundles: string | string[];
  html: boolean;
  verbose: boolean;
  force: boolean;
}>;

export default createCommand(commandInfo as CommandInfo,
  async (opts: DocsCommandOptions) => {
    const db = await getDb();

    const [htmlOpts, jsonOpts] = await Promise.all([shouldBuildHtml(db, opts), getJsonsToBuild(db, opts)]);

    console.log(joinArrays('', logHtmlStart(htmlOpts), logJsonStart(jsonOpts))
      .join('\n'));

    const project = initTypedoc();
    const [htmlResult, jsonResult] = await Promise.all([buildHtml(db, project), buildJsons(db, project, jsonOpts)]);

    const endLogs = joinArrays('', logHtmlResult(htmlResult), logJsonResult(jsonResult));
    console.log(endLogs
      .join('\n'));
    await db.write();
    await copy();
  });

export { htmlCommand } from './html';
export { jsonCommand } from './jsons';
