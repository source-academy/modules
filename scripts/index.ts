import build from './build';
import buildDocs from './build/docs';
import create from './templates';
import chalk from 'chalk';

const tasks = {
  build,
  'build:docs': buildDocs,
  create,
};

async function main() {
  if (process.argv.length < 3) {
    console.log(chalk.green('Available tasks:'));
    console.log(Object.keys(tasks)
      .map((each) => `• ${each}`)
      .join('\n'));
    return;
  }

  const task = tasks[process.argv[2]];

  if (!task) console.error(chalk.redBright(`Unknown task: ${process.argv[2]}`));
  else await task();
}

main()
  .then(() => process.exit(0));
// Something is keeping the process alive after it should die
// but I haven't found how to close it so process.exit will have to do
