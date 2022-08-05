import { series } from 'gulp';
import copy from './copyfile';
import { buildBundles } from './bundles';
import { buildTabs } from './tabs';
import { buildDocs } from './docs';
import { getDb } from './utilities';

export default series(
  Object.assign(
    async () => {
      const db = await getDb();
      await Promise.all([buildBundles(db), buildTabs(db), buildDocs(db)]);
    },
    {
      displayName: 'build',
      description: 'Build bundles, tabs and documentation',
    }
  ),
  copy
);
