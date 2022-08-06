import { series } from 'gulp';
import copy from './misc';
import { buildBundles } from './bundles';
import { buildTabs } from './tabs';
import { buildDocs, buildJsons } from './docs';
import { getDb } from './utilities';

export default series(
  Object.assign(
    async () => {
      const db = await getDb();
      await Promise.all([buildBundles(db), buildTabs(db), buildDocs(), buildJsons(db)]);
    },
    {
      displayName: 'build',
      description: 'Build bundles, tabs and documentation',
    }
  ),
  copy
);
