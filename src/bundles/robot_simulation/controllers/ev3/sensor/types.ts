import { type Controller } from '../../../engine';

export type Sensor<T> = Controller & { sense: () => T };
