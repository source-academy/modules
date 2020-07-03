(_params) => {
  const Phaser = _params.phaser;
  const scene = _params.scene;

  const type_key = "type";
  const id_key = "id";

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
  //        HELPER         //
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

  ///////////////////////////
  //        PRELOAD        //
  ///////////////////////////

  function load_image(key, url) {
    scene.load.image(key, url);
  }

  ///////////////////////////
  //         CREATE        //
  ///////////////////////////

  function add_to_scene(obj) {
    if (obj && is_any_type(obj, obj_types)) {
      scene.add(obj);
    } else {
      throw console.error(`${obj} is not of type ${obj_types}`);
    }
  }

  ///////////////////////////
  //         IMAGE         //
  ///////////////////////////

  function create_image(x, y, asset_key) {
    return new Phaser.GameObjects.Sprite(scene, x, y, asset_key);
  }

  ///////////////////////////
  //         TEXT          //
  ///////////////////////////

  function create_text(x, y, text, style) {
    return new Phaser.GameObjects.Text(scene, x, y, text, style);
  }

  ///////////////////////////
  //       RECTANGLE       //
  ///////////////////////////

  function create_rect(x, y, width, height, fill = 0, alpha = 1) {
    return new Phaser.GameObjects.Rectangle(
      scene,
      x,
      y,
      width,
      height,
      fill,
      alpha
    );
  }

  ///////////////////////////
  //        ELLIPSE        //
  ///////////////////////////

  function create_ellipse(x, y, width, height, fill = 0, alpha = 1) {
    return new Phaser.GameObjects.Ellipse(
      scene,
      x,
      y,
      width,
      height,
      fill,
      alpha
    );
  }

  ///////////////////////////
  //       CONTAINER       //
  ///////////////////////////

  function create_container(x, y) {
    return new Phaser.GameObjects.Container(scene, x, y);
  }

  function add_to_container(container, obj) {
    const correct_types =
      is_type(container, container_type) && is_any_types(obj, obj_types);
    if (container && obj && correct_types) {
      container.add(obj);
    } else {
      throw console.error(
        `${obj} is not of type ${obj_types} or ${container} is not of type ${container_type}`
      );
    }
  }

  ///////////////////////////
  //         OBJECT        //
  ///////////////////////////

  function set_display_size(obj, x, y) {
    if (obj && is_any_type(obj, obj_types)) {
      obj.setDisplaySize(x, y);
    } else {
      throw console.error(`${obj} is not of type ${obj_types}`);
    }
  }

  function set_alpha(obj, alpha) {
    if (obj && is_any_type(obj, obj_types)) {
      obj.setAlpha(alpha);
    } else {
      throw console.error(`${obj} is not of type ${obj_types}`);
    }
  }

  function set_interactive(obj, shape) {
    if (obj && is_any_type(obj, obj_types)) {
      obj.setInteractive(shape);
    } else {
      throw console.error(`${obj} is not of type ${obj_types}`);
    }
  }

  function set_origin(obj, x, y) {
    if (obj && is_any_type(obj, obj_types)) {
      obj.setOrigin(x, y);
    } else {
      throw console.error(`${obj} is not of type ${obj_types}`);
    }
  }

  function set_scale(obj, x, y) {
    if (obj && is_any_type(obj, obj_types)) {
      obj.setScale(x, y);
    } else {
      throw console.error(`${obj} is not of type ${obj_types}`);
    }
  }

  function set_rotation(obj, rad) {
    if (obj && is_any_type(obj, obj_types)) {
      obj.setRotation(rad);
    } else {
      throw console.error(`${obj} is not of type ${obj_types}`);
    }
  }

  function set_flip(obj, x, y) {
    if (obj && is_any_type(obj, obj_types)) {
      obj.setFlip(x, y);
    } else {
      throw console.error(`${obj} is not of type ${obj_types}`);
    }
  }
  
  function add_listener(obj, event, callback) {
    if (obj && is_any_type(obj, obj_types)) {
      obj.addListener(event, callback);
    } else {
      throw console.error(`${obj} is not of type ${obj_types}`);
    }
  }

  function add_tween(obj, tween_prop) {
    if (obj && is_any_type(obj, obj_types)) {
      scene.tweens.add({
        targets: obj,
        ...tween_prop,
      });
    } else {
      throw console.error(`${obj} is not of type ${obj_types}`);
    }
  }

  return {
    load_image: load_image,
    add: add_to_scene,
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
};
