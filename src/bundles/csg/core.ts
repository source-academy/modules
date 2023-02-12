/* [Imports] */
import type { CsgModuleState, RenderGroupManager } from './utilities.js';

/* [Exports] */
// After bundle initialises, tab will need to re-init on its end, as they run
// independently and are different versions of Core
export class Core {
  private static moduleState: CsgModuleState | null = null;

  public static initialize(csgModuleState: CsgModuleState): void {
    Core.moduleState = csgModuleState;
  }

  public static getRenderGroupManager(): RenderGroupManager {
    let moduleState: CsgModuleState = Core.moduleState as CsgModuleState;

    return moduleState.renderGroupManager;
  }

  public static nextComponent(): number {
    let moduleState: CsgModuleState = Core.moduleState as CsgModuleState;

    return moduleState.nextComponent();
  }
}
