/**
 * This file contains the types used to represent GameObjects.
 */

/** Represents (x,y) worldspace position of a GameObject. */
export type PositionXY = [number, number];

/** Represents (x,y) worldspace  scale of a GameObject. */
export type ScaleXY = [number, number];

/** Represents the (width, height) dimensions of the game canvas. */
export type DimensionsXY = [number, number];

/** Represents the (red, green, blue, alpha) of a color of a GameObject. */
export type ColorRGBA = [number, number, number, number];

/** Represents (x,y) flip state of GameObject. */
export type FlipXY = [boolean, boolean];

/**
 * Represents transform properties of a GameObject in worldspace.
 * @property {PositionXY} position - The (x,y) worldspace position of the GameObject.
 * @property {ScaleXY} xScale - The (x,y) worldspace scale of the GameObject.
 * @property {number} rotation - The worldspace rotation of the GameObject, in radians counter-clockwise.
 */
export type TransformProps = {
  position: PositionXY;
  scale: ScaleXY;
  rotation: number;
};

/**
 * Represents the render properties of a GameObject.
 * @property {ColorRGBA} color - The color associated with the GameObject tint.
 * @property {FlipXY} flip - The (x,y) flip state of the GameObject.
 * @property {boolean} visible - The render-visibility of the GameObject.
 */
export type RenderProps = {
  color: ColorRGBA;
  flip: FlipXY;
  isVisible: boolean;
};

/**
 * Represents the interactable properties of a GameObject.
 * @property {boolean} isHitboxActive - The interactable state of the hitbox associated with the GameObject in the canvas.
 */
export type InteractableProps = {
  isHitboxActive: boolean;
};

/**
 * Represents a rectangle of a GameObject's shape.
 */
export type RectangleProps = {
  width: number;
  height: number;
};

/**
 * Represents a isosceles triangular shape of a GameObject's shape.
 */
export type TriangleProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
};

/**
 * Represents a circular shape of a GameObject's shape.
 */
export type CircleProps = {
  radius: number;
};

/**
 * Represents the rendered text of a GameObject.
 */
export type DisplayText = {
  text: string;
};

/**
 * Represents the rendered sprite of a GameObject.
 */
export type Sprite = {
  imageUrl: string;
};

// =============================================================================
// Other types
// =============================================================================

/**
 * Represent the return type of build_game(), which is accessed in the debuggerContext.result.value.
 */
export type BuildGame = {
  toReplString: () => string;
  gameConfig;
};

/**
 * Represents an update function that is user-defined.
 * userSuppliedState is an array that stores whatever the user sets it to be,
 * which can be assessed and modified on the next frame.
 */
export type UpdateFunction = (userSuppliedState: Array<any>) => void;

/**
 * Represents a runtime error, that is not an instance of Error.
 */
export type ExceptionError = {
  error: Error;
  location: {
    start: {
      line: number;
    };
  };
};

/**
 * Represents the Phaser Game Object types that are used.
 */
export type PhaserGameObject = Phaser.GameObjects.Sprite | Phaser.GameObjects.Text | Phaser.GameObjects.Shape;
