/* [Imports] */
import { CsgModuleState } from './utilities.js';

/* [Main] */
let moduleState: CsgModuleState | null = null;

export function initialize(csgModuleState: CsgModuleState): void {
  moduleState = csgModuleState;
}

export function getModuleState(): CsgModuleState {
  return moduleState as CsgModuleState;
}
