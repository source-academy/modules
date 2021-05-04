import {
  ObjectConfig,
  GameObject,
  TypedGameObject,
  GameParams,
  InputObject,
  Container,
  GameElement,
} from './types';

/**
 * Game library that translates Phaser 3 API into Source.
 *
 * More in-depth explanation of the Phaser 3 API can be found at
 * Phaser 3 documentation itself.
 *
 * For Phaser 3 API Documentation, check:
 * https://photonstorm.github.io/phaser3-docs/
 *
 * Author: Anthony Halim, Chong Sia Tiffany, Chi Xu, Gokul Rajiv
 */

/* eslint-disable @typescript-eslint/no-unused-vars, consistent-return */
export default function gameFuncs(_params: GameParams) {
  const {
    scene,
    phaser,
    preloadImageMap,
    preloadSoundMap,
    preloadSpritesheetMap,
    remotePath,
    screenSize,
    createAward,
  } = _params;

  // Listener Types
  const imputPlugin = 'input_plugin';
  const keyboardKeyType = 'keyboard_key';
  const listenerTypes = [imputPlugin, keyboardKeyType];

  // Object types
  const imageType = 'image';
  const textType = 'text';
  const rectType = 'rect';
  const ellipseType = 'ellipse';
  const containerType = 'container';
  const awardType = 'award';
  const objTypes = [
    imageType,
    textType,
    rectType,
    ellipseType,
    containerType,
    awardType,
  ];

  // const nullStr = '';
  const nullFn = () => {};

  // export default () => ({
  //   create_text_config,
  // });

  // PRIVATE

  function get_obj(obj: TypedGameObject): GameObject | InputObject | Container {
    return obj[1];
  }

  function get_game_obj(obj: TypedGameObject): GameObject {
    return obj[1] as GameObject;
  }

  function get_input_obj(obj: TypedGameObject): InputObject {
    return obj[1] as InputObject;
  }

  function get_container(obj: TypedGameObject): Container {
    return obj[1] as Container;
  }

  /**
   * Checks whether the given game object is of the enquired type.
   * If the given obj is undefined, will also return false.
   *
   * @param {TypedGameObject} obj the game object
   * @param {string} type enquired type
   * @returns {boolean}
   */
  function is_type(obj: TypedGameObject, type: string): boolean {
    return obj !== undefined && obj[0] === type && obj[1] !== undefined;
  }

  /**
   * Checks whether the given game object is any of the enquired types
   *
   * @param {TypedGameObject} obj the game object
   * @param {string[]} types enquired types
   * @returns {boolean}
   */
  function is_any_type(obj: TypedGameObject, types: string[]): boolean {
    /* eslint-disable no-plusplus */
    for (let i = 0; i < types.length; ++i) {
      if (is_type(obj, types[i])) return true;
    }
    return false;
  }

  /**
   * Set a game object to the given type.
   * Mutates the object.
   *
   * @param {GameObject | InputObject | Container} obj the game object
   * @param {string} type type to set
   * @returns {TypedGameObject} object itself
   */
  function set_type(
    obj: GameObject | InputObject | Container,
    type: string
  ): TypedGameObject {
    return [type, obj];
  }

  /**
   * Throw a console error, including the function caller name.
   *
   * @param {string} message error message
   */
  function throw_error(message: string) {
    // eslint-disable-next-line no-console, no-caller, @typescript-eslint/no-throw-literal, no-restricted-properties
    throw console.error(`${arguments.callee.caller.name}: ${message}`);
  }

  function head(lst: any[]) {
    return lst[0];
  }

  function tail(lst: any[]) {
    return lst[1];
  }

  function map(f: any, lst: any[]) {
    return lst.map(f);
  }

  function is_pair(lst: any[]) {
    return Array.isArray(lst) && lst.length === 2;
  }
  /**
   * Transforms the given list into config object. The list follows
   * the format of list([key1, value1], [key2, value2]).
   *
   * e.g list(["alpha", 0], ["duration", 1000])
   *
   * @param {any[]]} lst the list to be turned into config object.
   * @returns {ObjectConfig} config object
   */
  function create_config(lst: any[]): ObjectConfig {
    const config = {};

    map((xs: any) => {
      if (!is_pair(xs)) {
        throw_error(`xs is not pair!`);
      }
      config[head(xs)] = tail(xs);
    }, lst);

    return config;
  }

  // HELPER

  /**
   * Prepend the given asset key with the remote path (S3 path).
   *
   * @param {string} asset_key
   * @returns {string} prepended path
   */
  function prepend_remote_url(asset_key: string): string {
    return remotePath + asset_key;
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
   * @param {string} font_family font to be used
   * @param {string} font_size size of font, must be appended with 'px' e.g. '16px'
   * @param {string} color colour of font, in hex e.g. '#fff'
   * @param {string} stroke colour of stroke, in hex e.g. '#fff'
   * @param {number} stroke_thickness thickness of stroke
   * @param {string} align text alignment
   * @returns {ObjectConfig} text config
   */
  function create_text_config(
    font_family: string = 'Courier',
    font_size: string = '16px',
    color: string = '#fff',
    stroke: string = '#fff',
    stroke_thickness: number = 0,
    align: string = 'left'
  ): ObjectConfig {
    const lst = [
      ['fontFamily', font_family],
      ['fontSize', font_size],
      ['color', color],
      ['stroke', stroke],
      ['strokeThickness', stroke_thickness],
      ['align', align],
    ];
    return create_config(lst);
  }

  /**
   * Create interactive config object, can be used to configure interactive settings.
   *
   * For more details about interactive config object, see:
   * https://photonstorm.github.io/phaser3-docs/Phaser.Types.Input.html#.InputConfiguration
   *
   * @param {boolean} draggable object will be set draggable
   * @param {boolean} use_hand_cursor if true, pointer will be set to 'pointer' when a pointer is over it
   * @param {boolean} pixel_perfect pixel perfect function will be set for the hit area. Only works for texture based object
   * @param {number} alpha_tolerance if pixel_perfect is set, this is the alpha tolerance threshold value used in the callback
   * @returns {ObjectConfig} interactive config
   */
  function create_interactive_config(
    draggable: boolean = false,
    use_hand_cursor: boolean = false,
    pixel_perfect: boolean = false,
    alpha_tolerance: number = 1
  ): ObjectConfig {
    const lst = [
      ['draggable', draggable],
      ['useHandCursor', use_hand_cursor],
      ['pixelPerfect', pixel_perfect],
      ['alphaTolerance', alpha_tolerance],
    ];
    return create_config(lst);
  }

  /**
   * Create sound config object, can be used to configure sound settings.
   *
   * For more details about sound config object, see:
   * https://photonstorm.github.io/phaser3-docs/Phaser.Types.Sound.html#.SoundConfig
   *
   * @param {boolean} mute whether the sound should be muted or not
   * @param {number} volume value between 0(silence) and 1(full volume)
   * @param {number} rate the speed at which the sound is played
   * @param {number} detune detuning of the sound, in cents
   * @param {number} seek position of playback for the sound, in seconds
   * @param {boolean} loop whether or not the sound should loop
   * @param {number} delay time, in seconds, that elapse before the sound actually starts
   * @returns {ObjectConfig} sound config
   */
  function create_sound_config(
    mute: boolean = false,
    volume: number = 1,
    rate: number = 1,
    detune: number = 0,
    seek: number = 0,
    loop: boolean = false,
    delay: number = 0
  ): ObjectConfig {
    const lst = [
      ['mute', mute],
      ['volume', volume],
      ['rate', rate],
      ['detune', detune],
      ['seek', seek],
      ['loop', loop],
      ['delay', delay],
    ];
    return create_config(lst);
  }

  /**
   * Create tween config object, can be used to configure tween settings.
   *
   * For more details about tween config object, see:
   * https://photonstorm.github.io/phaser3-docs/Phaser.Types.Tweens.html#.TweenBuilderConfig
   *
   * @param {string} target_prop target to tween, e.g. x, y, alpha
   * @param {string | number} target_value the property value to tween to
   * @param {number} delay time in ms/frames before tween will start
   * @param {number} duration duration of tween in ms/frames, exclude yoyos or repeats
   * @param {Function | string} ease ease function to use, e.g. 'Power0', 'Power1', 'Power2'
   * @param {Function} on_complete function to execute when tween completes
   * @param {boolean} yoyo if set to true, once tween complete, reverses the values incrementally to get back to the starting tween values
   * @param {number} loop number of times the tween should loop, or -1 to loop indefinitely
   * @param {number} loop_delay The time the tween will pause before starting either a yoyo or returning to the start for a repeat
   * @param {Function} on_loop function to execute each time the tween loops
   * @returns {ObjectConfig} tween config
   */
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
    on_loop: Function = nullFn
  ): ObjectConfig {
    const lst = [
      [target_prop, target_value],
      ['delay', delay],
      ['duration', duration],
      ['ease', ease],
      ['onComplete', on_complete],
      ['yoyo', yoyo],
      ['loop', loop],
      ['loopDelay', loop_delay],
      ['onLoop', on_loop],
    ];
    return create_config(lst);
  }

  /**
   * Create anims config, can be used to configure anims
   *
   * For more details about the config object, see:
   * https://photonstorm.github.io/phaser3-docs/Phaser.Types.Animations.html#.Animation
   *
   * @param {string} anims_key key that the animation will be associated with
   * @param {ObjectConfig[]} anim_frames data used to generate the frames for animation
   * @param {number} frame_rate frame rate of playback in frames per second
   * @param {number} duration how long the animation should play in seconds.
   *                     If null, will be derived from frame_rate
   * @param {number} repeat number of times to repeat the animation, -1 for infinity
   * @param {boolean} yoyo should the animation yoyo (reverse back down to the start)
   * @param {boolean} show_on_start should the sprite be visible when the anims start?
   * @param {boolean} hide_on_complete should the sprite be not visible when the anims finish?
   * @returns {ObjectConfig} anim config
   */
  function create_anim_config(
    anims_key: string,
    anim_frames: ObjectConfig[],
    frame_rate: number = 24,
    duration: any = null,
    repeat: number = -1,
    yoyo: boolean = false,
    show_on_start: boolean = true,
    hide_on_complete: boolean = false
  ): ObjectConfig {
    const lst = [
      ['key', anims_key],
      ['frames', anim_frames],
      ['frameRate', frame_rate],
      ['duration', duration],
      ['repeat', repeat],
      ['yoyo', yoyo],
      ['showOnStart', show_on_start],
      ['hideOnComplete', hide_on_complete],
    ];
    return create_config(lst);
  }

  /**
   * Create animation frame config, can be used to configure a specific frame
   * within an animation.
   *
   * The key should refer to an image that is already loaded.
   * To make frame_config from spritesheet based on its frames,
   * use create_anim_spritesheet_frame_configs instead.
   *
   * @param {string} key key that is associated with the sprite at this frame
   * @param {string | number} frame either index or string, of the frame
   * @param {number} duration duration, in ms, of this frame of the animation
   * @param {boolean} visible should the parent object be visible during this frame?
   * @returns {ObjectConfig} anim frame config
   */
  function create_anim_frame_config(
    key: string,
    duration: number = 0,
    visible: boolean = true
  ): ObjectConfig {
    const lst = [
      ['key', key],
      ['duration', duration],
      ['visible', visible],
    ];
    return create_config(lst);
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
    * @param {string} key key associated with spritesheet 
    * @returns {ObjectConfig[]}
    */
  function create_anim_spritesheet_frame_configs(key: string): any {
    if (preloadSpritesheetMap.get(key)) {
      const configArr = scene.anims.generateFrameNumbers(key, {});
      return configArr;
    }
    throw_error(`${key} is not associated with any spritesheet`);
  }

  /**
   * Create spritesheet config, can be used to configure the frames within the
   * spritesheet. Can be used as config at load_spritesheet.
   *
   * @param {number} frame_width width of frame in pixels
   * @param {number} frame_height height of frame in pixels
   * @param {number} start_frame first frame to start parsing from
   * @param {number} margin margin in the image; this is the space around the edge of the frames
   * @param {number} spacing the spacing between each frame in the image
   * @returns {ObjectConfig} spritesheet config
   */
  function create_spritesheet_config(
    frame_width: number,
    frame_height: number,
    start_frame: number = 0,
    margin: number = 0,
    spacing: number = 0
  ): ObjectConfig {
    const lst = [
      ['frameWidth', frame_width],
      ['frameHeight', frame_height],
      ['startFrame', start_frame],
      ['margin', margin],
      ['spacing', spacing],
    ];
    return create_config(lst);
  }

  // SCREEN

  /**
   * Get in-game screen width.
   *s
   * @return {number} screen width
   */
  function get_screen_width(): number {
    return screenSize.x;
  }

  /**
   * Get in-game screen height.
   *
   * @return {number} screen height
   */
  function get_screen_height(): number {
    return screenSize.y;
  }

  /**
   * Get game screen display width (accounting window size).
   *
   * @return {number} screen display width
   */
  function get_screen_display_width(): number {
    return scene.scale.displaySize.width;
  }

  /**
   * Get game screen display height (accounting window size).
   *
   * @return {number} screen display height
   */
  function get_screen_display_height(): number {
    return scene.scale.displaySize.height;
  }

  // LOAD

  /**
   * Load the image asset into the scene for use. All images
   * must be loaded before used in create_image.
   *
   * @param {string} key key to be associated with the image
   * @param {string} url path to the image
   */
  function load_image(key: string, url: string) {
    preloadImageMap.set(key, url);
  }

  /**
   * Load the sound asset into the scene for use. All sound
   * must be loaded before used in play_sound.
   *
   * @param {string} key key to be associated with the sound
   * @param {string} url path to the sound
   */
  function load_sound(key: string, url: string) {
    preloadSoundMap.set(key, url);
  }

  /**
   * Load the spritesheet into the scene for use. All spritesheet must
   * be loaded before used in create_image.
   *
   * @param {string} key key associated with the spritesheet
   * @param {string} url path to the sound
   * @param {ObjectConfig} spritesheet_config config to determines frames within the spritesheet
   */
  function load_spritesheet(
    key: string,
    url: string,
    spritesheet_config: ObjectConfig
  ) {
    preloadSpritesheetMap.set(key, [url, spritesheet_config]);
  }

  // ADD

  /**
   * Add the object to the scene. Only objects added to the scene
   * will appear.
   *
   * @param {TypedGameObject} obj game object to be added
   */
  function add(obj: TypedGameObject): TypedGameObject | undefined {
    if (is_any_type(obj, objTypes)) {
      scene.add.existing(get_obj(obj) as Phaser.GameObjects.GameObject);
      return obj;
    }
    throw_error(`${obj} is not of type ${objTypes}`);
  }

  // SOUND

  /**
   * Play the sound associated with the key.
   * Throws error if key is non-existent.
   *
   * @param {string} key key to the sound to be played
   * @param {ObjectConfig} config sound config to be used
   */
  function play_sound(key: string, config: ObjectConfig = {}): void {
    if (preloadSoundMap.get(key)) {
      scene.sound.play(key, config);
    } else {
      throw_error(`${key} is not associated with any sound`);
    }
  }

  // ANIMS

  /**
   * Create a new animation and add it to the available animations.
   * Animations are global i.e. once created, it can be used anytime, anywhere.
   *
   * NOTE: Anims DO NOT need to be added into the scene to be used.
   * It is automatically added to the scene when it is created.
   *
   * WIll return true if the animation key is valid
   * (key is specified within the anim_config); false if the key
   * is already in use.
   *
   * @param {ObjectConfig} anim_config
   * @returns {boolean} true if animation is successfully created, false otherwise
   */
  function create_anim(anim_config: ObjectConfig): boolean {
    const anims = scene.anims.create(anim_config);
    return typeof anims !== 'boolean';
  }

  /**
   * Start playing the given animation on image game object. TODO
   *
   * @param {TypedGameObject} image image game object
   * @param {string} anims_key key associated with an animation
   */
  function play_anim_on_image(
    image: TypedGameObject,
    anims_key: string
  ): TypedGameObject | undefined {
    if (is_type(image, imageType)) {
      (get_obj(image) as Phaser.GameObjects.Sprite).play(anims_key);
      return image;
    }
    throw_error(`${image} is not of type ${imageType}`);
  }

  // IMAGE

  /**
   * Create an image using the key associated with a loaded image.
   * If key is not associated with any loaded image, throws error.
   *
   * 0, 0 is located at the top, left hand side.
   *
   * @param {number} x x position of the image. 0 is at the left side
   * @param {number} y y position of the image. 0 is at the top side
   * @param {string} asset_key key to loaded image
   * @returns {TypedGameObject} image game object
   */
  // TODO
  function create_image(
    x: number,
    y: number,
    asset_key: string
  ): TypedGameObject | undefined {
    if (
      preloadImageMap.get(asset_key) ||
      preloadSpritesheetMap.get(asset_key)
    ) {
      const image = new Phaser.GameObjects.Sprite(scene, x, y, asset_key);
      return set_type(image, imageType);
    }
    throw_error(`${asset_key} is not associated with any image`);
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
   * @param {number} x x position of the image. 0 is at the left side
   * @param {number} y y position of the image. 0 is at the top side
   * @param {string} award_key key for award
   * @returns {TypedGameObject} award game object
   */
  function create_award(
    x: number,
    y: number,
    award_key: string
  ): TypedGameObject {
    return set_type(createAward(x, y, award_key), awardType);
  }

  // TEXT

  /**
   * Create a text object.
   *
   * 0, 0 is located at the top, left hand side.
   *
   * @param {number} x x position of the text
   * @param {number} y y position of the text
   * @param {string} text text to be shown
   * @param {ObjectConfig} config text configuration to be used
   * @returns {TypedGameObject} text game object
   */
  function create_text(
    x: number,
    y: number,
    text: string,
    config: ObjectConfig = {}
  ): TypedGameObject {
    const txt = new Phaser.GameObjects.Text(scene, x, y, text, config);
    return set_type(txt, textType);
  }

  // RECTANGLE

  /**
   * Create a rectangle object.
   *
   * 0, 0 is located at the top, left hand side.
   *
   * @param {number} x x coordinate of the top, left corner posiiton
   * @param {number} y y coordinate of the top, left corner position
   * @param {number} width width of rectangle
   * @param {number} height height of rectangle
   * @param {number} fill colour fill, in hext e.g 0xffffff
   * @param {number} alpha value between 0 and 1 to denote alpha
   * @returns {TypedGameObject} rectangle object
   */
  function create_rect(
    x: number,
    y: number,
    width: number,
    height: number,
    fill: number = 0,
    alpha: number = 1
  ): TypedGameObject {
    const rect = new Phaser.GameObjects.Rectangle(
      scene,
      x,
      y,
      width,
      height,
      fill,
      alpha
    );
    return set_type(rect, rectType);
  }

  // ELLIPSE

  /**
   * Create an ellipse object.
   *
   * @param {number} x x coordinate of the centre of ellipse
   * @param {number} y y coordinate of the centre of ellipse
   * @param {number} width width of ellipse
   * @param {number} height height of ellipse
   * @param {number} fill colour fill, in hext e.g 0xffffff
   * @param {number} alpha value between 0 and 1 to denote alpha
   * @returns {TypedGameObject} ellipse object
   */
  function create_ellipse(
    x: number,
    y: number,
    width: number,
    height: number,
    fill: number = 0,
    alpha: number = 1
  ): TypedGameObject {
    const ellipse = new Phaser.GameObjects.Ellipse(
      scene,
      x,
      y,
      width,
      height,
      fill,
      alpha
    );
    return set_type(ellipse, ellipseType);
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
   * @param {number} x x position of the container
   * @param {number} y y position of the container
   * @returns {TypedGameObject} container object
   */
  function create_container(x: number, y: number): TypedGameObject {
    const cont = new Phaser.GameObjects.Container(scene, x, y);
    return set_type(cont, containerType);
  }

  /**
   * Add the given game object to the container.
   * Mutates the container.
   *
   * @param {TypedGameObject} container container object
   * @param {GameObject} obj game object to add to the container
   * @returns {TypedGameObject | undefined} container object
   */
  function add_to_container(
    container: TypedGameObject,
    obj: TypedGameObject
  ): TypedGameObject | undefined {
    if (is_type(container, containerType) && is_any_type(obj, objTypes)) {
      (get_obj(container) as Phaser.GameObjects.Container).add(
        get_obj(obj) as Phaser.GameObjects.GameObject
      );
      return container;
    }
    throw_error(
      `${obj} is not of type ${objTypes} or ${container} is not of type ${containerType}`
    );
  }

  // OBJECT

  /**
   * Destroy the given game object. Destroyed game object
   * is removed from the scene, and all of its listeners
   * is also removed.
   *
   * @param {TypedGameObject} obj game object itself
   */
  function destroy_obj(obj: TypedGameObject) {
    if (is_any_type(obj, objTypes)) {
      get_obj(obj).destroy();
    } else {
      throw_error(`${obj} is not of type ${objTypes}`);
    }
  }

  /**
   * Set the display size of the object.
   * Mutate the object.
   *
   * @param {TypedGameObject} obj object to be set
   * @param {number} x new display width size
   * @param {number} y new display height size
   * @returns {TypedGameObject | undefined} game object itself
   */
  function set_display_size(
    obj: TypedGameObject,
    x: number,
    y: number
  ): TypedGameObject | undefined {
    if (is_any_type(obj, objTypes)) {
      get_game_obj(obj).setDisplaySize(x, y);
      return obj;
    }
    throw_error(`${obj} is not of type ${objTypes}`);
  }

  /**
   * Set the alpha of the object.
   * Mutate the object.
   *
   * @param {TypedGameObject} obj object to be set
   * @param {number} alpha new alpha
   * @returns {TypedGameObject | undefined} game object itself
   */
  function set_alpha(
    obj: TypedGameObject,
    alpha: number
  ): TypedGameObject | undefined {
    if (is_any_type(obj, objTypes)) {
      get_game_obj(obj).setAlpha(alpha);
      return obj;
    }
    throw_error(`${obj} is not of type ${objTypes}`);
  }

  /**
   * Set the interactivity of the object.
   * Mutate the object.
   *
   * Rectangle and Ellipse are not able to receive configs, only boolean
   * i.e. set_interactive(rect, true); set_interactive(ellipse, false)
   *
   * @param {TypedGameObject} obj object to be set
   * @param {ObjectConfig} config interactive config to be used
   * @returns {TypedGameObject | undefined} game object itself
   */
  function set_interactive(
    obj: TypedGameObject,
    config: ObjectConfig = {}
  ): TypedGameObject | undefined {
    if (is_any_type(obj, objTypes)) {
      get_game_obj(obj).setInteractive(config);
      return obj;
    }
    throw_error(`${obj} is not of type ${objTypes}`);
  }

  /**
   * Set the origin in which all position related will be relative to.
   * In other words, the anchor of the object.
   * Mutate the object.
   *
   * @param {TypedGameObject} obj object to be set
   * @param {number} x new anchor x coordinate, between value 0 to 1.
   * @param {number} y new anchor y coordinate, between value 0 to 1.
   * @returns {TypedGameObject | undefined} game object itself
   */
  function set_origin(
    obj: TypedGameObject,
    x: number,
    y: number
  ): TypedGameObject | undefined {
    if (is_any_type(obj, objTypes)) {
      get_game_obj(obj).setOrigin(x, y);
      return obj;
    }
    throw_error(`${obj} is not of type ${objTypes}`);
  }

  /**
   * Set the position of the game object
   * Mutate the object
   *
   * @param {TypedGameObject} obj object to be set
   * @param {number} x new x position
   * @param {number} y new y position
   * @returns {TypedGameObject | undefined} game object itself
   */
  function set_position(
    obj: TypedGameObject,
    x: number,
    y: number
  ): TypedGameObject | undefined {
    if (obj && is_any_type(obj, objTypes)) {
      get_container(obj).setPosition(x, y);
      return obj;
    }
    throw_error(`${obj} is not of type ${objTypes}`);
  }

  /**
   * Set the scale of the object.
   * Mutate the object.
   *
   * @param {TypedGameObject} obj object to be set
   * @param {number} x new x scale
   * @param {number} y new y scale
   * @returns {TypedGameObject | undefined} game object itself
   */
  function set_scale(
    obj: TypedGameObject,
    x: number,
    y: number
  ): TypedGameObject | undefined {
    if (is_any_type(obj, objTypes)) {
      get_game_obj(obj).setScale(x, y);
      return obj;
    }
    throw_error(`${obj} is not of type ${objTypes}`);
  }

  /**
   * Set the rotation of the object.
   * Mutate the object.
   *
   * @param {TypedGameObject} obj object to be set
   * @param {number} rad the rotation, in radians
   * @returns {TypedGameObject | undefined} game object itself
   */
  function set_rotation(
    obj: TypedGameObject,
    rad: number
  ): TypedGameObject | undefined {
    if (is_any_type(obj, objTypes)) {
      get_game_obj(obj).setRotation(rad);
      return obj;
    }
    throw_error(`${obj} is not of type ${objTypes}`);
  }

  /**
   * Sets the horizontal and flipped state of the object.
   * Mutate the object.
   *
   * @param {TypedGameObject} obj game object itself
   * @param {boolean} x to flip in the horizontal state
   * @param {boolean} y to flip in the vertical state
   * @returns {TypedGameObject | undefined} game object itself
   */
  function set_flip(
    obj: TypedGameObject,
    x: boolean,
    y: boolean
  ): TypedGameObject | undefined {
    if (is_any_type(obj, objTypes)) {
      (get_obj(obj) as GameElement).setFlip(x, y);
      return obj;
    }
    throw_error(`${obj} is not of type ${objTypes}`);
  }

  /**
   * Create a tween to the object and plays it.
   * Mutate the object.
   *
   * @param {TypedGameObject} obj object to be added to
   * @param {ObjectConfig} config tween config
   * @returns {Promise<TypedGameObject | undefined>} game object itself
   */
  async function add_tween(
    obj: TypedGameObject,
    config: ObjectConfig = {}
  ): Promise<TypedGameObject | undefined> {
    if (is_any_type(obj, objTypes)) {
      scene.tweens.add({
        targets: get_obj(obj),
        ...config,
      });
      return obj;
    }
    throw_error(`${obj} is not of type ${objTypes}`);
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
   * @param {TypedGameObject} obj object to be added to
   * @param {string} event the event name
   * @param {Function} callback listener function, executed on event
   * @returns {TypedGameObject | undefined} listener
   */
  function add_listener(
    obj: TypedGameObject,
    event: string,
    callback: Function
  ): TypedGameObject | undefined {
    if (is_any_type(obj, objTypes)) {
      const listener = get_obj(obj).addListener(event, callback);
      return set_type(listener, imputPlugin);
    }
    throw_error(`${obj} is not of type ${objTypes}`);
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
   * @param {string | number} key keyboard key
   * @param {string} event
   * @param {Function} callback listener function, executed on event
   * @returns {TypedGameObject} listener
   */
  function add_keyboard_listener(
    key: string | number,
    event: string,
    callback: Function
  ): TypedGameObject {
    const keyObj = scene.input.keyboard.addKey(key);
    const keyboardListener = keyObj.addListener(event, callback);
    return set_type(keyboardListener, keyboardKeyType);
  }

  /**
   * Deactivate and remove listener.
   *
   * @param {TypedGameObject} listener
   * @returns {boolean} if successful
   */
  function remove_listener(listener: TypedGameObject): boolean {
    if (is_any_type(listener, listenerTypes)) {
      get_input_obj(listener).removeAllListeners();
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

  // const finalFunctions = {};

  // Object.entries(functions).map(([key, fn]) => {
  //   finalFunctions[key] = !Phaser || !scene ? nullFn : fn;
  // });

  // return finalFunctions;
  return functions;
}
