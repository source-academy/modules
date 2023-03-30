/**
 * The module `arcade_two_d` is a wrapper for the Phaser.io game engine.
 * It provides functions for manipulating GameObjects in a canvas.
 *
 * A *GameObject* is defined by its transform and rendered object.
 *
 * @module arcade_two_d
 * @author Titus Chew Xuan Jun
 * @author Xenos Fiorenzo Anong
 */

// import { context } from 'js-slang/moduleHelpers';
import Phaser from 'phaser';
// import HelloWorld from './example_games/helloWorld';
import {
  PhaserScene,
  inputKeysDown,
  gameTime,
  pointerPosition,
  pointerPrimaryDown,
  pointerOverGameObjectsId,
  loopCount,
  pointerSecondaryDown,
} from './phaserScene';

import {
  type GameObject, RenderableGameObject,
  type ShapeGameObject,
  SpriteGameObject,
  TextGameObject,
  RectangleGameObject,
  CircleGameObject,
  TriangleGameObject,
  type InteractableGameObject,
} from './gameobject';

import {
  type DisplayText,
  type InteractableProps,
  type RenderProps,
  type BuildGame,
  type TransformProps,
  type Sprite,
  type UpdateFunction,
  type Color,
  type RectangleProps,
  type CircleProps,
  type TriangleProps,
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
} from './constants';
import { AudioClip } from './audio';

// Global Variables
let WIDTH: number = DEFAULT_WIDTH;
let HEIGHT: number = DEFAULT_HEIGHT;
let SCALE: number = DEFAULT_SCALE;
let FPS: number = DEFAULT_FPS;
export let DEBUG: boolean = false;

// Audio
export const audioClips = new Set();

// User update function
export let userUpdateFunction: UpdateFunction;

// =============================================================================
// Default values
// =============================================================================

const defaultTransform: TransformProps = {
  position: [0, 0],
  scale: [1, 1],
  rotation: 0,
};

const defaultRenderProps: RenderProps = {
  color: {
    red: 255,
    green: 255,
    blue: 255,
    alpha: 255,
  },
  flip: [false, false],
  visible: true,
};

