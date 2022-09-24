import { parentPort, workerData } from 'worker_threads';

import { buildTab } from './tab';
const { elapsed, result } = await buildTab(workerData);
parentPort.postMessage({
  ...result,
  elapsed: result.result !== 'error' ? elapsed : null,
});
