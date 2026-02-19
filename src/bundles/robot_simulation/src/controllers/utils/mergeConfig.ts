import type { DeepPartial } from '@sourceacademy/modules-lib/types';
import { merge } from 'es-toolkit';

export const mergeConfig = <T extends Record<PropertyKey, unknown>>(defaultConfig: T, userConfig?: DeepPartial<T>): T => {
  if (userConfig === undefined) {
    return defaultConfig;
  }
  return merge({ ...defaultConfig }, userConfig);
};
