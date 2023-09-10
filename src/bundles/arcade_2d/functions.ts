/**
 * The module `arcade_2d` is a wrapper for the Phaser.io game engine.
 * It provides functions for manipulating GameObjects in a canvas.
 *
 * A *GameObject* is defined by its transform and rendered object.
 *
 * @module arcade_2d
 * @author Titus Chew Xuan Jun
 * @author Xenos Fiorenzo Anong
 */

import Phaser from 'phaser';
import {
  PhaserScene,
  gameState,
} from './phaserScene';
import {
  GameObject,
  RenderableGameObject,
  type ShapeGameObject,
  SpriteGameObject,
  TextGameObject,
  RectangleGameObject,
  CircleGameObject,
  TriangleGameObject, InteractableGameObject,
} from './gameobject';
import {
  type DisplayText,
  type BuildGame,
  type Sprite,
  type UpdateFunction,
  type RectangleProps,
  type CircleProps,
  type TriangleProps,
  type FlipXY,
  type ScaleXY,
  type PositionXY,
  type DimensionsXY,
  type ColorRGBA,
} from './types';
import {
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
  DEFAULT_SCALE,
  DEFAULT_FPS,
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
  DEFAULT_DEBUG_STATE,
  DEFAULT_TRANSFORM_PROPS,
  DEFAULT_RENDER_PROPS,
  DEFAULT_INTERACTABLE_PROPS,
} from './constants';
import { AudioClip } from './audio';

// =============================================================================
// Global Variables
// =============================================================================

// Configuration for game initialization.
export const config = {
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  scale: DEFAULT_SCALE,
  fps: DEFAULT_FPS,
  isDebugEnabled: DEFAULT_DEBUG_STATE,
  // User update function
  userUpdateFunction: (() => {}) as UpdateFunction,
};

// =============================================================================
// Creation of GameObjects
// =============================================================================

/**
 * Creates a RectangleGameObject that takes in rectangle shape properties.
 *
 * @param width The width of the rectangle
 * @param height The height of the rectangle
 * @example
 * ```
 * const rectangle = create_rectangle(100, 100);
 * ```
 * @category GameObject
 */
export const create_rectangle: (width: number, height: number) => ShapeGameObject = (width: number, height: number) => {
  const rectangle = {
    width,
    height,
  } as RectangleProps;
  return new RectangleGameObject(DEFAULT_TRANSFORM_PROPS, DEFAULT_RENDER_PROPS, DEFAULT_INTERACTABLE_PROPS, rectangle);
};

/**
 * Creates a CircleGameObject that takes in circle shape properties.
 *
 * @param width The width of the rectangle
 * @param height The height of the rectangle
 * ```
 * const circle = create_circle(100);
 * ```
 * @category GameObject
 */
export const create_circle: (radius: number) => ShapeGameObject = (radius: number) => {
  const circle = {
    radius,
  } as CircleProps;
  return new CircleGameObject(DEFAULT_TRANSFORM_PROPS, DEFAULT_RENDER_PROPS, DEFAULT_INTERACTABLE_PROPS, circle);
};

/**
 * Creates a TriangleGameObject that takes in an downright isosceles triangle shape properties.
 *
 * @param width The width of the isosceles triangle
 * @param height The height of the isosceles triangle
 * ```
 * const triangle = create_triangle(100, 100);
 * ```
 * @category GameObject
 */
export const create_triangle: (width: number, height: number) => ShapeGameObject = (width: number, height: number) => {
  const triangle = {
    x1: 0,
    y1: 0,
    x2: width,
    y2: 0,
    x3: width / 2,
    y3: height,
  } as TriangleProps;
  return new TriangleGameObject(DEFAULT_TRANSFORM_PROPS, DEFAULT_RENDER_PROPS, DEFAULT_INTERACTABLE_PROPS, triangle);
};

/**
 * Creates a GameObject that contains a text reference.
 *
 * @param text Text string displayed
 * @example
 * ```
 * const helloworld = create_text("Hello\nworld!");
 * ```
 * @category GameObject
 */
