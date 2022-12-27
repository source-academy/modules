import { parentPort, workerData } from 'worker_threads';

import { buildTab } from './tab';
parentPort.postMessage(await buildTab(workerData));
