/* eslint-disable consistent-return, @typescript-eslint/default-param-last, @typescript-eslint/no-shadow, @typescript-eslint/no-unused-vars */
import type {
  GameObject,
  List,
  ObjectConfig,
  RawContainer,
  RawGameElement,
  RawGameObject,
  RawInputObject,
} from './types';

import context from 'js-slang/context';

/** @hidden */
export default function gameFuncs(): { [name: string]: any } {
  const {
    scene,
    preloadImageMap,
    preloadSoundMap,
    preloadSpritesheetMap,
    remotePath,
    screenSize,
    createAward,
  } = context.moduleContexts.game.state || {};

  // Listener ObjectTypes
  enum ListenerTypes {
    InputPlugin = 'input_plugin',
    KeyboardKeyType = 'keyboard_key',
  }

  const ListnerTypes = Object.values(ListenerTypes);

  // Object ObjectTypes
  enum ObjectTypes {
    ImageType = 'image',
    TextType = 'text',
    RectType = 'rect',
    EllipseType = 'ellipse',
    ContainerType = 'container',
    AwardType = 'award',
  }

  const ObjTypes = Object.values(ObjectTypes);

  const nullFn = () => {};

  // =============================================================================
  // Module's Private Functions
  // =============================================================================

  /** @hidden */
  function get_obj(
    obj: GameObject,
  ): RawGameObject | RawInputObject | RawContainer {
    return obj.object!;
  }

  /** @hidden */
  function get_game_obj(obj: GameObject): RawGameObject | RawContainer {
    return obj.object as RawGameObject | RawContainer;
  }

  /** @hidden */
  function get_input_obj(obj: GameObject): RawInputObject {
    return obj.object as RawInputObject;
  }

  /** @hidden */
  function get_container(obj: GameObject): RawContainer {
    return obj.object as RawContainer;
  }

  /**
   * Checks whether the given game object is of the enquired type.
   * If the given obj is undefined, will also return false.
   *
   * @param obj the game object
   * @param type enquired type
   * @returns if game object is of enquired type
   * @hidden
   */
  function is_type(obj: GameObject, type: string): boolean {
    return obj !== undefined && obj.type === type && obj.object !== undefined;
  }

  /**
   * Checks whether the given game object is any of the enquired ObjectTypes
   *
   * @param obj the game object
   * @param ObjectTypes enquired ObjectTypes
   * @returns if game object is of any of the enquired ObjectTypes
   * @hidden
   */
  function is_any_type(obj: GameObject, types: string[]): boolean {
    for (let i = 0; i < types.length; ++i) {
      if (is_type(obj, types[i])) return true;
    }
    return false;
  }

  /**
   * Set a game object to the given type.
   * Mutates the object.
   *
   * @param object the game object
   * @param type type to set
   * @returns typed game object
   * @hidden
   */
  function set_type(
    object: RawGameObject | RawInputObject | RawContainer,
    type: string,
  ): GameObject {
    return {
      type,
      object,
    };
  }

  /**
   * Throw a console error, including the function caller name.
   *
   * @param {string} message error message
   * @hidden
   */
  function throw_error(message: string) {
    // eslint-disable-next-line no-caller, @typescript-eslint/no-throw-literal
    throw console.error(`${arguments.callee.caller.name}: ${message}`);
  }

  // List processing
  // Original Author: Martin Henz

  /**
   * array test works differently for Rhino and
   * the Firefox environment (especially Web Console)
   */
  function array_test(x: any): boolean {
    if (Array.isArray === undefined) {
      return x instanceof Array;
    }
    return Array.isArray(x);
  }

  /**
   * pair constructs a pair using a two-element array
   * LOW-LEVEL FUNCTION, NOT SOURCE
   */
  function pair(x: any, xs: any): [any, any] {
    return [x, xs];
  }

  /**
   * is_pair returns true iff arg is a two-element array
   * LOW-LEVEL FUNCTION, NOT SOURCE
   */
  function is_pair(x: any): boolean {
    return array_test(x) && x.length === 2;
  }

  /**
   * head returns the first component of the given pair,
   * throws an exception if the argument is not a pair
   * LOW-LEVEL FUNCTION, NOT SOURCE
   */
  function head(xs: List): any {
    if (is_pair(xs)) {
      return xs![0];
    }
    throw new Error(
      `head(xs) expects a pair as argument xs, but encountered ${xs}`,
    );
  }

  /**
   *  tail returns the second component of the given pair
   * throws an exception if the argument is not a pair
   * LOW-LEVEL FUNCTION, NOT SOURCE
   */
  function tail(xs: List) {
    if (is_pair(xs)) {
      return xs![1];
    }
    throw new Error(
      `tail(xs) expects a pair as argument xs, but encountered ${xs}`,
    );
  }

  /**
   * is_null returns true if arg is exactly null
   * LOW-LEVEL FUNCTION, NOT SOURCE
   */
  function is_null(xs: any) {
    return xs === null;
  }

  /**
   * map applies first arg f to the elements of the second argument,
   * assumed to be a list.
   * f is applied element-by-element:
   * map(f,[1,[2,[]]]) results in [f(1),[f(2),[]]]
   * map throws an exception if the second argument is not a list,
   * and if the second argument is a non-empty list and the first
   * argument is not a function.
   */
  function map(f: (x: any) => any, xs: List) {
    return is_null(xs) ? null : pair(f(head(xs)), map(f, tail(xs)));
  }

  // =============================================================================
  // Module's Exposed Functions
  // =============================================================================

  // HELPER

  function prepend_remote_url(asset_key: string): string {
    return remotePath(asset_key);
  }

  function create_config(lst: List): ObjectConfig {
    const config = {};
    map((xs: [any, any]) => {
      if (!is_pair(xs)) {
        throw_error('xs is not pair!');
      }
      config[head(xs)] = tail(xs);
    }, lst);
    return config;
  }

  function create_text_config(
    font_family: string = 'Courier',
    font_size: string = '16px',
    color: string = '#fff',
    stroke: string = '#fff',
    stroke_thickness: number = 0,
    align: string = 'left',
  ): ObjectConfig {
    return {
      fontFamily: font_family,
      fontSize: font_size,
      color,
      stroke,
      strokeThickness: stroke_thickness,
      align,
    };
  }

  function create_interactive_config(
    draggable: boolean = false,
    use_hand_cursor: boolean = false,
    pixel_perfect: boolean = false,
    alpha_tolerance: number = 1,
  ): ObjectConfig {
    return {
      draggable,
      useHandCursor: use_hand_cursor,
      pixelPerfect: pixel_perfect,
      alphaTolerance: alpha_tolerance,
    };
  }

  function create_sound_config(
    mute: boolean = false,
    volume: number = 1,
    rate: number = 1,
    detune: number = 0,
    seek: number = 0,
    loop: boolean = false,
    delay: number = 0,
  ): ObjectConfig {
    return {
      mute,
      volume,
      rate,
      detune,
      seek,
      loop,
      delay,
    };
  }

  function create_tween_config(
    target_prop: string = 'x',
    target_value: string | number = 0,
    delay: number = 0,
    duration: number = 1000,
    ease: Function | string = 'Power0',
    on_complete: Function = nullFn,
    yoyo: boolean = false,
    loop: number = 0,
    loop_delay: number = 0,
    on_loop: Function = nullFn,
  ): ObjectConfig {
    return {
      [target_prop]: target_value,
      delay,
      duration,
      ease,
      onComplete: on_complete,
      yoyo,
      loop,
      loopDelay: loop_delay,
      onLoop: on_loop,
    };
  }

  function create_anim_config(
    anims_key: string,
    anim_frames: ObjectConfig[],
    frame_rate: number = 24,
    duration: any = null,
    repeat: number = -1,
    yoyo: boolean = false,
    show_on_start: boolean = true,
    hide_on_complete: boolean = false,
  ): ObjectConfig {
    return {
      key: anims_key,
      frames: anim_frames,
      frameRate: frame_rate,
      duration,
      repeat,
      yoyo,
      showOnStart: show_on_start,
      hideOnComplete: hide_on_complete,
    };
  }

  function create_anim_frame_config(
    key: string,
    duration: number = 0,
    visible: boolean = true,
  ): ObjectConfig {
    return {
      key,
      duration,
      visible,
    };
  }

  function create_anim_spritesheet_frame_configs(
    key: string,
  ): ObjectConfig[] | undefined {
    if (preloadSpritesheetMap.get(key)) {
      const configArr = scene.anims.generateFrameNumbers(key, {});
      return configArr;
    }
    throw_error(`${key} is not associated with any spritesheet`);
  }

  function create_spritesheet_config(
    frame_width: number,
    frame_height: number,
    start_frame: number = 0,
    margin: number = 0,
    spacing: number = 0,
  ): ObjectConfig {
    return {
      frameWidth: frame_width,
      frameHeight: frame_height,
      startFrame: start_frame,
      margin,
      spacing,
    };
  }

  // SCREEN

  function get_screen_width(): number {
    return screenSize.x;
  }

  function get_screen_height(): number {
    return screenSize.y;
  }

  function get_screen_display_width(): number {
    return scene.scale.displaySize.width;
  }

  function get_screen_display_height(): number {
    return scene.scale.displaySize.height;
  }

  // LOAD

  function load_image(key: string, url: string) {
    preloadImageMap.set(key, url);
  }

  function load_sound(key: string, url: string) {
    preloadSoundMap.set(key, url);
  }

  function load_spritesheet(
    key: string,
    url: string,
    spritesheet_config: ObjectConfig,
  ) {
    preloadSpritesheetMap.set(key, [url, spritesheet_config]);
  }

  // ADD

  function add(obj: GameObject): GameObject | undefined {
    if (is_any_type(obj, ObjTypes)) {
      scene.add.existing(get_game_obj(obj));
      return obj;
    }
    throw_error(`${obj} is not of type ${ObjTypes}`);
  }

  // SOUND

  function play_sound(key: string, config: ObjectConfig = {}): void {
    if (preloadSoundMap.get(key)) {
      scene.sound.play(key, config);
    } else {
      throw_error(`${key} is not associated with any sound`);
    }
  }

  // ANIMS

  function create_anim(anim_config: ObjectConfig): boolean {
    const anims = scene.anims.create(anim_config);
    return typeof anims !== 'boolean';
  }

  function play_anim_on_image(
    image: GameObject,
    anims_key: string,
  ): GameObject | undefined {
    if (is_type(image, ObjectTypes.ImageType)) {
      (get_obj(image) as Phaser.GameObjects.Sprite).play(anims_key);
      return image;
    }
    throw_error(`${image} is not of type ${ObjectTypes.ImageType}`);
  }

  // IMAGE

  function create_image(
    x: number,
    y: number,
    asset_key: string,
  ): GameObject | undefined {
    if (
      preloadImageMap.get(asset_key)
      || preloadSpritesheetMap.get(asset_key)
    ) {
      const image = new Phaser.GameObjects.Sprite(scene, x, y, asset_key);
      return set_type(image, ObjectTypes.ImageType);
    }
    throw_error(`${asset_key} is not associated with any image`);
  }

  // AWARD

  function create_award(x: number, y: number, award_key: string): GameObject {
    return set_type(createAward(x, y, award_key), ObjectTypes.AwardType);
  }

  // TEXT

  function create_text(
    x: number,
    y: number,
    text: string,
    config: ObjectConfig = {},
  ): GameObject {
    const txt = new Phaser.GameObjects.Text(scene, x, y, text, config);
    return set_type(txt, ObjectTypes.TextType);
  }

  // RECTANGLE

  function create_rect(
    x: number,
    y: number,
    width: number,
    height: number,
    fill: number = 0,
    alpha: number = 1,
  ): GameObject {
    const rect = new Phaser.GameObjects.Rectangle(
      scene,
      x,
      y,
      width,
      height,
      fill,
      alpha,
    );
    return set_type(rect, ObjectTypes.RectType);
  }

  // ELLIPSE

  function create_ellipse(
    x: number,
    y: number,
    width: number,
    height: number,
    fill: number = 0,
    alpha: number = 1,
  ): GameObject {
    const ellipse = new Phaser.GameObjects.Ellipse(
      scene,
      x,
      y,
      width,
      height,
      fill,
      alpha,
    );
    return set_type(ellipse, ObjectTypes.EllipseType);
  }

  // CONTAINER

  function create_container(x: number, y: number): GameObject {
    const cont = new Phaser.GameObjects.Container(scene, x, y);
    return set_type(cont, ObjectTypes.ContainerType);
  }

  function add_to_container(
    container: GameObject,
    obj: GameObject,
  ): GameObject | undefined {
    if (
      is_type(container, ObjectTypes.ContainerType)
      && is_any_type(obj, ObjTypes)
    ) {
      get_container(container)
        .add(get_game_obj(obj));
      return container;
    }
    throw_error(
      `${obj} is not of type ${ObjTypes} or ${container} is not of type ${ObjectTypes.ContainerType}`,
    );
  }

  // OBJECT

  function destroy_obj(obj: GameObject) {
    if (is_any_type(obj, ObjTypes)) {
      get_game_obj(obj)
        .destroy();
    } else {
      throw_error(`${obj} is not of type ${ObjTypes}`);
    }
  }

  function set_display_size(
    obj: GameObject,
    x: number,
    y: number,
  ): GameObject | undefined {
    if (is_any_type(obj, ObjTypes)) {
      get_game_obj(obj)
        .setDisplaySize(x, y);
      return obj;
    }
    throw_error(`${obj} is not of type ${ObjTypes}`);
  }

  function set_alpha(obj: GameObject, alpha: number): GameObject | undefined {
    if (is_any_type(obj, ObjTypes)) {
      get_game_obj(obj)
        .setAlpha(alpha);
      return obj;
    }
    throw_error(`${obj} is not of type ${ObjTypes}`);
  }

  function set_interactive(
    obj: GameObject,
    config: ObjectConfig = {},
  ): GameObject | undefined {
    if (is_any_type(obj, ObjTypes)) {
      get_game_obj(obj)
        .setInteractive(config);
      return obj;
    }
    throw_error(`${obj} is not of type ${ObjTypes}`);
  }

  function set_origin(
    obj: GameObject,
    x: number,
    y: number,
  ): GameObject | undefined {
    if (is_any_type(obj, ObjTypes)) {
      (get_game_obj(obj) as RawGameObject).setOrigin(x, y);
      return obj;
    }
    throw_error(`${obj} is not of type ${ObjTypes}`);
  }

  function set_position(
    obj: GameObject,
    x: number,
    y: number,
  ): GameObject | undefined {
    if (obj && is_any_type(obj, ObjTypes)) {
      get_game_obj(obj)
        .setPosition(x, y);
      return obj;
    }
    throw_error(`${obj} is not of type ${ObjTypes}`);
  }

  function set_scale(
    obj: GameObject,
    x: number,
    y: number,
  ): GameObject | undefined {
    if (is_any_type(obj, ObjTypes)) {
      get_game_obj(obj)
        .setScale(x, y);
      return obj;
    }
    throw_error(`${obj} is not of type ${ObjTypes}`);
  }

  function set_rotation(obj: GameObject, rad: number): GameObject | undefined {
    if (is_any_type(obj, ObjTypes)) {
      get_game_obj(obj)
        .setRotation(rad);
      return obj;
    }
    throw_error(`${obj} is not of type ${ObjTypes}`);
  }

  function set_flip(
    obj: GameObject,
    x: boolean,
    y: boolean,
  ): GameObject | undefined {
    const GameElementType = [ObjectTypes.ImageType, ObjectTypes.TextType];
    if (is_any_type(obj, GameElementType)) {
      (get_obj(obj) as RawGameElement).setFlip(x, y);
      return obj;
    }
    throw_error(`${obj} is not of type ${GameElementType}`);
  }

  async function add_tween(
    obj: GameObject,
    config: ObjectConfig = {},
  ): Promise<GameObject | undefined> {
    if (is_any_type(obj, ObjTypes)) {
      scene.tweens.add({
        targets: get_game_obj(obj),
        ...config,
      });
      return obj;
    }
    throw_error(`${obj} is not of type ${ObjTypes}`);
  }

  // LISTENER

  function add_listener(
    obj: GameObject,
    event: string,
    callback: Function,
  ): GameObject | undefined {
    if (is_any_type(obj, ObjTypes)) {
      const listener = get_game_obj(obj)
        .addListener(event, callback);
      return set_type(listener, ListenerTypes.InputPlugin);
    }
    throw_error(`${obj} is not of type ${ObjTypes}`);
  }

  function add_keyboard_listener(
    key: string | number,
    event: string,
    callback: Function,
  ): GameObject {
    const keyObj = scene.input.keyboard.addKey(key);
    const keyboardListener = keyObj.addListener(event, callback);
    return set_type(keyboardListener, ListenerTypes.KeyboardKeyType);
  }

  function remove_listener(listener: GameObject): boolean {
    if (is_any_type(listener, ListnerTypes)) {
      get_input_obj(listener)
        .removeAllListeners();
      return true;
    }
    return false;
  }

  const functions = {
    add,
    add_listener,
    add_keyboard_listener,
    add_to_container,
    add_tween,
    create_anim,
    create_anim_config,
    create_anim_frame_config,
    create_anim_spritesheet_frame_configs,
    create_award,
    create_config,
    create_container,
    create_ellipse,
    create_image,
    create_interactive_config,
    create_rect,
    create_text,
    create_text_config,
    create_tween_config,
    create_sound_config,
    create_spritesheet_config,
    destroy_obj,
    get_screen_width,
    get_screen_height,
    get_screen_display_width,
    get_screen_display_height,
    load_image,
    load_sound,
    load_spritesheet,
    play_anim_on_image,
    play_sound,
    prepend_remote_url,
    remove_listener,
    set_alpha,
    set_display_size,
    set_flip,
    set_interactive,
    set_origin,
    set_position,
    set_rotation,
    set_scale,
  };

  const finalFunctions = {};

  Object.entries(functions)
    .forEach(([key, fn]) => {
      finalFunctions[key] = !scene ? nullFn : fn;
      finalFunctions[key].minArgsNeeded = fn.length;
    });

  return finalFunctions;
}

