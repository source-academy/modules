import * as _ from 'lodash';
import type { DeepPartial } from '../../../../common/deepPartial';

export const mergeConfig = <T> (defaultConfig:T, userConfig?: DeepPartial<T>) :T => {
  if (userConfig === undefined) {
    return defaultConfig;
  }
  return _.merge({ ...defaultConfig }, userConfig);
};
