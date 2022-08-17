import { ModuleContexts } from '../../typings/type_helpers.js';
import gameFuncs from './functions';
import { GameModuleParams } from './types.js';

export default (
  moduleParams: GameModuleParams,
  _moduleContexts: ModuleContexts,
) => gameFuncs(moduleParams);