// =============================================================================
// Dummy functions for TypeDoc
//
// Refer to functions of matching signature in `gameFuncs`
// for implementation details
// =============================================================================

/**
 * Prepend the given asset key with the remote path (S3 path).
 *
 * @param asset_key
 * @returns prepended path
 */
export function prepend_remote_url(asset_key: string): string {
  return '';
}

/**
 * Transforms the given list into an object config. The list follows
 * the format of list([key1, value1], [key2, value2]).
 *
 * e.g list(["alpha", 0], ["duration", 1000])
 *
 * @param lst the list to be turned into object config.
 * @returns object config
 */
export function create_config(lst: List): ObjectConfig {
  return {};
}

/**
 * Create text config object, can be used to stylise text object.
 *
 * font_family: for available font_family, see:
 * https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#Valid_family_names
 *
 * align: must be either 'left', 'right', 'center', or 'justify'
 *
 * For more details about text config, see:
 * https://photonstorm.github.io/phaser3-docs/Phaser.Types.GameObjects.Text.html#.TextStyle
 *
 * @param font_family font to be used
 * @param font_size size of font, must be appended with 'px' e.g. '16px'
 * @param color colour of font, in hex e.g. '#fff'
 * @param stroke colour of stroke, in hex e.g. '#fff'
 * @param stroke_thickness thickness of stroke
 * @param align text alignment
 * @returns text config
 */
