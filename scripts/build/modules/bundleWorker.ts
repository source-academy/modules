import { parentPort, workerData } from 'worker_threads';

import { buildBundle } from './bundle';

const result = await buildBundle(workerData);
parentPort.postMessage(result);
