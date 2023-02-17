import { parentPort, workerData } from 'worker_threads';

import { buildBundle } from './bundle';

parentPort.postMessage(await buildBundle(workerData));