export function create_text_config(
  font_family: string = 'Courier',
  font_size: string = '16px',
  color: string = '#fff',
  stroke: string = '#fff',
  stroke_thickness: number = 0,
  align: string = 'left',
): ObjectConfig {
  return {};
}

/**
 * Create interactive config object, can be used to configure interactive settings.
 *
 * For more details about interactive config object, see:
 * https://photonstorm.github.io/phaser3-docs/Phaser.Types.Input.html#.InputConfiguration
 *
 * @param draggable object will be set draggable
 * @param use_hand_cursor if true, pointer will be set to 'pointer' when a pointer is over it
 * @param pixel_perfect pixel perfect function will be set for the hit area. Only works for texture based object
 * @param alpha_tolerance if pixel_perfect is set, this is the alpha tolerance threshold value used in the callback
 * @returns interactive config
 */
export function create_interactive_config(
  draggable: boolean = false,
  use_hand_cursor: boolean = false,
  pixel_perfect: boolean = false,
  alpha_tolerance: number = 1,
): ObjectConfig {
  return {};
}

/**
 * Create sound config object, can be used to configure sound settings.
 *
 * For more details about sound config object, see:
 * https://photonstorm.github.io/phaser3-docs/Phaser.Types.Sound.html#.SoundConfig
 *
 * @param mute whether the sound should be muted or not
 * @param volume value between 0(silence) and 1(full volume)
 * @param rate the speed at which the sound is played
 * @param detune detuning of the sound, in cents
 * @param seek position of playback for the sound, in seconds
 * @param loop whether or not the sound should loop
 * @param delay time, in seconds, that elapse before the sound actually starts
 * @returns sound config
 */
