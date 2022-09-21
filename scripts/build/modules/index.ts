import { CommandInfo, createCommand, joinArrays } from '../../utilities';
import { getDb } from '../buildUtils';
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

export default createCommand(commandInfo as CommandInfo,
  async (opts: ModulesCommandOptions) => {
    const db = await getDb();
    const bundleOpts = await getBundles(db, opts);
    const tabOpts = await getTabs(db, opts, bundleOpts);

    console.log(joinArrays('', logBundleStart(bundleOpts, opts.verbose), logTabStart(tabOpts, opts.verbose))
      .join('\n'));

    const buildTime = new Date()
      .getTime();

    const [bundleResult, tabResult] = await Promise.all([buildBundles(db, bundleOpts, buildTime), buildTabs(db, tabOpts, buildTime)]);

    console.log(joinArrays('', logBundleResult(bundleResult), logTabResult(tabResult))
      .join('\n'));

    await db.write();
    await copy();
  });

export { tabCommand } from './tab';
