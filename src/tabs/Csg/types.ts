/* [Imports] */
import { IconName } from '@blueprintjs/icons';



/* [Exports] */

// React Component Props for the CSG canvas holder
export type CanvasHolderProps = {
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