export function create_sound_config(
  mute: boolean = false,
  volume: number = 1,
  rate: number = 1,
  detune: number = 0,
  seek: number = 0,
  loop: boolean = false,
  delay: number = 0,
): ObjectConfig {
  return {};
}

/**
 * Create tween config object, can be used to configure tween settings.
 *
 * For more details about tween config object, see:
 * https://photonstorm.github.io/phaser3-docs/Phaser.Types.Tweens.html#.TweenBuilderConfig
 *
 * @param target_prop target to tween, e.g. x, y, alpha
 * @param target_value the property value to tween to
 * @param delay time in ms/frames before tween will start
 * @param duration duration of tween in ms/frames, exclude yoyos or repeats
 * @param ease ease function to use, e.g. 'Power0', 'Power1', 'Power2'
 * @param on_complete function to execute when tween completes
 * @param yoyo if set to true, once tween complete, reverses the values incrementally to get back to the starting tween values
 * @param loop number of times the tween should loop, or -1 to loop indefinitely
 * @param loop_delay The time the tween will pause before starting either a yoyo or returning to the start for a repeat
 * @param on_loop function to execute each time the tween loops
 * @returns tween config
 */
export function create_tween_config(
  target_prop: string = 'x',
  target_value: string | number = 0,
  delay: number = 0,
  duration: number = 1000,
  ease: Function | string = 'Power0',
  on_complete: Function,
  yoyo: boolean = false,
  loop: number = 0,
  loop_delay: number = 0,
  on_loop: Function,
): ObjectConfig {
  return {};
}

