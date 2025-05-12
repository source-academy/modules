import type { DeepPartial } from '@sourceacademy/modules-lib/types';
import * as _ from 'lodash';

export const mergeConfig = <T> (defaultConfig:T, userConfig?: DeepPartial<T>) :T => {
  if (userConfig === undefined) {
    return defaultConfig;
  }
  return _.merge({ ...defaultConfig }, userConfig);
};
