/* [Imports] */
import {
  CsgModuleState,
  RenderGroupManager,
} from '../../bundles/csg/utilities.js';

/* [Exports] */
// Tabs cannot get the module state from the BundleCore as the bundle runs
// independent of the tab, ie trying to get it will always be null. Same reason
// why we need looseInstanceof()
export class TabCore {
  static moduleState: CsgModuleState | null = null;

  static initialize(csgModuleState: CsgModuleState): void {
    TabCore.moduleState = csgModuleState;
  }

  static getRenderGroupManager(): RenderGroupManager {
    let moduleState: CsgModuleState = TabCore.moduleState as CsgModuleState;
    return moduleState.renderGroupManager;
  }
}
