import type { Controller } from '../../../engine';

export type Sensor<T = any> = Controller & { sense: () => T };
