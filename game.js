(_params) => {
  const Phaser = _params.phaser;
  const scene = _params.scene;
  const preload_image_map = _params.preloadImageMap;
  const preload_sound_map = _params.preloadSoundMap;
  const remote_path = _params.remotePath;

  const type_key = "type";

  const image_type = "image";
  const text_type = "text";
  const rect_type = "rect";
  const ellipse_type = "ellipse";
  const container_type = "container";
  const obj_types = [
    image_type,
    text_type,
    rect_type,
    ellipse_type,
    container_type,
  ];

  const null_str = "";
  const null_fn = () => {};

  ///////////////////////////
  //        PRIVATE        //
  ///////////////////////////

  function is_type(obj, type) {
    return obj.data.get(type_key) === type;
  }

  function is_any_type(obj, types) {
    for (let i = 0; i < types.length; i++) {
      if (is_type(obj, types[i])) return true;
    }
    return false;
  }

  function set_type(obj, type) {
    obj.setDataEnabled();
    obj.data.set(type_key, type);
    return obj;
  }

  function throw_error(message) {
    throw console.error(`${arguments.callee.caller.name}: ${message}`);
  }

  ///////////////////////////
  //        HELPER         //
  ///////////////////////////

  function prepend_remote_url(asset_key) {
    return remote_path + asset_key;
  }

  function get_screen_width() {
    return 1920;
  }

  function get_screen_height() {
    return 1080;
  }

  function get_screen_display_width() {
    return scene.scale.displaySize.width;
  }

  function get_screen_display_height() {
    return scene.scale.displaySize.height;
  }

  ///////////////////////////
  //          LOAD         //
  ///////////////////////////

  function load_image(key, url) {
    preload_image_map.set(key, url);
  }

  function load_sound(key, url) {
    preload_sound_map.set(key, url);
  }

  ///////////////////////////
  //          ADD          //
  ///////////////////////////

  function add(obj) {
    if (obj && is_any_type(obj, obj_types)) {
      scene.add.existing(obj);
    } else {
      throw_error(`${obj} is not of type ${obj_types}`);
    }
  }

  ///////////////////////////
  //         SOUND         //
  ///////////////////////////

  function play_sound(key, config = {}) {
    scene.sound.play(key, config);
  }

  ///////////////////////////
  //         IMAGE         //
  ///////////////////////////

  function create_image(x, y, asset_key) {
    const image = new Phaser.GameObjects.Sprite(scene, x, y, asset_key);
    return set_type(image, image_type);
  }

  ///////////////////////////
  //         TEXT          //
  ///////////////////////////

  function create_text(x, y, text, style = {}) {
    const txt = new Phaser.GameObjects.Text(scene, x, y, text, style);
    return set_type(txt, text_type);
  }

  ///////////////////////////
  //       RECTANGLE       //
  ///////////////////////////

  function create_rect(x, y, width, height, fill = 0, alpha = 1) {
    const rect = new Phaser.GameObjects.Rectangle(
      scene,
      x,
      y,
      width,
      height,
      fill,
      alpha
    );
    return set_type(rect, rect_type);
  }

  ///////////////////////////
  //        ELLIPSE        //
  ///////////////////////////

  function create_ellipse(x, y, width, height, fill = 0, alpha = 1) {
    const ellipse = new Phaser.GameObjects.Ellipse(
      scene,
      x,
      y,
      width,
      height,
      fill,
      alpha
    );
    return set_type(ellipse, ellipse_type);
  }

  ///////////////////////////
  //       CONTAINER       //
  ///////////////////////////

  function create_container(x, y) {
    const cont = new Phaser.GameObjects.Container(scene, x, y);
    return set_type(cont, container_type);
  }

  function add_to_container(container, obj) {
    const correct_types =
      is_type(container, container_type) && is_any_types(obj, obj_types);
    if (container && obj && correct_types) {
      return container.add(obj);
    } else {
      throw_error(
        `${obj} is not of type ${obj_types} or ${container} is not of type ${container_type}`
      );
    }
  }

  ///////////////////////////
  //         OBJECT        //
  ///////////////////////////

  function set_display_size(obj, x, y) {
    if (obj && is_any_type(obj, obj_types)) {
      return obj.setDisplaySize(x, y);
    } else {
      throw_error(`${obj} is not of type ${obj_types}`);
    }
  }

  function set_alpha(obj, alpha) {
    if (obj && is_any_type(obj, obj_types)) {
      return obj.setAlpha(alpha);
    } else {
      throw_error(`${obj} is not of type ${obj_types}`);
    }
  }

  function set_interactive(obj, shape = {}) {
    if (obj && is_any_type(obj, obj_types)) {
      return obj.setInteractive(shape);
    } else {
      throw_error(`${obj} is not of type ${obj_types}`);
    }
  }

  function set_origin(obj, x, y) {
    if (obj && is_any_type(obj, obj_types)) {
      return obj.setOrigin(x, y);
    } else {
      throw_error(`${obj} is not of type ${obj_types}`);
    }
  }

  function set_scale(obj, x, y) {
    if (obj && is_any_type(obj, obj_types)) {
      return obj.setScale(x, y);
    } else {
      throw_error(`${obj} is not of type ${obj_types}`);
    }
  }

  function set_rotation(obj, rad) {
    if (obj && is_any_type(obj, obj_types)) {
      return obj.setRotation(rad);
    } else {
      throw_error(`${obj} is not of type ${obj_types}`);
    }
  }

  function set_flip(obj, x, y) {
    if (obj && is_any_type(obj, obj_types)) {
      return obj.setFlip(x, y);
    } else {
      throw_error(`${obj} is not of type ${obj_types}`);
    }
  }

  function add_listener(obj, event, callback) {
    if (obj && is_any_type(obj, obj_types)) {
      return obj.addListener(event, callback);
    } else {
      throw_error(`${obj} is not of type ${obj_types}`);
    }
  }

  async function add_tween(obj, tween_prop = {}) {
    if (obj && is_any_type(obj, obj_types)) {
      return scene.tweens.add({
        targets: obj,
        ...tween_prop,
      });
    } else {
      throw_error(`${obj} is not of type ${obj_types}`);
    }
  }

  const functions = {
    prepend_remote_url: prepend_remote_url,
    get_screen_width: get_screen_width,
    get_screen_height: get_screen_height,
    get_screen_display_width: get_screen_display_width,
    get_screen_display_height: get_screen_display_height,
    load_image: load_image,
    load_sound: load_sound,
    add: add,
    play_sound: play_sound,
    create_image: create_image,
    create_text: create_text,
    create_rect: create_rect,
    create_ellipse: create_ellipse,
    create_container: create_container,
    add_to_container: add_to_container,
    set_display_size: set_display_size,
    set_alpha: set_alpha,
    set_interactive: set_interactive,
    set_origin: set_origin,
    set_scale: set_scale,
    set_rotation: set_rotation,
    set_flip: set_flip,
    add_listener: add_listener,
    add_tween: add_tween,
  };

  let final_functions = {};

  Object.entries(functions).map(([key, fn]) => {
    final_functions[key] = !Phaser || !scene ? null_fn : fn;
  });

  return final_functions;
}
