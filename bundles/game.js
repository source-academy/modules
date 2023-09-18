require => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => (key in obj) ? __defProp(obj, key, {
    enumerable: true,
    configurable: true,
    writable: true,
    value
  }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols) for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }
    return a;
  };
  var __require = (x => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function (x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __export = (target, all) => {
    for (var name in all) __defProp(target, name, {
      get: all[name],
      enumerable: true
    });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
        get: () => from[key],
        enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
      });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
    value: mod,
    enumerable: true
  }) : target, mod));
  var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
    value: true
  }), mod);
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = value => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = value => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = x => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  var game_exports = {};
  __export(game_exports, {
    add: () => add,
    add_keyboard_listener: () => add_keyboard_listener,
    add_listener: () => add_listener,
    add_to_container: () => add_to_container,
    add_tween: () => add_tween,
    create_anim: () => create_anim,
    create_anim_config: () => create_anim_config,
    create_anim_frame_config: () => create_anim_frame_config,
    create_anim_spritesheet_frame_configs: () => create_anim_spritesheet_frame_configs,
    create_award: () => create_award,
    create_config: () => create_config,
    create_container: () => create_container,
    create_ellipse: () => create_ellipse,
    create_image: () => create_image,
    create_interactive_config: () => create_interactive_config,
    create_rect: () => create_rect,
    create_sound_config: () => create_sound_config,
    create_spritesheet_config: () => create_spritesheet_config,
    create_text: () => create_text,
    create_text_config: () => create_text_config,
    create_tween_config: () => create_tween_config,
    destroy_obj: () => destroy_obj,
    get_screen_display_height: () => get_screen_display_height,
    get_screen_display_width: () => get_screen_display_width,
    get_screen_height: () => get_screen_height,
    get_screen_width: () => get_screen_width,
    load_image: () => load_image,
    load_sound: () => load_sound,
    load_spritesheet: () => load_spritesheet,
    play_anim_on_image: () => play_anim_on_image,
    play_sound: () => play_sound,
    prepend_remote_url: () => prepend_remote_url,
    remove_listener: () => remove_listener,
    set_alpha: () => set_alpha,
    set_display_size: () => set_display_size,
    set_flip: () => set_flip,
    set_interactive: () => set_interactive,
    set_origin: () => set_origin,
    set_position: () => set_position,
    set_rotation: () => set_rotation,
    set_scale: () => set_scale
  });
  var import_context = __toESM(__require("js-slang/context"), 1);
  function gameFuncs() {
    const {scene, preloadImageMap, preloadSoundMap, preloadSpritesheetMap, remotePath, screenSize, createAward} = import_context.default.moduleContexts.game.state || ({});
    let ListenerTypes;
    (ListenerTypes2 => {
      ListenerTypes2["InputPlugin"] = "input_plugin";
      ListenerTypes2["KeyboardKeyType"] = "keyboard_key";
    })(ListenerTypes || (ListenerTypes = {}));
    const ListnerTypes = Object.values(ListenerTypes);
    let ObjectTypes;
    (ObjectTypes2 => {
      ObjectTypes2["ImageType"] = "image";
      ObjectTypes2["TextType"] = "text";
      ObjectTypes2["RectType"] = "rect";
      ObjectTypes2["EllipseType"] = "ellipse";
      ObjectTypes2["ContainerType"] = "container";
      ObjectTypes2["AwardType"] = "award";
    })(ObjectTypes || (ObjectTypes = {}));
    const ObjTypes = Object.values(ObjectTypes);
    const nullFn = () => {};
    function get_obj(obj) {
      return obj.object;
    }
    function get_game_obj(obj) {
      return obj.object;
    }
    function get_input_obj(obj) {
      return obj.object;
    }
    function get_container(obj) {
      return obj.object;
    }
    function is_type(obj, type) {
      return obj !== void 0 && obj.type === type && obj.object !== void 0;
    }
    function is_any_type(obj, types) {
      for (let i = 0; i < types.length; ++i) {
        if (is_type(obj, types[i])) return true;
      }
      return false;
    }
    function set_type(object, type) {
      return {
        type,
        object
      };
    }
    function throw_error(message) {
      throw console.error(`${arguments.callee.caller.name}: ${message}`);
    }
    function array_test(x) {
      if (Array.isArray === void 0) {
        return x instanceof Array;
      }
      return Array.isArray(x);
    }
    function pair(x, xs) {
      return [x, xs];
    }
    function is_pair(x) {
      return array_test(x) && x.length === 2;
    }
    function head(xs) {
      if (is_pair(xs)) {
        return xs[0];
      }
      throw new Error(`head(xs) expects a pair as argument xs, but encountered ${xs}`);
    }
    function tail(xs) {
      if (is_pair(xs)) {
        return xs[1];
      }
      throw new Error(`tail(xs) expects a pair as argument xs, but encountered ${xs}`);
    }
    function is_null(xs) {
      return xs === null;
    }
    function map(f, xs) {
      return is_null(xs) ? null : pair(f(head(xs)), map(f, tail(xs)));
    }
    function prepend_remote_url2(asset_key) {
      return remotePath(asset_key);
    }
    function create_config2(lst) {
      const config = {};
      map(xs => {
        if (!is_pair(xs)) {
          throw_error("xs is not pair!");
        }
        config[head(xs)] = tail(xs);
      }, lst);
      return config;
    }
    function create_text_config2(font_family = "Courier", font_size = "16px", color = "#fff", stroke = "#fff", stroke_thickness = 0, align = "left") {
      return {
        fontFamily: font_family,
        fontSize: font_size,
        color,
        stroke,
        strokeThickness: stroke_thickness,
        align
      };
    }
    function create_interactive_config2(draggable = false, use_hand_cursor = false, pixel_perfect = false, alpha_tolerance = 1) {
      return {
        draggable,
        useHandCursor: use_hand_cursor,
        pixelPerfect: pixel_perfect,
        alphaTolerance: alpha_tolerance
      };
    }
    function create_sound_config2(mute = false, volume = 1, rate = 1, detune = 0, seek = 0, loop = false, delay = 0) {
      return {
        mute,
        volume,
        rate,
        detune,
        seek,
        loop,
        delay
      };
    }
    function create_tween_config2(target_prop = "x", target_value = 0, delay = 0, duration = 1e3, ease = "Power0", on_complete = nullFn, yoyo = false, loop = 0, loop_delay = 0, on_loop = nullFn) {
      return {
        [target_prop]: target_value,
        delay,
        duration,
        ease,
        onComplete: on_complete,
        yoyo,
        loop,
        loopDelay: loop_delay,
        onLoop: on_loop
      };
    }
    function create_anim_config2(anims_key, anim_frames, frame_rate = 24, duration = null, repeat = -1, yoyo = false, show_on_start = true, hide_on_complete = false) {
      return {
        key: anims_key,
        frames: anim_frames,
        frameRate: frame_rate,
        duration,
        repeat,
        yoyo,
        showOnStart: show_on_start,
        hideOnComplete: hide_on_complete
      };
    }
    function create_anim_frame_config2(key, duration = 0, visible = true) {
      return {
        key,
        duration,
        visible
      };
    }
    function create_anim_spritesheet_frame_configs2(key) {
      if (preloadSpritesheetMap.get(key)) {
        const configArr = scene.anims.generateFrameNumbers(key, {});
        return configArr;
      }
      throw_error(`${key} is not associated with any spritesheet`);
    }
    function create_spritesheet_config2(frame_width, frame_height, start_frame = 0, margin = 0, spacing = 0) {
      return {
        frameWidth: frame_width,
        frameHeight: frame_height,
        startFrame: start_frame,
        margin,
        spacing
      };
    }
    function get_screen_width2() {
      return screenSize.x;
    }
    function get_screen_height2() {
      return screenSize.y;
    }
    function get_screen_display_width2() {
      return scene.scale.displaySize.width;
    }
    function get_screen_display_height2() {
      return scene.scale.displaySize.height;
    }
    function load_image2(key, url) {
      preloadImageMap.set(key, url);
    }
    function load_sound2(key, url) {
      preloadSoundMap.set(key, url);
    }
    function load_spritesheet2(key, url, spritesheet_config) {
      preloadSpritesheetMap.set(key, [url, spritesheet_config]);
    }
    function add2(obj) {
      if (is_any_type(obj, ObjTypes)) {
        scene.add.existing(get_game_obj(obj));
        return obj;
      }
      throw_error(`${obj} is not of type ${ObjTypes}`);
    }
    function play_sound2(key, config = {}) {
      if (preloadSoundMap.get(key)) {
        scene.sound.play(key, config);
      } else {
        throw_error(`${key} is not associated with any sound`);
      }
    }
    function create_anim2(anim_config) {
      const anims = scene.anims.create(anim_config);
      return typeof anims !== "boolean";
    }
    function play_anim_on_image2(image, anims_key) {
      if (is_type(image, "image")) {
        get_obj(image).play(anims_key);
        return image;
      }
      throw_error(`${image} is not of type ${"image"}`);
    }
    function create_image2(x, y, asset_key) {
      if (preloadImageMap.get(asset_key) || preloadSpritesheetMap.get(asset_key)) {
        const image = new Phaser.GameObjects.Sprite(scene, x, y, asset_key);
        return set_type(image, "image");
      }
      throw_error(`${asset_key} is not associated with any image`);
    }
    function create_award2(x, y, award_key) {
      return set_type(createAward(x, y, award_key), "award");
    }
    function create_text2(x, y, text, config = {}) {
      const txt = new Phaser.GameObjects.Text(scene, x, y, text, config);
      return set_type(txt, "text");
    }
    function create_rect2(x, y, width, height, fill = 0, alpha = 1) {
      const rect = new Phaser.GameObjects.Rectangle(scene, x, y, width, height, fill, alpha);
      return set_type(rect, "rect");
    }
    function create_ellipse2(x, y, width, height, fill = 0, alpha = 1) {
      const ellipse = new Phaser.GameObjects.Ellipse(scene, x, y, width, height, fill, alpha);
      return set_type(ellipse, "ellipse");
    }
    function create_container2(x, y) {
      const cont = new Phaser.GameObjects.Container(scene, x, y);
      return set_type(cont, "container");
    }
    function add_to_container2(container, obj) {
      if (is_type(container, "container") && is_any_type(obj, ObjTypes)) {
        get_container(container).add(get_game_obj(obj));
        return container;
      }
      throw_error(`${obj} is not of type ${ObjTypes} or ${container} is not of type ${"container"}`);
    }
    function destroy_obj2(obj) {
      if (is_any_type(obj, ObjTypes)) {
        get_game_obj(obj).destroy();
      } else {
        throw_error(`${obj} is not of type ${ObjTypes}`);
      }
    }
    function set_display_size2(obj, x, y) {
      if (is_any_type(obj, ObjTypes)) {
        get_game_obj(obj).setDisplaySize(x, y);
        return obj;
      }
      throw_error(`${obj} is not of type ${ObjTypes}`);
    }
    function set_alpha2(obj, alpha) {
      if (is_any_type(obj, ObjTypes)) {
        get_game_obj(obj).setAlpha(alpha);
        return obj;
      }
      throw_error(`${obj} is not of type ${ObjTypes}`);
    }
    function set_interactive2(obj, config = {}) {
      if (is_any_type(obj, ObjTypes)) {
        get_game_obj(obj).setInteractive(config);
        return obj;
      }
      throw_error(`${obj} is not of type ${ObjTypes}`);
    }
    function set_origin2(obj, x, y) {
      if (is_any_type(obj, ObjTypes)) {
        get_game_obj(obj).setOrigin(x, y);
        return obj;
      }
      throw_error(`${obj} is not of type ${ObjTypes}`);
    }
    function set_position2(obj, x, y) {
      if (obj && is_any_type(obj, ObjTypes)) {
        get_game_obj(obj).setPosition(x, y);
        return obj;
      }
      throw_error(`${obj} is not of type ${ObjTypes}`);
    }
    function set_scale2(obj, x, y) {
      if (is_any_type(obj, ObjTypes)) {
        get_game_obj(obj).setScale(x, y);
        return obj;
      }
      throw_error(`${obj} is not of type ${ObjTypes}`);
    }
    function set_rotation2(obj, rad) {
      if (is_any_type(obj, ObjTypes)) {
        get_game_obj(obj).setRotation(rad);
        return obj;
      }
      throw_error(`${obj} is not of type ${ObjTypes}`);
    }
    function set_flip2(obj, x, y) {
      const GameElementType = ["image", "text"];
      if (is_any_type(obj, GameElementType)) {
        get_obj(obj).setFlip(x, y);
        return obj;
      }
      throw_error(`${obj} is not of type ${GameElementType}`);
    }
    function add_tween2(_0) {
      return __async(this, arguments, function* (obj, config = {}) {
        if (is_any_type(obj, ObjTypes)) {
          scene.tweens.add(__spreadValues({
            targets: get_game_obj(obj)
          }, config));
          return obj;
        }
        throw_error(`${obj} is not of type ${ObjTypes}`);
      });
    }
    function add_listener2(obj, event, callback) {
      if (is_any_type(obj, ObjTypes)) {
        const listener = get_game_obj(obj).addListener(event, callback);
        return set_type(listener, "input_plugin");
      }
      throw_error(`${obj} is not of type ${ObjTypes}`);
    }
    function add_keyboard_listener2(key, event, callback) {
      const keyObj = scene.input.keyboard.addKey(key);
      const keyboardListener = keyObj.addListener(event, callback);
      return set_type(keyboardListener, "keyboard_key");
    }
    function remove_listener2(listener) {
      if (is_any_type(listener, ListnerTypes)) {
        get_input_obj(listener).removeAllListeners();
        return true;
      }
      return false;
    }
    const functions = {
      add: add2,
      add_listener: add_listener2,
      add_keyboard_listener: add_keyboard_listener2,
      add_to_container: add_to_container2,
      add_tween: add_tween2,
      create_anim: create_anim2,
      create_anim_config: create_anim_config2,
      create_anim_frame_config: create_anim_frame_config2,
      create_anim_spritesheet_frame_configs: create_anim_spritesheet_frame_configs2,
      create_award: create_award2,
      create_config: create_config2,
      create_container: create_container2,
      create_ellipse: create_ellipse2,
      create_image: create_image2,
      create_interactive_config: create_interactive_config2,
      create_rect: create_rect2,
      create_text: create_text2,
      create_text_config: create_text_config2,
      create_tween_config: create_tween_config2,
      create_sound_config: create_sound_config2,
      create_spritesheet_config: create_spritesheet_config2,
      destroy_obj: destroy_obj2,
      get_screen_width: get_screen_width2,
      get_screen_height: get_screen_height2,
      get_screen_display_width: get_screen_display_width2,
      get_screen_display_height: get_screen_display_height2,
      load_image: load_image2,
      load_sound: load_sound2,
      load_spritesheet: load_spritesheet2,
      play_anim_on_image: play_anim_on_image2,
      play_sound: play_sound2,
      prepend_remote_url: prepend_remote_url2,
      remove_listener: remove_listener2,
      set_alpha: set_alpha2,
      set_display_size: set_display_size2,
      set_flip: set_flip2,
      set_interactive: set_interactive2,
      set_origin: set_origin2,
      set_position: set_position2,
      set_rotation: set_rotation2,
      set_scale: set_scale2
    };
    const finalFunctions = {};
    Object.entries(functions).forEach(([key, fn]) => {
      finalFunctions[key] = !scene ? nullFn : fn;
      finalFunctions[key].minArgsNeeded = fn.length;
    });
    return finalFunctions;
  }
  var {add, add_listener, add_keyboard_listener, add_to_container, add_tween, create_anim, create_anim_config, create_anim_frame_config, create_anim_spritesheet_frame_configs, create_award, create_config, create_container, create_ellipse, create_image, create_interactive_config, create_rect, create_text, create_text_config, create_tween_config, create_sound_config, create_spritesheet_config, destroy_obj, get_screen_width, get_screen_height, get_screen_display_width, get_screen_display_height, load_image, load_sound, load_spritesheet, play_anim_on_image, play_sound, prepend_remote_url, remove_listener, set_alpha, set_display_size, set_flip, set_interactive, set_origin, set_position, set_rotation, set_scale} = gameFuncs();
  return __toCommonJS(game_exports);
}