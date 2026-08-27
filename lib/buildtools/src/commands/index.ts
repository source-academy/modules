import { getMainCommand } from './main.js';

const { emitWarning } = process;
process.emitWarning = (warning, ...args) => {
  // Suppresses experimental warnings emitted by Node
  const [name] = args;
  if (name === 'ExperimentalWarning') return;
  // @ts-expect-error Some weird typing going on here
  emitWarning(warning, ...args);
};

await getMainCommand().parseAsync();
