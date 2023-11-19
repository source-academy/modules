// This file contains the default values of the game canvas and GameObjects.

import { type InteractableProps, type RenderProps, type TransformProps } from './types';

// Default values of game
export const DEFAULT_WIDTH: number = 600;
export const DEFAULT_HEIGHT: number = 600;
export const DEFAULT_SCALE: number = 1;
export const DEFAULT_FPS: number = 30;
export const DEFAULT_VOLUME: number = 0.5; // Unused

// Interval of allowed values of game
export const MAX_HEIGHT: number = 1000;
export const MIN_HEIGHT: number = 100;
export const MAX_WIDTH: number = 1000;
export const MIN_WIDTH: number = 100;
export const MAX_SCALE: number = 10;
export const MIN_SCALE: number = 0.1;
export const MAX_FPS: number = 120;
export const MIN_FPS: number = 1;
export const MAX_VOLUME: number = 1;
export const MIN_VOLUME: number = 0;

// A mode where the hitboxes is shown in the canvas for debugging purposes,
// and debug log information
export const DEFAULT_DEBUG_STATE: boolean = false;

// Default values for GameObject properties
export const DEFAULT_TRANSFORM_PROPS: TransformProps = {
  position: [0, 0],
  scale: [1, 1],
  rotation: 0,
};

export const DEFAULT_RENDER_PROPS: RenderProps = {
  color: [255, 255, 255, 255],
  flip: [false, false],
  isVisible: true,
};

export const DEFAULT_INTERACTABLE_PROPS: InteractableProps = {
  isHitboxActive: true,
};

// Default values of Phaser scene
export const DEFAULT_PATH_PREFIX: string = 'https://source-academy-assets.s3-ap-southeast-1.amazonaws.com/';