export const create_text: (text: string) => TextGameObject = (text: string) => {
  const displayText = {
    text,
  } as DisplayText;
  return new TextGameObject(DEFAULT_TRANSFORM_PROPS, DEFAULT_RENDER_PROPS, DEFAULT_INTERACTABLE_PROPS, displayText);
};

/**
 * Creates a GameObject that contains a Sprite image reference.
 * Source Academy assets can be used by specifying path without the prepend.
 * Source Academy assets can be found at https://source-academy-assets.s3-ap-southeast-1.amazonaws.com/ with Ctrl+f ".png".
 * Phaser assets can be found at https://labs.phaser.io/assets/.
 * If Phaser assets are unavailable, go to https://github.com/photonstorm/phaser3-examples/tree/master/public/assets
 * to get the asset path and append it to `https://labs.phaser.io/assets/`.
 * Assets from other websites can also be used if they support Cross-Origin Resource Sharing (CORS), but the full path must be specified.
 *
 * @param image_url The image URL of the sprite
 * @example
 * ```
 * const shortpath = create_sprite("objects/cmr/splendall.png");
 * const fullpath = create_sprite("https://source-academy-assets.s3-ap-southeast-1.amazonaws.com/objects/cmr/splendall.png");
 * ```
 * @category GameObject
 */
export const create_sprite: (image_url: string) => SpriteGameObject = (image_url: string) => {
  if (image_url === '') {
    throw new Error('image_url cannot be empty');
  }
  if (typeof image_url !== 'string') {
    throw new Error('image_url must be a string');
  }
  const sprite: Sprite = {
    imageUrl: image_url,
  } as Sprite;
  return new SpriteGameObject(DEFAULT_TRANSFORM_PROPS, DEFAULT_RENDER_PROPS, DEFAULT_INTERACTABLE_PROPS, sprite);
};

// =============================================================================
// Manipulation of GameObjects
// =============================================================================

/**
 * Updates the position transform of the GameObject.
 *
 * @param gameObject GameObject reference
 * @param coordinates [x, y] coordinates of new position
 * @returns the GameObject reference passed in
 * @example
 * ```
 * update_position(create_text("Hello world!"), [1, 2]);
 * ```
 * @category GameObject
 */
export const update_position: (gameObject: GameObject, [x, y]: PositionXY) => GameObject
= (gameObject: GameObject, [x, y]: PositionXY) => {
  if (gameObject instanceof GameObject) {
    gameObject.setTransform({
      ...gameObject.getTransform(),
      position: [x, y],
    });
    return gameObject;
  }
  throw new TypeError('Cannot update position of a non-GameObject');
};

/**
 * Updates the scale transform of the GameObject.
 *
 * @param gameObject GameObject reference
 * @param scale [x, y] scale of the size of the GameObject
 * @returns the GameObject reference passed in
 * @example
 * ```
 * update_scale(create_text("Hello world!"), [2, 0.5]);
 * ```
 * @category GameObject
 */
export const update_scale: (gameObject: GameObject, [x, y]: ScaleXY) => GameObject
= (gameObject: GameObject, [x, y]: ScaleXY) => {
  if (gameObject instanceof GameObject) {
    gameObject.setTransform({
      ...gameObject.getTransform(),
      scale: [x, y],
    });
    return gameObject;
  }
  throw new TypeError('Cannot update scale of a non-GameObject');
};

/**
 * Updates the rotation transform of the GameObject.
 *
 * @param gameObject GameObject reference
 * @param radians The value in radians to rotate the GameObject clockwise by
 * @returns the GameObject reference passed in
 * @example
 * ```
 * update_rotation(create_text("Hello world!"), math_PI);
 * ```
 * @category GameObject
 */
export const update_rotation: (gameObject: GameObject, radians: number) => GameObject
= (gameObject: GameObject, radians: number) => {
  if (gameObject instanceof GameObject) {
    gameObject.setTransform({
      ...gameObject.getTransform(),
      rotation: radians,
    });
    return gameObject;
  }
  throw new TypeError('Cannot update rotation of a non-GameObject');
};