/**
 * Create anims config, can be used to configure anims
 *
 * For more details about the config object, see:
 * https://photonstorm.github.io/phaser3-docs/Phaser.Types.Animations.html#.Animation
 *
 * @param anims_key key that the animation will be associated with
 * @param anim_frames data used to generate the frames for animation
 * @param frame_rate frame rate of playback in frames per second
 * @param duration how long the animation should play in seconds.
 *                 If null, will be derived from frame_rate
 * @param repeat number of times to repeat the animation, -1 for infinity
 * @param yoyo should the animation yoyo (reverse back down to the start)
 * @param show_on_start should the sprite be visible when the anims start?
 * @param hide_on_complete should the sprite be not visible when the anims finish?
 * @returns animation config
 */
export function create_anim_config(
  anims_key: string,
  anim_frames: ObjectConfig[],
  frame_rate: number = 24,
  duration: any = null,
  repeat: number = -1,
  yoyo: boolean = false,
  show_on_start: boolean = true,
  hide_on_complete: boolean = false,
): ObjectConfig {
  return {};
}

/**
 * Create animation frame config, can be used to configure a specific frame
 * within an animation.
 *
 * The key should refer to an image that is already loaded.
 * To make frame_config from spritesheet based on its frames,
 * use create_anim_spritesheet_frame_configs instead.
 *
 * @param key key that is associated with the sprite at this frame
 * @param duration duration, in ms, of this frame of the animation
 * @param visible should the parent object be visible during this frame?
 * @returns animation frame config
 */
