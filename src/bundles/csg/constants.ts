/* [Imports] */
import { IconSize } from '@blueprintjs/core';

/* [Exports] */

//NOTE Silver is in here to avoid circular dependencies, instead of in
// functions.ts with the other colour strings
export const SILVER: string = '#AAAAAA';
export const DEFAULT_COLOR: string = SILVER;

// Values extracted from the styling of the frontend
export const SA_TAB_BUTTON_WIDTH: string = '40px';
export const SA_TAB_ICON_SIZE: number = IconSize.LARGE;

export const BP_TOOLTIP_PADDING: string = '10px 12px';
export const BP_TAB_BUTTON_MARGIN: string = '20px';
export const BP_TAB_PANEL_MARGIN: string = '20px';
export const BP_BORDER_RADIUS: string = '3px';
export const STANDARD_MARGIN: string = '10px';

export const BP_TEXT_COLOR: string = '#F5F8FA';
export const BP_TOOLTIP_BACKGROUND_COLOR: string = '#E1E8ED';
export const BP_ICON_COLOR: string = '#A7B6C2';
export const ACE_GUTTER_TEXT_COLOR: string = '#8091A0';
export const ACE_GUTTER_BACKGROUND_COLOR: string = '#34495E';
export const BP_TOOLTIP_TEXT_COLOR: string = '#394B59';

// Renderer grid constants
export const MAIN_TICKS: number = 1;
export const SUB_TICKS: number = MAIN_TICKS / 4;
export const GRID_PADDING: number = MAIN_TICKS;
export const ROUND_UP_INTERVAL: number = MAIN_TICKS;

// Controls zoom constants
export const ZOOM_TICK_SCALE: number = 0.1;

// Controls rotation constants
export const ROTATION_SPEED: number = 0.0015;

// Controls pan constants
export const X_FACTOR: number = 1;
export const Y_FACTOR: number = 0.75;
