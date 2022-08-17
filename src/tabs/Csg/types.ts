/* [Imports] */
import { IconName } from '@blueprintjs/icons';
import { CsgModuleState } from '../../bundles/csg/utilities.js';

/* [Exports] */

// React Component Props for the CSG canvas holder
export type CanvasHolderProps = {
  moduleState: CsgModuleState;
  componentNumber: number;
};

// React Component State for the CSG canvas holder
export type CanvasHolderState = {
  contextLost: boolean;
};

// React Component Props for a control hint
export type HintProps = {
  tooltipText: string;
  iconName: IconName;
};

// React Component State for a control hint
export type HintState = {
  showTooltip: boolean;
};
