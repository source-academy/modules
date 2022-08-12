import build from './build';
import buildBundles from './build/bundles';
import buildTabs from './build/tabs';
import buildDocs from './build/docs';
import create from './templates';

const tasks = {
  build,
  'build:bundles': buildBundles,
  'build:tabs': buildTabs,
  'build:docs': buildDocs,
  create,
};

function main() {
  return tasks[process.argv[2]]();
}

main();
