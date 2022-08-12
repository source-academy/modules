import copy from './misc';
import { buildBundles } from './bundles';
import { buildTabs } from './tabs';
import { buildDocs, buildJsons } from './docs';
import { getDb } from './buildUtils';

export default async () => {
  const db = await getDb();
  await Promise.all([
    buildBundles(db),
    buildTabs(db),
    buildDocs(db)
      .then(() => buildJsons(db)),
  ]);
  await copy();
};
