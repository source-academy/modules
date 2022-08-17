import { buildBundlesAndTabs, getBundlesAndTabs } from './build';
import { buildDocsAndJsons, getJsonsToBuild } from './docs';
import { DBType, getDb, Opts } from './buildUtils';
import type { Low } from 'lowdb/lib';
import copy from './misc';

const getThingsToBuild = async (db: Low<DBType>, { force, modules, tabs, jsons }: Opts) => {
  const [jsonOpts, bundleOpts] = await Promise.all([getJsonsToBuild(db, {
    force,
    jsons,
  }), getBundlesAndTabs(db, {
    force,
    modules,
    tabs,
  })]);

  return {
    jsonOpts,
    bundleOpts,
  };
};

/**
 * Build bundles, tabs, jsons and docs
 */
export default async (opts: Opts) => {
  const db = await getDb();
  const { jsonOpts, bundleOpts } = await getThingsToBuild(db, opts);
  await Promise.all([buildBundlesAndTabs(db, bundleOpts, opts.verbose), buildDocsAndJsons(db, jsonOpts, opts.verbose)]);
  await copy();
};
