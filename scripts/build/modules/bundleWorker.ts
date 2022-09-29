import { parentPort, workerData } from 'worker_threads';

import { buildBundle } from './bundle';

const { elapsed, result } = await buildBundle(workerData);
parentPort.postMessage({
  ...result,
  elapsed: result.result !== 'error' ? elapsed : null,
});
