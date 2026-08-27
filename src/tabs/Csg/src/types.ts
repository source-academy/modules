/* [Imports] */
import type { IconName } from '@blueprintjs/core';
import type { RenderedScene } from './jscad/renderer';

/* [Exports] */

// React Component Props for the CSG canvas holder
export type CanvasHolderProps = {
  componentNumber: number;
  scene: RenderedScene;
};

// React Component Props for a control hint
export type HintProps = {
  tooltipText: string;
  iconName: IconName;
};