/**
 * Updates the color of the GameObject.
 * Note that the value is modulo 256, so passing values greater than 255 is allowed.
 *
 * @param gameObject GameObject reference
 * @param color The color as an RGBA array, with RGBA values ranging from 0 to 255.
 * @returns the GameObject reference passed in
 * @example
 * ```
 * update_color(create_rectangle(100, 100), [255, 0, 0, 255]);
 * ```
 * @category GameObject
 */
export const update_color: (gameObject: GameObject, color: ColorRGBA) => GameObject
= (gameObject: GameObject, color: ColorRGBA) => {
  if (color.length !== 4) {
    throw new Error('color must be a 4-element array');
  }
  if (gameObject instanceof RenderableGameObject) {
    gameObject.setRenderState({
      ...gameObject.getRenderState(),
      color,
    });
    return gameObject;
  }
  throw new TypeError('Cannot update color of a non-GameObject');
};

/**
 * Updates the flip state of the GameObject.
 *
 * @param gameObject GameObject reference
 * @param flip The [x, y] flip state as a boolean array
 * @returns the GameObject reference passed in
 * @example
 * ```
 * update_flip(create_triangle(100, 100), [false, true]);
 * ```
 * @category GameObject
 */
export const update_flip: (gameObject: GameObject, flip: FlipXY) => GameObject
= (gameObject: GameObject, flip: FlipXY) => {
  if (flip.length !== 2) {
    throw new Error('flip must be a 2-element array');
  }
  if (gameObject instanceof RenderableGameObject) {
    gameObject.setRenderState({
      ...gameObject.getRenderState(),
      flip,
    });
    return gameObject;
  }
  throw new TypeError('Cannot update flip of a non-GameObject');
};

/**
 * Updates the text of the TextGameObject.
 *
 * @param textGameObject TextGameObject reference
 * @param text The updated text of the TextGameObject
 * @returns the GameObject reference passed in
 * @throws Error if not a TextGameObject is passed in
 * @example
 * ```
 * update_text(create_text("Hello world!"), "Goodbye world!");
 * ```
 * @category GameObject
 */
export const update_text: (textGameObject: TextGameObject, text: string) => GameObject
= (textGameObject: TextGameObject, text: string) => {
  if (textGameObject instanceof TextGameObject) {
    textGameObject.setText({
      text,
    } as DisplayText);
    return textGameObject;
  }
  throw new TypeError('Cannot update text onto a non-TextGameObject');
};

/**
 * Renders this GameObject in front of all other GameObjects.
 *
 * @param gameObject GameObject reference
 * @example
 * ```
 * update_to_top(create_text("Hello world!"));
 * ```
 * @category GameObject
 */
export const update_to_top: (gameObject: GameObject) => GameObject
= (gameObject: GameObject) => {
  if (gameObject instanceof RenderableGameObject) {
    gameObject.setBringToTopFlag();
    return gameObject;
  }
  throw new TypeError('Cannot update to top a non-GameObject');
};

// =============================================================================
// Querying of GameObjects
// =============================================================================

/**
 * Queries the id of the GameObject.
 * The id of a GameObject is in the order of creation, starting from 0.
 *
 * @param gameObject GameObject reference
 * @returns the id of the GameObject reference
 * @example
 * ```
 * const id0 = create_text("This has id 0");
 * const id1 = create_text("This has id 1");
 * const id2 = create_text("This has id 2");
 * queryGameObjectId(id2);
 * ```
 * @category GameObject
 */
export const query_id: (gameObject: GameObject) => number = (gameObject: GameObject) => {
  if (gameObject instanceof GameObject) {
    return gameObject.id;
  }
  throw new TypeError('Cannot query id of non-GameObject');
};

/**
 * Queries the [x, y] position transform of the GameObject.
 *
 * @param gameObject GameObject reference
 * @returns [x, y] position as an array
 * @example
 * ```
 * const gameobject = update_position(create_circle(100), [100, 100]);
 * query_position(gameobject);
 * ```
 * @category GameObject
 */
