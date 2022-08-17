/* [Imports] */
import { CsgModuleState, RenderGroupManager } from './utilities.js';

/* [Exports] */
// After bundle initialises, tab will need to reinit on its end, as they run
// independently and are different versions of Core. Same reason why we need
// looseInstanceof()
export class Core {
  private static moduleState: CsgModuleState | null = null;

  static initialize(csgModuleState: CsgModuleState): void {
    Core.moduleState = csgModuleState;
  }

  static getRenderGroupManager(): RenderGroupManager {
    let moduleState: CsgModuleState = Core.moduleState as CsgModuleState;
    return moduleState.renderGroupManager;
  }
}
