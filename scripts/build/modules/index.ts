import { CommandInfo, createCommand, joinArrays } from '../../utilities';
import { getDb } from '../buildUtils';
import { buildJsons, getJsonsToBuild, logJsonResult, logJsonStart } from '../docs/jsons';
import { initTypedoc } from '../docs/utils';
import copy from '../misc';

import { buildBundles, getBundles, logBundleResult, logBundleStart } from './bundle';
import commandInfo from './command.json' assert { type: 'json' };
import { buildTabs, getTabs, logTabResult, logTabStart } from './tab';

type ModulesCommandOptions = Partial<{
  bundles: string | string[];
  tabs: string | string[];
  verbose: boolean;
  force: boolean;
}>;

const modulesCommand = createCommand(commandInfo as CommandInfo,
  async (opts: ModulesCommandOptions) => {
    const db = await getDb();
    const bundleOpts = await getBundles(db, opts);
    const [tabOpts, jsonOpts] = await Promise.all([getTabs(db, opts, bundleOpts), getJsonsToBuild(db, opts, bundleOpts)]);

    console.log(joinArrays('', logBundleStart(bundleOpts, opts.verbose), logTabStart(tabOpts, opts.verbose), logJsonStart(jsonOpts, opts.verbose))
      .join('\n'));

    const project = initTypedoc();
    const buildTime = project.buildTime;

    const [bundleResult, tabResult, jsonResult] = await Promise.all([
      buildBundles(db, bundleOpts, buildTime), buildTabs(db, tabOpts, buildTime), buildJsons(db, project, jsonOpts),
    ]);

    console.log(joinArrays('', logBundleResult(bundleResult), logTabResult(tabResult), logJsonResult(jsonResult))
      .join('\n'));

    await db.write();
    await copy();
  });

export default modulesCommand;
export { tabCommand } from './tab';