export function create_anim_frame_config(
  key: string,
  duration: number = 0,
  visible: boolean = true,
): ObjectConfig {
  return {};
}

/**
 * Create list of animation frame config, can be used directly as part of
 * anim_config's `frames` parameter.
 *
 * This function will generate list of frame configs based on the
 * spritesheet_config attached to the associated spritesheet.
 * This function requires that the given key is a spritesheet key
 * i.e. a key associated with loaded spritesheet, loaded in using
 * load_spritesheet function.
 *
 * Will return empty frame configs if key is not associated with
 * a spritesheet.
 *
 * @param key key associated with spritesheet
 * @returns animation frame configs
 */
export function create_anim_spritesheet_frame_configs(
  key: string,
): ObjectConfig[] | undefined {
  return undefined;
}

/**
 * Create spritesheet config, can be used to configure the frames within the
 * spritesheet. Can be used as config at load_spritesheet.
 *
 * @param frame_width width of frame in pixels
 * @param frame_height height of frame in pixels
 * @param start_frame first frame to start parsing from
 * @param margin margin in the image; this is the space around the edge of the frames
 * @param spacing the spacing between each frame in the image
 * @returns spritesheet config
 */
export function create_spritesheet_config(
  frame_width: number,
  frame_height: number,
  start_frame: number = 0,
  margin: number = 0,
  spacing: number = 0,
): ObjectConfig {
  return {};
}

// SCREEN

/**
 * Get in-game screen width.
 *
 * @return screen width
 */
export function get_screen_width(): number {
  return -1;
}

/**
 * Get in-game screen height.
 *
 * @return screen height
 */
export function get_screen_height(): number {
  return -1;
}

/**
 * Get game screen display width (accounting window size).
 *
 * @return screen display width
 */
export function get_screen_display_width(): number {
  return -1;
}

/**
 * Get game screen display height (accounting window size).
 *
 * @return screen display height
 */
export function get_screen_display_height(): number {
  return -1;
}

// LOAD

/**
 * Load the image asset into the scene for use. All images
 * must be loaded before used in create_image.
 *
 * @param key key to be associated with the image
 * @param url path to the image
 */
export function load_image(key: string, url: string) {}

/**
 * Load the sound asset into the scene for use. All sound
 * must be loaded before used in play_sound.
 *
 * @param key key to be associated with the sound
 * @param url path to the sound
 */
export function load_sound(key: string, url: string) {}

/**
 * Load the spritesheet into the scene for use. All spritesheet must
 * be loaded before used in create_image.
 *
 * @param key key associated with the spritesheet
 * @param url path to the sound
 * @param spritesheet_config config to determines frames within the spritesheet
 */
export function load_spritesheet(
  key: string,
  url: string,
  spritesheet_config: ObjectConfig,
) {
  return {};
}

// ADD

/**
 * Add the object to the scene. Only objects added to the scene
 * will appear.
 *
 * @param obj game object to be added
 */
export function add(obj: GameObject): GameObject | undefined {
  return undefined;
}

// SOUND

/**
 * Play the sound associated with the key.
 * Throws error if key is non-existent.
 *
 * @param key key to the sound to be played
 * @param config sound config to be used
 */
