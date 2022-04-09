/* [Imports] */
import { IconName } from "@blueprintjs/icons";
import { DebuggerContext } from '../../typings/type_helpers';

/* [Exports] */

// React Component Props for the CSG canvas holder
export type CanvasProps = {
  debuggerContext: DebuggerContext;
};

// React Component State for the CSG canvas holder
export type CanvasState = {};

// React Component Props for a control hint
export type HintProps = {
  tooltipText: string;
  iconName: IconName;
};

// React Component State for a control hint
export type HintState = {
  showTooltip: boolean;
};
