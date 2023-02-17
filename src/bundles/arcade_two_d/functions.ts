/**
 * The module `arcade_two_d` is a wrapper for the Phaser.io game engine.
 * It provides functions for manipulating GameObjects in a canvas.
 *
 * A *GameObject* is defined by its transform and rendered object.
 * @module arcade_two_d
 * @author Titus Chew Xuan Jun
 * @author Xenos Fiorenzo Anong
 */

import {
  GameObject, RenderableGameObject, ShapeGameObject, SpriteGameObject, TextGameObject,
} from './gameobject';

import {
  BaseShape,
  DisplayText,
  InteractableProps,
  RenderProps,
  Shape,
  BuildGame,
  TransformProps,
  Sprite,
  UpdateFunction,
  Config,
} from './types';

import {
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
  DEFAULT_SCALE,
  DEFAULT_FPS,
  DEFAULT_VOLUME,
  MAX_HEIGHT,
  MIN_HEIGHT,
  MAX_WIDTH,
  MIN_WIDTH,
  MAX_SCALE,
  MIN_SCALE,
  MAX_FPS,
  MIN_FPS,
  MAX_VOLUME,
  MIN_VOLUME,
} from './constants';

// Global Variables
let WIDTH: number = DEFAULT_WIDTH;
let HEIGHT: number = DEFAULT_HEIGHT;
let SCALE: number = DEFAULT_SCALE;
let FPS: number = DEFAULT_FPS;
let VOLUME: number = DEFAULT_VOLUME;

let prevTime: number | null = null;
let totalElapsedTime: number = 0;

let update: UpdateFunction;

// =============================================================================
// Shape references
// =============================================================================


// =============================================================================
// Creation of GameObjects
// =============================================================================

/**
 * Creates a GameObject that contains a shape reference.
 *
 * @param shape Shape reference
 * @category Create
 */
export const createShapeGameObject: (baseShape: BaseShape) => ShapeGameObject = (baseShape: BaseShape) => {
  const transform: TransformProps = {
    position: [0, 0],
    scale: [0, 0],
    rotation: 0,
  };
  const renderProps: RenderProps = {
    color: {
      red: 255,
      green: 255,
      blue: 255,
      alpha: 255,
    },
    flip: [false, false],
    visible: true,
    renderedImage: {
      baseShape,
    } as Shape,
  };
  const interactableProps: InteractableProps = {
    hitboxActive: true,
  };

  const gameObject = new ShapeGameObject(transform, renderProps, interactableProps);

  return gameObject;
};

/**
 * Creates a GameObject that contains a text reference.
 *
 * @param text Text string displayed
 * @category Create
 */
export const createTextGameObject: (text: string) => TextGameObject = (text: string) => {
  const transform: TransformProps = {
    position: [0, 0],
    scale: [0, 0],
    rotation: 0,
  };
  const renderProps: RenderProps = {
    color: {
      red: 255,
      green: 255,
      blue: 255,
      alpha: 255,
    },
    flip: [false, false],
    visible: true,
    renderedImage: {
      text,
    } as DisplayText,
  };
  const interactableProps: InteractableProps = {
    hitboxActive: true,
  };

  const gameObject = new TextGameObject(transform, renderProps, interactableProps);

  return gameObject;
};

/**
 * Creates a GameObject that contains a Sprite image reference.
 *
 * @param image_url The image URL of the sprite.
 * @category Create
 */
export const createSpriteGameObject: (image_url: string) => SpriteGameObject = (image_url: string) => {
  const transform: TransformProps = {
    position: [0, 0],
    scale: [0, 0],
    rotation: 0,
  };
  const renderProps: RenderProps = {
    color: {
      red: 255,
      green: 255,
      blue: 255,
      alpha: 255,
    },
    flip: [false, false],
    visible: true,
    renderedImage: {
      image_url,
    } as Sprite,
  };
  const interactableProps: InteractableProps = {
    hitboxActive: true,
  };

  const gameObject = new SpriteGameObject(transform, renderProps, interactableProps);

  return gameObject;
};

// =============================================================================
// Manipulation of GameObjects
// =============================================================================

/**
 * Updates the position transform of the GameObject.
 *
 * @param gameObject GameObject reference
 * @param coordinates [x, y] coordinates of new position
 * @example
 * ```
 * updateGameObjectPosition(createTextGameObject(""), [1, 1]);
 * ```
 * @category Update
 */