export function play_sound(key: string, config: ObjectConfig = {}): void {}

// ANIMS

/**
 * Create a new animation and add it to the available animations.
 * Animations are global i.e. once created, it can be used anytime, anywhere.
 *
 * NOTE: Anims DO NOT need to be added into the scene to be used.
 * It is automatically added to the scene when it is created.
 *
 * Will return true if the animation key is valid
 * (key is specified within the anim_config); false if the key
 * is already in use.
 *
 * @param anim_config
 * @returns true if animation is successfully created, false otherwise
 */
export function create_anim(anim_config: ObjectConfig): boolean {
  return false;
}

/**
 * Start playing the given animation on image game object.
 *
 * @param image image game object
 * @param anims_key key associated with an animation
 */
export function play_anim_on_image(
  image: GameObject,
  anims_key: string,
): GameObject | undefined {
  return undefined;
}

// IMAGE

/**
 * Create an image using the key associated with a loaded image.
 * If key is not associated with any loaded image, throws error.
 *
 * 0, 0 is located at the top, left hand side.
 *
 * @param x x position of the image. 0 is at the left side
 * @param y y position of the image. 0 is at the top side
 * @param asset_key key to loaded image
 * @returns image game object
 */
export function create_image(
  x: number,
  y: number,
  asset_key: string,
): GameObject | undefined {
  return undefined;
}

// AWARD

/**
 * Create an award using the key associated with the award.
 * The award key can be obtained from the Awards Hall or
 * Awards menu, after attaining the award.
 *
 * Valid award will have an on-hover VERIFIED tag to distinguish
 * it from images created by create_image.
 *
 * If student does not possess the award, this function will
 * return a untagged, default image.
 *
 * @param x x position of the image. 0 is at the left side
 * @param y y position of the image. 0 is at the top side
 * @param award_key key for award
 * @returns award game object
 */
export function create_award(
  x: number,
  y: number,
  award_key: string,
): GameObject {
  return {
    type: 'null',
    object: undefined,
  };
}

// TEXT

/**
 * Create a text object.
 *
 * 0, 0 is located at the top, left hand side.
 *
 * @param x x position of the text
 * @param y y position of the text
 * @param text text to be shown
 * @param config text configuration to be used
 * @returns text game object
 */
export function create_text(
  x: number,
  y: number,
  text: string,
  config: ObjectConfig = {},
): GameObject {
  return {
    type: 'null',
    object: undefined,
  };
}

// RECTANGLE

/**
 * Create a rectangle object.
 *
 * 0, 0 is located at the top, left hand side.
 *
 * @param x x coordinate of the top, left corner posiiton
 * @param y y coordinate of the top, left corner position
 * @param width width of rectangle
 * @param height height of rectangle
 * @param fill colour fill, in hext e.g 0xffffff
 * @param alpha value between 0 and 1 to denote alpha
 * @returns rectangle object
 */
export function create_rect(
  x: number,
  y: number,
  width: number,
  height: number,
  fill: number = 0,
  alpha: number = 1,
): GameObject {
  return {
    type: 'null',
    object: undefined,
  };
}

// ELLIPSE

/**
 * Create an ellipse object.
 *
 * @param x x coordinate of the centre of ellipse
 * @param y y coordinate of the centre of ellipse
 * @param width width of ellipse
 * @param height height of ellipse
 * @param fill colour fill, in hext e.g 0xffffff
 * @param alpha value between 0 and 1 to denote alpha
 * @returns ellipse object
 */
export function create_ellipse(
  x: number,
  y: number,
  width: number,
  height: number,
  fill: number = 0,
  alpha: number = 1,
): GameObject {
  return {
    type: 'null',
    object: undefined,
  };
}

// CONTAINER

/**
 * Create a container object. Container is able to contain any other game object,
 * and the positions of contained game object will be relative to the container.
 *
 * Rendering the container as visible or invisible will also affect the contained
 * game object.
 *
 * Container can also contain another container.
 *
 * 0, 0 is located at the top, left hand side.
 *
 * For more details about container object, see:
 * https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html
 *
 * @param x x position of the container
 * @param y y position of the container
 * @returns container object
 */
export function create_container(x: number, y: number): GameObject {
  return {
    type: 'container',
    object: undefined,
  };
}

/**
 * Add the given game object to the container.
 * Mutates the container.
 *
 * @param container container object
 * @param obj game object to add to the container
 * @returns container object
 */
export function add_to_container(
  container: GameObject,
  obj: GameObject,
): GameObject | undefined {
  return undefined;
}

// OBJECT