export const query_position: (gameObject: GameObject) => PositionXY
= (gameObject: GameObject) => {
  if (gameObject instanceof GameObject) {
    return [...gameObject.getTransform().position];
  }
  throw new TypeError('Cannot query position of non-GameObject');
};

/**
 * Queries the z-rotation transform of the GameObject.
 *
 * @param gameObject GameObject reference
 * @returns z-rotation as a number in radians
 * @example
 * ```
 * const gameobject = update_rotation(create_rectangle(100, 200), math_PI / 4);
 * query_rotation(gameobject);
 * ```
 * @category GameObject
 */
export const query_rotation: (gameObject: GameObject) => number
= (gameObject: GameObject) => {
  if (gameObject instanceof GameObject) {
    return gameObject.getTransform().rotation;
  }
  throw new TypeError('Cannot query rotation of non-GameObject');
};

/**
 * Queries the [x, y] scale transform of the GameObject.
 *
 * @param gameObject GameObject reference
 * @returns [x, y] scale as an array
 * @example
 * ```
 * const gameobject = update_scale(create_circle(100), [2, 0.5]);
 * query_scale(gameobject);
 * ```
 * @category GameObject
 */
export const query_scale: (gameObject: GameObject) => ScaleXY
= (gameObject: GameObject) => {
  if (gameObject instanceof GameObject) {
    return [...gameObject.getTransform().scale];
  }
  throw new TypeError('Cannot query scale of non-GameObject');
};

/**
 * Queries the [r, g, b, a] color property of the GameObject.
 *
 * @param gameObject GameObject reference
 * @returns [r, g, b, a] color as an array
 * @example
 * ```
 * const gameobject = update_color(create_circle(100), [255, 127, 127, 255]);
 * query_color(gameobject);
 * ```
 * @category GameObject
 */
export const query_color: (gameObject: RenderableGameObject) => ColorRGBA
= (gameObject: RenderableGameObject) => {
  if (gameObject instanceof RenderableGameObject) {
    return [...gameObject.getColor()];
  }
  throw new TypeError('Cannot query color of non-GameObject');
};

/**
 * Queries the [x, y] flip property of the GameObject.
 *
 * @param gameObject GameObject reference
 * @returns [x, y] flip state as an array
 * @example
 * ```
 * const gameobject = update_flip(create_triangle(100), [false, true]);
 * query_flip(gameobject);
 * ```
 * @category GameObject
 */
export const query_flip: (gameObject: RenderableGameObject) => FlipXY
= (gameObject: RenderableGameObject) => {
  if (gameObject instanceof RenderableGameObject) {
    return [...gameObject.getFlipState()];
  }
  throw new TypeError('Cannot query flip of non-GameObject');
};

/**
 * Queries the text of a Text GameObject.
 *
 * @param textGameObject TextGameObject reference
 * @returns text string associated with the Text GameObject
 * @throws Error if not a TextGameObject is passed in
 * @example
 * ```
 * const text = create_text("Hello World!");
 * query_text(text);
 * ```
 * @category GameObject
 */
export const query_text: (textGameObject: TextGameObject) => string
= (textGameObject: TextGameObject) => {
  if (textGameObject instanceof TextGameObject) {
    return textGameObject.getText().text;
  }
  throw new TypeError('Cannot query text of non-TextGameObject');
};

/**
 * Queries the (mouse) pointer position.
 *
 * @returns [x, y] coordinates of the pointer as an array
 * @example
 * ```
 * const position = query_pointer_position();
 * position[0]; // x
 * position[1]; // y
 * ```
 */
export const query_pointer_position: () => PositionXY
= () => gameState.pointerProps.pointerPosition;

// =============================================================================
// Game configuration
// =============================================================================

/**
 * Private function to set the allowed range for a value.
 *
 * @param num the numeric value
 * @param min the minimum value allowed for that number
 * @param max the maximum value allowed for that number
 * @returns a number within the interval
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
 * Sets the frames per second of the canvas, which should be between the MIN_FPS and MAX_FPS.
 * It ranges between 1 and 120, with the default target as 30.
 * This function should not be called in the update function.
 *
 * @param fps The frames per second of canvas to set.
 * @example
 * ```
 * // set fps to 60
 * set_fps(60);
 * ```
 */