export const updateGameObjectPosition: (gameObject: GameObject, [x, y]: [number, number]) => void
= (gameObject: GameObject, [x, y]: [number, number]) => {
  gameObject.setTransform({
    ...gameObject.getTransform(),
    position: [x, y],
  });
};

/**
 * Updates the scale transform of the GameObject.
 *
 * @param gameObject GameObject reference
 * @param scale [x, y] scale of the size of the GameObject
 * @example
 * ```
 * updateGameObjectScale(createTextGameObject(""), [1, 1]);
 * ```
 * @category Update
 */
export const updateGameObjectScale: (gameObject: GameObject, [x, y]: [number, number]) => void
= (gameObject: GameObject, [x, y]: [number, number]) => {
  gameObject.setTransform({
    ...gameObject.getTransform(),
    scale: [x, y],
  });
};

/**
 * Updates the rotation transform of the GameObject.
 *
 * @param gameObject GameObject reference
 * @param radians The value in radians to rotate the GameObject counter-clockwise by
 * @example
 * ```
 * updateGameObjectRotation(createTextGameObject(""), math_PI);
 * ```
 * @category Update
 */
export const updateGameObjectRotation: (gameObject: GameObject, radians: number) => void
= (gameObject: GameObject, radians: number) => {
  gameObject.setTransform({
    ...gameObject.getTransform(),
    rotation: radians,
  });
};

/**
 * Updates the text of the TextGameObject.
 *
 * @param textGameObject TextGameObject reference
 * @param text The updated text of the TextGameObject
 * @category Update
 */
export const updateGameObjectText: (textGameObject: TextGameObject, text: string) => void
= (textGameObject: TextGameObject, text: string) => {
  console.log(textGameObject);
  console.log(textGameObject instanceof GameObject);
  console.log(textGameObject instanceof TextGameObject);
  if (textGameObject instanceof TextGameObject) {
    textGameObject.setText({
      text,
    } as DisplayText);
    return;
  }
  throw new Error('Cannot update text onto a non TextGameObject');
};

// =============================================================================
// Querying of GameObjects
// =============================================================================

/**
 * Queries the id of the GameObject.
 *
 * @param gameObject GameObject reference
 * @returns the id of the GameObject reference
 * @example
 * ```
 * queryGameObjectId(createTextGameObject(""));
 * ```
 * @category Query
 */
export const queryGameObjectId: (gameObject: GameObject) => number = (gameObject: GameObject) => gameObject.id;

/**
 * Queries the [x, y] position transform of the GameObject.
 *
 * @param gameObject GameObject reference
 * @returns [x, y] position as an array
 * @category Query
 */
export const queryGameObjectPosition: (gameObject: GameObject) => [number, number]
= (gameObject: GameObject) => gameObject.getTransform().position;

/**
 * Queries the z rotation transform of the GameObject.
 *
 * @param gameObject GameObject reference
 * @returns z rotation as a number
 * @category Query
 */
export const queryGameObjectRotation: (gameObject: GameObject) => number
= (gameObject: GameObject) => gameObject.getTransform().rotation;

/**
 * Queries the [x, y] scale transform of the GameObject.
 *
 * @param gameObject GameObject reference
 * @returns [x, y] scale as an array
 * @category Query
 */
export const queryGameObjectScale: (gameObject: GameObject) => [number, number]
= (gameObject: GameObject) => gameObject.getTransform().scale;

/**
 * Queries the [r, g, b, a] color property of the GameObject.
 *
 * @param gameObject GameObject reference
 * @returns [r, g, b, a] color as an array
 * @category Query
 */
export const queryGameObjectColor: (gameObject: RenderableGameObject) => [number, number, number, number]
= (gameObject: RenderableGameObject) => gameObject.getColor();

/**
 * Queries the text of a Text GameObject.
 *
 * @param textGameObject TextGameObject reference
 * @returns text string
 * @category Query
 */
export const queryGameObjectText: (textGameObject: TextGameObject) => string
= (textGameObject: TextGameObject) => {
  if (textGameObject instanceof TextGameObject) {
    return textGameObject.getText().text;
  }
  throw new Error('Cannot query text from non TextGameObject');
};

// =============================================================================
// Game configuration
// =============================================================================

/**
 * Private function.
 * @param num the number
 * @param min the minimum value allowed for that number
 * @param max the maximum value allowed for that number
 * @returns a number within the range.
 * @hidden
 */
