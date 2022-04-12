/* [Imports] */
import { CsgModuleState, RenderGroupManager } from './utilities.js';

/* [Exports] */
export class BundleCore {
  static moduleState: CsgModuleState | null = null;

  static initialize(csgModuleState: CsgModuleState): void {
    BundleCore.moduleState = csgModuleState;
  }

  static getRenderGroupManager(): RenderGroupManager {
    let moduleState: CsgModuleState = BundleCore.moduleState as CsgModuleState;
    return moduleState.renderGroupManager;
  }
}