export const set_fps: (fps: number) => void = (fps: number) => {
  config.fps = withinRange(fps, MIN_FPS, MAX_FPS);
};

/**
 * Sets the dimensions of the canvas, which should be between the
 * min and max widths and height.
 *
 * @param dimensions An array containing [width, height] of the canvas.
 * @example
 * ```
 * // set the width as 500 and height as 400
 * set_dimensions([500, 400]);
 * ```
 */
export const set_dimensions: (dimensions: DimensionsXY) => void = (dimensions: DimensionsXY) => {
  if (dimensions.length !== 2) {
    throw new Error('dimensions must be a 2-element array');
  }
  config.width = withinRange(dimensions[0], MIN_WIDTH, MAX_WIDTH);
  config.height = withinRange(dimensions[1], MIN_HEIGHT, MAX_HEIGHT);
};

/**
 * Sets the scale (zoom) of the pixels in the canvas.
 * If scale is doubled, then the number of units across would be halved.
 * This has a side effect of making the game pixelated if scale > 1.
 * The default scale is 1.
 *
 * @param scale The scale of the canvas to set.
 * @example
 * ```
 * // sets the scale of the canvas to 2.
 * set_scale(2);
 * ```
 */
export const set_scale: (scale: number) => void = (scale: number) => {
  config.scale = withinRange(scale, MIN_SCALE, MAX_SCALE);
};

/**
 * Enables debug mode.
 * Hit box interaction between pointer and GameObjects are shown with a green outline in debug mode.
 * Hit box interaction between GameObjects is based off a rectangular area instead, which is not reflected.
 * debug_log(...) information is shown on the top-left corner of the canvas.
 *
 * @example
 * ```
 * enable_debug();
 * update_loop(game_state => {
 *   debug_log(get_game_time());
 * });
 * ```
 */
export const enable_debug: () => void = () => {
  config.isDebugEnabled = true;
};


/**
 * Logs any information passed into it within the `update_loop`.
 * Displays the information in the top-left corner of the canvas only if debug mode is enabled.
 * Calling `display` within the `update_loop` function will not work as intended, so use `debug_log` instead.
 *
 * @param info The information to log.
 * @example
 * ```
 * enable_debug();
 * update_loop(game_state => {
 *   debug_log(get_game_time());
 * });
 * ```
 */
export const debug_log: (info: string) => void = (info: string) => {
  if (config.isDebugEnabled) {
    gameState.debugLogArray.push(info);
  }
};

// =============================================================================
// Game loop
// =============================================================================

/**
 * Detects if a key input is pressed down.
 * This function must be called in your update function to detect inputs.
 * To get specific keys, go to https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key#result.
 *
 * @param key_name The key name of the key.
 * @returns True, in the frame the key is pressed down.
 * @example
 * ```
 * if (input_key_down("a")) {
 *   // "a" key is pressed down
 * }
 * ```
 * @category Logic
 */
export const input_key_down: (key_name: string) => boolean = (key_name: string) => gameState.inputKeysDown.has(key_name);

/**
 * Detects if the left mouse button is pressed down.
 * This function should be called in your update function.
 *
 * @returns True, if the left mouse button is pressed down.
 * @example
 * ```
 * if(input_left_mouse_down()) {
 *   // Left mouse button down
 * }
 * ```
 * @category Logic
 */
export const input_left_mouse_down: () => boolean = () => gameState.pointerProps.isPointerPrimaryDown;

/**
 * Detects if the right mouse button is pressed down.
 * This function should be called in your update function.
 *
 * @returns True, if the right mouse button is pressed down.
 * @example
 * ```
 * if (input_right_mouse_down()) {
 *   // Right mouse button down
 * }
 * ```
 * @category Logic
 */
export const input_right_mouse_down: () => boolean = () => gameState.pointerProps.isPointerSecondaryDown;

