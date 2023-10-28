/* [Imports] */
import { type IconName } from '@blueprintjs/icons';



/* [Exports] */

// React Component Props for the CSG canvas holder
export type CanvasHolderProps = {
  componentNumber: number;
};

// React Component State for the CSG canvas holder
export type CanvasHolderState = {
  isContextLost: boolean;
};

// React Component Props for a control hint
export type HintProps = {
  tooltipText: string;
  iconName: IconName;
};