/**
 * Destroy the given game object. Destroyed game object
 * is removed from the scene, and all of its listeners
 * is also removed.
 *
 * @param obj game object itself
 */
export function destroy_obj(obj: GameObject) {}

/**
 * Set the display size of the object.
 * Mutate the object.
 *
 * @param obj object to be set
 * @param x new display width size
 * @param y new display height size
 * @returns game object itself
 */
export function set_display_size(
  obj: GameObject,
  x: number,
  y: number,
): GameObject | undefined {
  return undefined;
}

/**
 * Set the alpha of the object.
 * Mutate the object.
 *
 * @param obj object to be set
 * @param alpha new alpha
 * @returns game object itself
 */
export function set_alpha(
  obj: GameObject,
  alpha: number,
): GameObject | undefined {
  return undefined;
}

/**
 * Set the interactivity of the object.
 * Mutate the object.
 *
 * Rectangle and Ellipse are not able to receive configs, only boolean
 * i.e. set_interactive(rect, true); set_interactive(ellipse, false)
 *
 * @param obj object to be set
 * @param config interactive config to be used
 * @returns game object itself
 */
export function set_interactive(
  obj: GameObject,
  config: ObjectConfig = {},
): GameObject | undefined {
  return undefined;
}

/**
 * Set the origin in which all position related will be relative to.
 * In other words, the anchor of the object.
 * Mutate the object.
 *
 * @param obj object to be set
 * @param x new anchor x coordinate, between value 0 to 1.
 * @param y new anchor y coordinate, between value 0 to 1.
 * @returns game object itself
 */
export function set_origin(
  obj: GameObject,
  x: number,
  y: number,
): GameObject | undefined {
  return undefined;
}

/**
 * Set the position of the game object
 * Mutate the object
 *
 * @param obj object to be set
 * @param x new x position
 * @param y new y position
 * @returns game object itself
 */
export function set_position(
  obj: GameObject,
  x: number,
  y: number,
): GameObject | undefined {
  return undefined;
}

/**
 * Set the scale of the object.
 * Mutate the object.
 *
 * @param obj object to be set
 * @param x new x scale
 * @param y new y scale
 * @returns game object itself
 */
export function set_scale(
  obj: GameObject,
  x: number,
  y: number,
): GameObject | undefined {
  return undefined;
}

/**
 * Set the rotation of the object.
 * Mutate the object.
 *
 * @param obj object to be set
 * @param rad the rotation, in radians
 * @returns game object itself
 */
export function set_rotation(
  obj: GameObject,
  rad: number,
): GameObject | undefined {
  return undefined;
}

/**
 * Sets the horizontal and flipped state of the object.
 * Mutate the object.
 *
 * @param obj game object itself
 * @param x to flip in the horizontal state
 * @param y to flip in the vertical state
 * @returns game object itself
 */
export function set_flip(
  obj: GameObject,
  x: boolean,
  y: boolean,
): GameObject | undefined {
  return undefined;
}

/**
 * Creates a tween to the object and plays it.
 * Mutate the object.
 *
 * @param obj object to be added to
 * @param config tween config
 * @returns game object itself
 */
export async function add_tween(
  obj: GameObject,
  config: ObjectConfig = {},
): Promise<GameObject | undefined> {
  return undefined;
}

// LISTENER

/**
 * Attach a listener to the object. The callback will be executed
 * when the event is emitted.
 * Mutate the object.
 *
 * For all available events, see:
 * https://photonstorm.github.io/phaser3-docs/Phaser.Input.Events.html
 *
 * @param obj object to be added to
 * @param event the event name
 * @param callback listener function, executed on event
 * @returns listener game object
 */
export function add_listener(
  obj: GameObject,
  event: string,
  callback: Function,
): GameObject | undefined {
  return undefined;
}

/**
 * Attach a listener to the object. The callback will be executed
 * when the event is emitted.
 * Mutate the object.
 *
 * For all available events, see:
 * https://photonstorm.github.io/phaser3-docs/Phaser.Input.Events.html
 *
 * For list of keycodes, see:
 * https://github.com/photonstorm/phaser/blob/v3.22.0/src/input/keyboard/keys/KeyCodes.js
 *
 * @param key keyboard key to trigger listener
 * @param event the event name
 * @param callback listener function, executed on event
 * @returns listener game object
 */
export function add_keyboard_listener(
  key: string | number,
  event: string,
  callback: Function,
): GameObject {
  return {
    type: 'null',
    object: undefined,
  };
}

/**
 * Deactivate and remove listener.
 *
 * @param listener
 * @returns if successful
 */
export function remove_listener(listener: GameObject): boolean {
  return false;
}