/**
 * Detects if the (mouse) pointer is over the gameobject.
 * This function should be called in your update function.
 *
 * @param gameObject The gameobject reference.
 * @returns True, if the pointer is over the gameobject.
 * @example
 * ```
 * // Creating a button using a gameobject
 * const button = createTextGameObject("click me");
 * // Test if button is clicked
 * if (pointer_over_gameobject(button) && input_left_mouse_down()) {
 *   // Button is clicked
 * }
 * ```
 * @category Logic
 */
export const pointer_over_gameobject = (gameObject: GameObject) => {
  if (gameObject instanceof GameObject) {
    return gameState.pointerProps.pointerOverGameObjectsId.has(gameObject.id);
  }
  throw new TypeError('Cannot check pointer over non-GameObject');
};
/**
 * Checks if two gameobjects overlap with each other, using a rectangular bounding box.
 * This bounding box is rectangular, for all GameObjects.
 * This function should be called in your update function.
 *
 * @param gameObject1 The first gameobject reference.
 * @param gameObject2 The second gameobject reference.
 * @returns True, if both gameobjects overlap with each other.
 * @example
 * ```
 * const rectangle1 = create_rectangle(100, 100);
 * const rectangle2 = create_rectangle(100, 100);
 * if (gameobjects_overlap(rectangle1, rectangle2)) {
 *   // Both rectangles overlap
 * }
 * ```
 * @category Logic
 */
export const gameobjects_overlap: (gameObject1: InteractableGameObject, gameObject2: InteractableGameObject) => boolean
= (gameObject1: InteractableGameObject, gameObject2: InteractableGameObject) => {
  if (gameObject1 instanceof InteractableGameObject && gameObject2 instanceof InteractableGameObject) {
    return gameObject1.isOverlapping(gameObject2);
  }
  throw new TypeError('Cannot check overlap of non-GameObject');
};
/**
 * Gets the current in-game time, which is based off the start time.
 * This function should be called in your update function.
 *
 * @returns a number specifying the time in milliseconds
 * @example
 * ```
 * if (get_game_time() > 100) {
 *   // Do something after 100 milliseconds
 * }
 * ```
 */
export const get_game_time: () => number = () => gameState.gameTime;

/**
 * Gets the current loop count, which is the number of frames that have run.
 * Depends on the framerate set for how fast this changes.
 * This function should be called in your update function.
 *
 * @returns a number specifying number of loops that have been run.
 * @example
 * ```
 * if (get_loop_count() === 100) {
 *   // Do something on the 100th frame
 * }
 * ```
 */
export const get_loop_count: () => number = () => gameState.loopCount;

/**
 * This sets the update loop in the canvas.
 * The update loop is run once per frame, so it depends on the fps set for the number of times this loop is run.
 * There should only be one update_loop called.
 * All game logic should be handled within your update_function.
 * You cannot create GameObjects inside the update_loop.
 * game_state is an array that can be modified to store anything.
 *
 * @param update_function A user-defined update_function, that takes in an array as a parameter.
 * @example
 * ```
 * // Create gameobjects outside update_loop
 * update_loop((game_state) => {
 *   // Update gameobjects inside update_loop
 *
 *   // Using game_state as a counter
 *   if (game_state[0] === undefined) {
 *     game_state[0] = 0;
 *   }
 *   game_state[0] = game_state[0] + 1;
 * })
 * ```
 */
export const update_loop: (update_function: UpdateFunction) => void = (update_function: UpdateFunction) => {
  // Test for error in user update function
  // This cannot not check for errors inside a block that is not run.
  update_function([]);
  config.userUpdateFunction = update_function;
};

/**
 * Builds the game.
 * Processes the initialization and updating of the game.
 * All created GameObjects and their properties are passed into the game.
 *
 * @example
 * ```
 * // This must be the last function called in the Source program.
 * build_game();
 * ```
 */