const withinRange: (num: number, min: number, max: number) => number
= (num: number, min: number, max: number) => {
  if (num > max) {
    return max;
  }
  if (num < min) {
    return min;
  }
  return num;
};

/**
 * Sets the frames per second of the canvas, which should be between the
 * MIN_FPS and MAX_FPS.
 * This function should not be called in the update function.
 *
 * @param fps The frames per second of canvas to set.
 * @category Configuration
 */
export const set_fps: (fps: number) => void = (fps: number) => {
  FPS = withinRange(fps, MIN_FPS, MAX_FPS);
};

/**
 * Sets the dimensions of the canvas, which should be between the
 * min and max widths and height.
 *
 * @param dimensions An array containing [width, height] of the canvas.
 * @example
 * ```
 * // sets the width as 500 and height as 400
 * set_dimensions([500, 400]);
 * ```
 * @catetory Configuration
 */
export const set_dimensions: (dimensions: [number, number]) => void = (dimensions: [number, number]) => {
  if (dimensions.length !== 2) {
    throw new Error('Dimensions must be a 2-element array');
  }
  WIDTH = withinRange(dimensions[0], MIN_WIDTH, MAX_WIDTH);
  HEIGHT = withinRange(dimensions[1], MIN_HEIGHT, MAX_HEIGHT);
};

/**
 * Sets the scale of the pixels in the canvas.
 * Scale is like the zoom level.
 * If scale is doubled, then the number of units across would be halved.
 *
 * @param scale The scale of the canvas to set.
 * @example
 * ```
 * // sets the scale of the canvas to 2.
 * set_scale(2);
 * ```
 * @category Configuration
 */
export const set_scale: (scale: number) => void = (scale: number) => {
  SCALE = withinRange(scale, MIN_SCALE, MAX_SCALE);
};

/**
 * Sets the sound volume in the canvas.
 * Scale is like the zoom level.
 * If scale is doubled, then the number of units across would be halved.
 *
 * @param volume The volume of the canvas to set.
 * @example
 * ```
 * // sets the scale of the canvas to 2.
 * set_volume(0.5);
 * ```
 * @category Configuration
 */
export const set_volume: (volume: number) => void = (volume: number) => {
  VOLUME = withinRange(volume, MIN_VOLUME, MAX_VOLUME);
};

// =============================================================================
// Game loop
// =============================================================================

/**
 * Detects if a key input is pressed down.
 * This function must be called in the update function for it to properly detect inputs.
 *
 * @param keycode The keycode of the key.
 * @returns True, in the frame the key is pressed down.
 * @example
 * ```
 * // this returns true if "a" is pressed down.
 * input_down("a");
 * ```
 * @catagory Input
 */
export const input_down: (keycode: string) => boolean = (keycode: string) => {
  // TODO
  // Phaser.Input.Keyboard can be accessed from within a Scene.
  return false;
};

/**
 * Private function to initialise the Phaser Game.
 *
 * @hidden
 */
function init() {
  // this should allow Phaser to preload assets and create the GameObjects.
  // this could return a list of gameObjects to create?
  // TODO
  console.log('GameObjects Array: to be created in Phaser');
  console.log(GameObject.getGameObjectsArray);
}

/**
 * The function that sets the update loop.
 * (This function could be redundant if update_function is supplied as a param to build_game.)
 * Sets the update function that is used in build_game.
 *
 * @param update_function A user-defined update_function, that takes in an array as a parameter.
 * @example
 * ```
 * update_loop((update_function) => {
 *   // your code here
 * })
 * ```
 * @category Misc
 */
export const update_loop: (update_function: UpdateFunction) => void = (update_function: UpdateFunction) => {
  update = update_function;
};

/**
 * Builds the game.
 * Processes the initialization and updating of the game.
 * All GameObjects and their properties are passed into the game.
 * This should be the last function called in the Source program.
 * @example
 * ```
 * build_game();
 * ```
 * @category Misc
 */
export const build_game: () => BuildGame = () => {
  const config = {
    width: WIDTH,
    height: HEIGHT,
    scale: SCALE,
    volume: VOLUME,
    fps: FPS,
  } as Config;
  return {
    toReplString: () => '[Arcade 2D]',
    config,
    init,
    update,
  };
};

// =============================================================================
// Private functions
// =============================================================================
