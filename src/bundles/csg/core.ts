/* [Imports] */
import type { CsgModuleState, RenderGroupManager } from './utilities';

/* [Exports] */
// After bundle initialises, tab will need to re-init on its end, as they run
// independently and are different versions of Core
export class Core {
  private static moduleState: CsgModuleState | null = null;

  public static initialize(csgModuleState: CsgModuleState): void {
    Core.moduleState = csgModuleState;
  }

  public static getRenderGroupManager(): RenderGroupManager {
    const moduleState: CsgModuleState = Core.moduleState as CsgModuleState;

    return moduleState.renderGroupManager;
  }

  public static nextComponent(): number {
    const moduleState: CsgModuleState = Core.moduleState as CsgModuleState;

    return moduleState.nextComponent();
  }
}