export const build_game: () => BuildGame = () => {
  // Reset frame and time counters.
  gameState.loopCount = 0;
  gameState.gameTime = 0;

  const inputConfig = {
    keyboard: true,
    mouse: true,
    windowEvents: false,
  };

  const fpsConfig = {
    min: MIN_FPS,
    target: config.fps,
    forceSetTimeOut: true,
  };

  const gameConfig = {
    width: config.width / config.scale,
    height: config.height / config.scale,
    zoom: config.scale,
    // Setting to Phaser.WEBGL can lead to WebGL: INVALID_OPERATION errors, so Phaser.CANVAS is used instead.
    // Also: Phaser.WEBGL can crash when there are too many contexts
    // WEBGL is generally more performant, and allows for tinting of gameobjects.
    type: Phaser.WEBGL,
    parent: 'phaser-game',
    scene: PhaserScene,
    input: inputConfig,
    fps: fpsConfig,
    banner: false,
  };

  return {
    toReplString: () => '[Arcade 2D]',
    gameConfig,
  };
};

// =============================================================================
// Audio functions
// =============================================================================

/**
 * Create an audio clip that can be referenced.
 * Source Academy assets can be found at https://source-academy-assets.s3-ap-southeast-1.amazonaws.com/ with Ctrl+f ".mp3".
 * Phaser audio assets can be found at https://labs.phaser.io/assets/audio.
 * Phaser sound effects assets can be found at https://labs.phaser.io/assets/audio/SoundEffects/.
 * If Phaser assets are unavailable, go to https://github.com/photonstorm/phaser3-examples/tree/master/public/assets
 * to get the asset path and append it to `https://labs.phaser.io/assets/`.
 * This function should not be called in your update function.
 *
 * @param audio_url The URL of the audio clip.
 * @param volume_level A number between 0 to 1, representing the volume level of the audio clip.
 * @returns The AudioClip reference
 * @example
 * ```
 * const audioClip = create_audio("bgm/GalacticHarmony.mp3", 0.5);
 * ```
 * @category Audio
 */
export const create_audio: (audio_url: string, volume_level: number) => AudioClip
= (audio_url: string, volume_level: number) => {
  if (typeof audio_url !== 'string') {
    throw new Error('audio_url must be a string');
  }
  if (typeof volume_level !== 'number') {
    throw new Error('volume_level must be a number');
  }
  return AudioClip.of(audio_url, withinRange(volume_level, MIN_VOLUME, MAX_VOLUME));
};

/**
 * Loops the audio clip provided, which will play the audio clip indefinitely.
 * Setting whether an audio clip should loop be done outside the update function.
 *
 * @param audio_clip The AudioClip reference
 * @returns The AudioClip reference
 * @example
 * ```
 * const audioClip = loop_audio(create_audio("bgm/GalacticHarmony.mp3", 0.5));
 * ```
 * @category Audio
 */
export const loop_audio: (audio_clip: AudioClip) => AudioClip = (audio_clip: AudioClip) => {
  if (audio_clip instanceof AudioClip) {
    audio_clip.setShouldAudioClipLoop(true);
    return audio_clip;
  }
  throw new TypeError('Cannot loop a non-AudioClip');
};

/**
 * Plays the audio clip, and stops when the audio clip is over.
 *
 * @param audio_clip The AudioClip reference
 * @returns The AudioClip reference
 * @example
 * ```
 * const audioClip = play_audio(create_audio("bgm/GalacticHarmony.mp3", 0.5));
 * ```
 * @category Audio
 */
export const play_audio: (audio_clip: AudioClip) => AudioClip = (audio_clip: AudioClip) => {
  if (audio_clip instanceof AudioClip) {
    audio_clip.setShouldAudioClipPlay(true);
    return audio_clip;
  }
  throw new TypeError('Cannot play a non-AudioClip');
};

/**
 * Stops the audio clip immediately.
 *
 * @param audio_clip The AudioClip reference
 * @returns The AudioClip reference
 * @example
 * ```
 * const audioClip = play_audio(create_audio("bgm/GalacticHarmony.mp3", 0.5));
 * ```
 * @category Audio
 */
export const stop_audio: (audio_clip: AudioClip) => AudioClip = (audio_clip: AudioClip) => {
  if (audio_clip instanceof AudioClip) {
    audio_clip.setShouldAudioClipPlay(false);
    return audio_clip;
  }
  throw new TypeError('Cannot stop a non-AudioClip');
};
