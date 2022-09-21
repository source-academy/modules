import { parentPort, workerData } from 'worker_threads';

import { buildTab } from './tab';
const result = await buildTab(workerData);
parentPort.postMessage(result);
