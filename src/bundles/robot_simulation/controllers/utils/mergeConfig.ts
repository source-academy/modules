import * as _ from 'lodash';

export type RecursivePartial<T> = T extends object ? {
  [P in keyof T]?: RecursivePartial<T[P]>;
} : T;

export const mergeConfig = <T> (defaultConfig:T, userConfig?: RecursivePartial<T>) :T => {
  if (userConfig === undefined) {
    return defaultConfig;
  }
  return _.merge({ ...defaultConfig }, userConfig);
};
