(function () {
  const type_key = "type";
  const id_key = "id";

  const image_type = "image";
  const text_type = "text";
  const rect_type = "rect";
  const ellipse_type = "ellipse";
  const container_type = "container";
  const obj_types = [image_type, text_type, rect_type, ellipse_type, container_type];

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

  function get_id() {
    if (typeof get_id.counter == "undefined") {
      get_id.counter = 0;
    }
    get_id.counter++;
    return get_id.counter;
  }

  function get_obj(scene, id) {
    return create_obj()(scene, id);
  }

  function create_obj(creator_fn = null_fn, type = null_str) {
    // Set up local mapping
    if (typeof create_obj.obj_map === "undefined") {
      create_obj.obj_map = {};
    }

    return function (scene, id = -1) {
      if (id === -1) {
        const obj = creator_fn(scene);
        const new_id = get_id();

        // Set obj settings
        obj.setDataEnabled();
        obj.data.set(type_key, type);
        obj.data.set(id_key, new_id);

        // Insert into the map
        create_obj.obj_map[new_id] = obj;
        return new_id;
      } else {
        return create_obj.obj_map[id];
      }
    };
  }

  ///////////////////////////
  //        PRELOAD        //
  ///////////////////////////

  function load_image(key, url) {
    return function (scene) {
      scene.load.image(key, url);
    };
  }

  ///////////////////////////
  //         CREATE        //
  ///////////////////////////

  function add_to_scene(obj_id) {
    return function (scene) {
      const actual_obj = get_obj(scene, obj_id);
      if (actual_obj && is_any_type(actual_obj, obj_types)) {
        scene.add(actual_obj);
      } else {
        throw console.error(`${obj_id} is not of type ${obj_types}`);
      }
    };
  }

  ///////////////////////////
  //         IMAGE         //
  ///////////////////////////

  function create_image(x, y, asset_key) {
    const image_creator = (scene) =>
      new Phaser.GameObjects.Sprite(scene, x, y, asset_key);
    return create_obj(image_creator, image_type);
  }

  ///////////////////////////
  //         TEXT          //
  ///////////////////////////

  function create_text(x, y, text, style) {
    const text_creator = (scene) =>
      new Phaser.GameObjects.Text(scene, x, y, text, style);
    return create_obj(text_creator, text_type);
  }

  ///////////////////////////
  //       RECTANGLE       //
  ///////////////////////////

  function create_rect(x, y, width, height, fill = 0, alpha = 1) {
    const rect_creator = (scene) =>
      new Phaser.GameObjects.Rectangle(scene, x, y, width, height, fill, alpha);
    return create_obj(rect_creator, rect_type);
  }

  ///////////////////////////
  //        ELLIPSE        //
  ///////////////////////////

  function create_ellipse(x, y, width, height, fill = 0, alpha = 1) {
    const ellipse_creator = (scene) =>
      new Phaser.GameObjects.Ellipse(scene, x, y, width, height, fill, alpha);
    return create_obj(ellipse_creator, ellipse_type);
  }

  ///////////////////////////
  //       CONTAINER       //
  ///////////////////////////

  function create_container(x, y) {
    const container_creator = (scene) =>
      new Phaser.GameObjects.Container(scene, x, y);
    return create_obj(container_creator, container_type);
  }

  function add_to_container(container_id, obj_id) {
    return function (scene) {
      const actual_cont = get_obj(scene, container_id);
      const actual_obj = get_obj(scene, obj_id);
      if (
        actual_cont &&
        actual_obj &&
        is_type(actual_cont, container_type) &&
        is_any_types(actual_obj, obj_types)
      ) {
        actual_cont.add(actual_obj);
      } else {
        throw console.error(
          `${obj_id} is not of type ${obj_types} or ${container_id} is not of type ${container_type}`
        );
      }
    };
  }

  ///////////////////////////
  //         OBJECT        //
  ///////////////////////////

  function set_display_size(obj_id, x, y) {
    return function (scene) {
      const actual_obj = get_obj(scene, obj_id);
      if (actual_obj && is_any_type(actual_obj, obj_types)) {
        actual_obj.setDisplaySize(x, y);
      } else {
        throw console.error(`${obj_id} is not of type ${obj_types}`);
      }
    };
  }

  function set_alpha(obj_id, alpha) {
    return function (scene) {
      const actual_obj = get_obj(scene, obj_id);
      if (actual_obj && is_any_type(actual_obj, obj_types)) {
        actual_obj.setAlpha(alpha);
      } else {
        throw console.error(`${obj_id} is not of type ${obj_types}`);
      }
    };
  }

  function set_interactive(obj_id, shape) {
    return function (scene) {
      const actual_obj = get_obj(scene, obj_id);
      if (actual_obj && is_any_type(actual_obj, obj_types)) {
        actual_obj.setInteractive(shape);
      } else {
        throw console.error(`${obj_id} is not of type ${obj_types}`);
      }
    };
  }

  function set_origin(obj_id, x, y) {
    return function (scene) {
      const actual_obj = get_obj(scene, obj_id);
      if (actual_obj && is_any_type(actual_obj, obj_types)) {
        actual_obj.setOrigin(x, y);
      } else {
        throw console.error(`${obj_id} is not of type ${obj_types}`);
      }
    };
  }

  function add_listener(obj_id, event, callback) {
    return function (scene) {
      const actual_obj = get_obj(scene, obj_id);
      if (actual_obj && is_any_type(actual_obj, obj_types)) {
        actual_obj.addListener(event, callback);
      } else {
        throw console.error(`${obj_id} is not of type ${obj_types}`);
      }
    };
  }

  function add_tween(obj_id, tween_prop) {
    return function (scene) {
      const actual_obj = get_obj(scene, obj_id);
      if (actual_obj && is_any_type(actual_obj, obj_types)) {
        scene.tweens.add({
          targets: actual_obj,
          ...tween_prop,
        });
      } else {
        throw console.error(`${obj_id} is not of type ${obj_types}`);
      }
    };
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
    add_listener: add_listener,
    add_tween: add_tween,
  };
})();