const defaultInteractableProps: InteractableProps = {
  hitboxActive: true,
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
 * @category Create GameObject
 */
export const create_rectangle: (width: number, height: number) => ShapeGameObject = (width: number, height: number) => {
  const rectangle = {
    width,
    height,
  } as RectangleProps;
  return new RectangleGameObject(defaultTransform, defaultRenderProps, defaultInteractableProps, rectangle);
};

/**
 * Creates a CircleGameObject that takes in circle shape properties.
 *
 * @param width The width of the rectangle
 * @param height The height of the rectangle
 * ```
 * const circle = create_circle(100);
 * ```
 * @category Create GameObject
 */
export const create_circle: (radius: number) => ShapeGameObject = (radius: number) => {
  const circle = {
    radius,
  } as CircleProps;
  return new CircleGameObject(defaultTransform, defaultRenderProps, defaultInteractableProps, circle);
};

/**
 * Creates a TriangleGameObject that takes in an downright isosceles triangle shape properties.
 *
 * @param width The width of the isosceles triangle
 * @param height The height of the isosceles triangle
 * ```
 * const triangle = create_triangle(100, 100);
 * ```
 * @category Create GameObject
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
  return new TriangleGameObject(defaultTransform, defaultRenderProps, defaultInteractableProps, triangle);
};

/**
 * Creates a GameObject that contains a text reference.
 *
 * @param text Text string displayed
 * @example
 * ```
 * const helloworld = create_text("Hello\nworld!");
 * ```
 * @category Create GameObject
 */
export const create_text: (text: string) => TextGameObject = (text: string) => {
  const displayText = {
    text,
  } as DisplayText;
  return new TextGameObject(defaultTransform, defaultRenderProps, defaultInteractableProps, displayText);
};

/**
 * Creates a GameObject that contains a Sprite image reference.
 * Source Academy assets can be used by specifying path without the prepend.
 * Source Academy assets can be found at `https://source-academy-assets.s3-ap-southeast-1.amazonaws.com/{image_url}`.
 * Phaser assets can be found at `https://labs.phaser.io/assets/`.
 * Assets from other websites can also be used if they support Cross-Origin Resource Sharing (CORS), but the full path must be specified.
 *
 * @param image_url The image URL of the sprite
 * @example
 * ```
 * const shortpath = create_sprite("objects/cmr/splendall.png");
 * const fullpath = create_sprite("https://source-academy-assets.s3-ap-southeast-1.amazonaws.com/objects/cmr/splendall.png");
 * ```
 * @category Create GameObject
 */
export const create_sprite: (image_url: string) => SpriteGameObject = (image_url: string) => {
  if (image_url === '') {
    throw new Error('image_url cannot be empty');
  }

  const sprite: Sprite = {
    image_url,
  } as Sprite;

  const gameObject = new SpriteGameObject(defaultTransform, defaultRenderProps, defaultInteractableProps, sprite);

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
 * @returns the GameObject reference passed in
 * @example
 * ```
 * update_position(create_text("Hello world!"), [1, 2]);
 * ```
 * @category Update GameObject
 */
export const update_position: (gameObject: GameObject, [x, y]: [number, number]) => GameObject
= (gameObject: GameObject, [x, y]: [number, number]) => {
  gameObject.setTransform({
    ...gameObject.getTransform(),
    position: [x, y],
  });
  return gameObject;
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
 * @category Update GameObject
 */
export const update_scale: (gameObject: GameObject, [x, y]: [number, number]) => GameObject
= (gameObject: GameObject, [x, y]: [number, number]) => {
  gameObject.setTransform({
    ...gameObject.getTransform(),
    scale: [x, y],
  });
  return gameObject;
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
 * @category Update GameObject
 */
export const update_rotation: (gameObject: GameObject, radians: number) => GameObject
= (gameObject: GameObject, radians: number) => {
  gameObject.setTransform({
    ...gameObject.getTransform(),
    rotation: radians,
  });
  return gameObject;
};

/**
 * Updates the color of the GameObject.
 *
 * @param gameObject GameObject reference
 * @param color The color as an RGBA array, with RGBA values ranging from 0 to 255.
 * @returns the GameObject reference passed in
 * @example
 * ```
 * update_color(create_rectangle(100, 100), [255, 0, 0, 255]);
 * ```
 * @category Update GameObject
 */
export const update_color: (gameObject: GameObject, color: [number, number, number, number]) => GameObject
= (gameObject: GameObject, color: [number, number, number, number]) => {
  if (gameObject instanceof RenderableGameObject) {
    gameObject.setRenderState({
      ...gameObject.getRenderState(),
      color: {
        red: color[0],
        green: color[1],
        blue: color[2],
        alpha: color[3],
      } as Color,
    });
  }
  return gameObject;
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
 * @category Update GameObject
 */
export const update_flip: (gameObject: GameObject, flip: [boolean, boolean]) => GameObject
= (gameObject: GameObject, flip: [boolean, boolean]) => {
  if (gameObject instanceof RenderableGameObject) {
    gameObject.setRenderState({
      ...gameObject.getRenderState(),
      flip,
    });
  }
  return gameObject;
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
 * @category Update GameObject
 */
export const update_text: (textGameObject: TextGameObject, text: string) => GameObject
= (textGameObject: TextGameObject, text: string) => {
  if (textGameObject instanceof TextGameObject) {
    textGameObject.setText({
      text,
    } as DisplayText);
    return textGameObject;
  }
  throw new Error('Cannot update text onto a non TextGameObject');
};

/**
 * Renders this GameObject in front of all other GameObjects.
 *
 * @param gameObject GameObject reference
 * @example
 * ```
 * update_to_top(create_text("Hello world!"));
 * ```
 * @category Update GameObject
 */
export const update_to_top: (gameObject: GameObject) => GameObject
= (gameObject: GameObject) => {
  if (gameObject instanceof RenderableGameObject) {
    gameObject.bringToTop();
  }
  return gameObject;
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
 * @category Query GameObject
 */
export const query_id: (gameObject: GameObject) => number = (gameObject: GameObject) => gameObject.id;

/**
 * Queries the [x, y] position transform of the GameObject.
 *
 * @param gameObject GameObject reference
 * @returns [x, y] position as an array
 * @example
 * ```
 * query_position(create_circle(100));
 * ```
 * @category Query GameObject
 */
export const query_position: (gameObject: GameObject) => [number, number]
= (gameObject: GameObject) => gameObject.getTransform().position;

/**
 * Queries the z-rotation transform of the GameObject.
 *
 * @param gameObject GameObject reference
 * @returns z-rotation as a number in radians
 * @example
 * ```
 * query_rotation(update_rotation(create_rectangle(100, 200), math_PI / 4)) === math_PI / 4;
 * ```
 * @category Query GameObject
 */
export const query_rotation: (gameObject: GameObject) => number
= (gameObject: GameObject) => gameObject.getTransform().rotation;

/**
 * Queries the [x, y] scale transform of the GameObject.
 *
 * @param gameObject GameObject reference
 * @returns [x, y] scale as an array
 * @example
 * ```
 * query_scale(update_scale(create_circle(100), [2, 0.5]));
 * ```
 * @category Query GameObject
 */
export const query_scale: (gameObject: GameObject) => [number, number]
= (gameObject: GameObject) => gameObject.getTransform().scale;

/**
 * Queries the [r, g, b, a] color property of the GameObject.
 *
 * @param gameObject GameObject reference
 * @returns [r, g, b, a] color as an array
 * @example
 * ```
 * query_color(update_color(create_circle(100), [255, 127, 127, 255]);
 * ```
 * @category Query GameObject
 */
export const query_color: (gameObject: RenderableGameObject) => [number, number, number, number]
= (gameObject: RenderableGameObject) => gameObject.getColor();

/**
 * Queries the [x, y] flip property of the GameObject.
 *
 * @param gameObject GameObject reference
 * @returns [x, y] flip state as an array
 * @example
 * ```
 * query_flip(update_flip(create_circle(100), [true, false]));
 * ```
 * @category Query GameObject
 */
export const query_flip: (gameObject: RenderableGameObject) => [boolean, boolean]
= (gameObject: RenderableGameObject) => gameObject.getFlipState();

/**
 * Queries the text of a Text GameObject.
 *
 * @param textGameObject TextGameObject reference
 * @returns text string associated with the Text GameObject
 * @throws Error if not a TextGameObject is passed in
 * @example
 * ```
 * query_text(create_text("Hello World!")) === "Hello World!";
 * ```
 * @category Query GameObject
 */
export const query_text: (textGameObject: TextGameObject) => string
= (textGameObject: TextGameObject) => {
  if (textGameObject instanceof TextGameObject) {
    return textGameObject.getText().text;
  }
  throw new Error('Cannot query text from non TextGameObject');
};

/**
 * Queries the (mouse) pointer position.
 * @returns [x, y] coordinates of the pointer as an array
 * @example
 * ```
 * const position = query_pointer_position();
 * position[0];
 * position[1];
 * ```
 * @category Input
 */
export const query_pointer_position: () => [number, number]
= () => pointerPosition;

// =============================================================================
// Game configuration
// =============================================================================

/**
 * Private function.
 * @param num the number
 * @param min the minimum value allowed for that number
 * @param max the maximum value allowed for that number
 * @returns a number within the interval.
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
 * It ranges between 1 and 120, with the default target as 30.
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
 * This has a side effect of making the game pixelated if scale > 1.
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
 * Enables debug mode.
 * The hit box of GameObjects are shown in this mode.
 * Note that the hit box shown is the hit box of the interaction with the mouse.
 * Hit box interaction between objects is based off a rectangular area instead.
 *
 * @ category Configuration
 */
export const enable_debug: () => void = () => {
  DEBUG = true;
};

// =============================================================================
// Game loop
// =============================================================================

/**
 * Detects if a key input is pressed down.
 * This function must be called in your update function to detect inputs.
 * To get specific keys, go to https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key#result
 *
 * @param key_name The key name of the key.
 * @returns True, in the frame the key is pressed down.
 * @example
 * ```
 * // this returns true if "a" is pressed down.
 * input_down("a");
 * ```
 * @catagory Input
 */
export const input_key_down: (key_name: string) => boolean = (key_name: string) => inputKeysDown.has(key_name);

/**
 * Detects if the left mouse button is pressed down.
 * This function must be called in your update function to detect inputs.
 * @returns True, if the left mouse button is pressed down.
 * @example
 * ```
 * input_left_mouse_down();
 * ```
 * @category Input
 */
export const input_left_mouse_down: () => boolean = () => pointerPrimaryDown;

/**
 * Detects if the right mouse button is pressed down.
 * This function must be called in your update function to detect inputs.
 * @returns True, if the right mouse button is pressed down.
 * @example
 * ```
 * input_right_mouse_down();
 * ```
 * @category Input
 */
export const input_right_mouse_down: () => boolean = () => pointerSecondaryDown;

/**
 * Detects if the pointer is over the gameobject.
 * @param gameObject The gameobject reference.
 * @returns True, if the pointer is over the gameobject.
 * @example
 * ```
 * if (pointer_over_gameobject(createTextGameObject("[]"))) {
 *  // do something
 * }
 * ```
 * @category Input
 */
export const pointer_over_gameobject = (gameObject: GameObject) => pointerOverGameObjectsId.has(gameObject.id);


/**
 * Checks if two gameobjects overlap with each other, using a rectangular bounding box.
 * @param gameObject1 The first gameobject reference.
 * @param gameObject2 The second gameobject reference.
 * @returns True, if both gameobjects overlap with each other.
 * @example
 * ```
 * 
 * if (gameobjects_overlap())
 * ```
 * @category Query
 */
export const gameobjects_overlap: (gameObject1: InteractableGameObject, gameObject2: InteractableGameObject) => boolean
= (gameObject1: InteractableGameObject, gameObject2: InteractableGameObject) => gameObject1.isOverlapping(gameObject2);

/**
 * Gets the current in-game time.
 *
 * @returns a number specifying the time in milliseconds
 * @example
 * ```
 * if (get_game_time() > 100) {
 *   // do something after 100 seconds
 * }
 * ```
 * @category Query
 */
export const get_game_time: () => number = () => gameTime;

/**
 * Gets the current loop count, which is the number of frames that have run.
 * Depends on the framerate set for how fast this grows.
 *
 * @returns a number specifying number of loops that have been run.
 * @example
 * ```
 * const loop_count = get_loop_count();
 * ```
 * @category Query
 */
export const get_loop_count: () => number = () => loopCount;

/**
 * This sets the update loop in the canvas.
 * The update loop is run once per frame, so it depends on the fps set for the number of times this loop is run.
 * Important notes:
 * Calling display() within this function will only output when rerun.
 * (This function could be redundant if update_function is supplied as a param to build_game.)
 *
 * @param update_function A user-defined update_function, that takes in an array as a parameter.
 * @example
 * ```
 * // create gameobjects outside the update_loop
 * update_loop((game_state) => {
 *   // update gameobjects inside the update_loop
 * })
 * ```
 * @category Misc
 */
export const update_loop: (update_function: UpdateFunction) => void = (update_function: UpdateFunction) => {
  // this causes TypeError, is there any other way to check for the arity of the function? #BUG
  // if (update_function.length !== 1) {
  //   throw new Error('User-defined update function has wrong number of arguments.');
  // }
  userUpdateFunction = update_function;
};

/**
 * Builds the game.
 * Processes the initialization and updating of the game.
 * All GameObjects and their properties are passed into the game.
 * (This should be the last function called in the Source program.)
 * This doesn't need to be the last function that is called now.
 * @example
 * ```
 * build_game();
 * ```
 * @category Misc
 */
export const build_game: () => BuildGame = () => {
  const inputConfig = {
    keyboard: true,
    mouse: true,
  };

  const fpsConfig = {
    min: MIN_FPS,
    target: FPS,
    forceSetTimeOut: true,
  };

  const physicsConfig = {
    'default': 'arcade',
    'arcade': {
      // debug: DEBUG,
    },
  };

  // const offscreenCanvas = new OffscreenCanvas(WIDTH / SCALE, HEIGHT / SCALE);

  const gameConfig = {
    width: WIDTH / SCALE,
    height: HEIGHT / SCALE,
    zoom: SCALE,
    // Setting to Phaser.WEBGL can lead to WebGL: INVALID_OPERATION errors, so Phaser.CANVAS is used instead.
    // Also: Phaser.WEBGL can crash when there are too many contexts
    // WEBGL is generally more performant, and allows for tinting of gameobjects.
    // The issue is that there are multiple webgl contexts, and exceeding a limit will cause the oldest context to be lost
    // which will cause more problems, as the object doesn't belong in the context anymore. (Solved by removing contexts when unmounted)
    type: Phaser.WEBGL,
    parent: 'phaser-game',
    // This is used to detect pointer interactions and overlapping GameObjects
    physics: physicsConfig,
    // canvas: offscreenCanvas,
    scene: PhaserScene,
    input: inputConfig,
    fps: fpsConfig,
  };

  return {
    toReplString: () => '[Arcade 2D]',
    gameConfig,
    phaserGameInstance: undefined,
    loadedGame: false,
    gameEnded: false,
  };
};

// =============================================================================
// Audio functions
// =============================================================================

/**
 * Create an audio clip that can be referenced.
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
= (audio_url: string, volume_level: number) => AudioClip.of(audio_url, withinRange(volume_level, MIN_VOLUME, MAX_VOLUME));

/**
 * Loops the audio clip provided, which will play the audio clip indefinitely.
 * Setting whether an audio clip should be done outside the update function.
 * @param audio_clip The AudioClip reference
 * @returns The AudioClip reference
 * @example
 * ```
 * const audioClip = loop_audio(create_audio("bgm/GalacticHarmony.mp3", 0.5));
 * ```
 * @category Audio
 */
export const loop_audio: (audio_clip: AudioClip) => AudioClip = (audio_clip: AudioClip) => {
  audio_clip.loopAudioClip(true);
  return audio_clip;
};

/**
 * Plays the audio clip, and stops when the audio clip is over.
 * @param audio_clip The AudioClip reference
 * @returns The AudioClip reference
 * @example
 * ```
 * const audioClip = play_audio(create_audio("bgm/GalacticHarmony.mp3", 0.5));
 * ```
 * @category Audio
 */
export const play_audio: (audio_clip: AudioClip) => AudioClip = (audio_clip: AudioClip) => {
  audio_clip.playAudioClip(true);
  return audio_clip;
};

/**
 * Stops the audio clip immediately.
 * @param audio_clip The AudioClip reference
 * @returns The AudioClip reference
 * @example
 * ```
 * const audioClip = play_audio(create_audio("bgm/GalacticHarmony.mp3", 0.5));
 * ```
 * @category Audio
 */
export const stop_audio: (audio_clip: AudioClip) => AudioClip = (audio_clip: AudioClip) => {
  audio_clip.playAudioClip(false);
  return audio_clip;
};
