/**
 * This file contains the types used to represent GameObjects
 */

/** Represents (x,y) worldspace position of GameObject. */
export type PositionXY = [number, number];

/** Represents (x,y) worldspace  scale of GameObject. */
export type ScaleXY = [number, number];

/** Represents the (width, height) dimensions of the game canvas. */
export type DimensionsXY = [number, number];

/** Represents the (red, green, blue, alpha) of a color. */
export type ColorRGBA = [number, number, number, number];

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

/** Represents (x,y) flip state of GameObject. */
export type FlipXY = [boolean, boolean];

/**
 * Represents the render properties of a GameObject.
 * @property {Color} color - The color associated with the GameObject tint.
 * @property {FlipXY} flip - The (x,y) flip state of the GameObject.
 * @property {boolean} visible - The render-visibility of the GameObject.
 */
export type RenderProps = {
  color: Color;
  flip: FlipXY;
  visible: boolean;
};

/**
 * Represents the interactable properties of a GameObject.
 * @property {boolean} hitboxActive - The interactable state of the hitbox associated with the GameObject in the canvas.
 */
export type InteractableProps = {
  hitboxActive: boolean;
};

/**
 * Represents the RGBA color properties of a GameObject.
 */
export type Color = {
  red: number,
  green: number,
  blue: number,
  alpha: number,
};

/**
 * Represents a simplied representation of the phaser type of the GameObject.
 * Which is represented as a void property on the types.
 */
export type PhaserType = 'Shape' | 'Sprite' | 'Text';

/**
 * Represents the shape of a GameObject.
 */
export type Shape = {
  Shape: void;
  baseShape: BaseShape;
};

/**
 * Represents the base shape of a GameObject.
 */
export type BaseShape = CircleProps | RectangleProps | TriangleProps;

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
  Text: void;
  text: string;
};

/**
 * Represents the rendered sprite of a GameObject.
 */
export type Sprite = {
  Sprite: void;
  image_url: string;
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
