const print = require('./print');
const modules = require('./module');
const tabs = require('./tab');

async function main() {
  try {
    const mode = await askMode();
    if (mode === 'module') await modules.addNew();
    else if (mode === 'tab') await tabs.addNew();
  } catch (error) {
    print.error(`ERROR: ${error.message}`);
    print.info(`Terminating module app...`);
  } finally {
    print.rl.close();
  }
}

async function askMode() {
  const mode = await print.askQuestion(
    'What would you like to create? (module/tab)'
  );
  if (mode !== 'module' && mode !== 'tab') {
    print.warn("Please answer with only 'module' or 'tab'.");
    return askMode();
  }
  return mode;
}

main();
