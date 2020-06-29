const { Game } = require("phaser");

(function () {
  const type_key = "type";
  const id_key = "id";
  const image_type = "image";
  const text_type = "text";
  const container_type = "container";
  const obj_types = [image_type, text_type, container_type];

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
    const cont = create_container(0, 0)(scene, id);
    if (cont) return cont;

    const img = create_image(0, 0, "")(scene, id);
    if (img) return img;

    const txt = create_text(0, 0, "", {})(scene, id);
    if (txt) return txt;

    return undefined;
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
    // Set up local mapping
    if (typeof create_image.image_map === "undefined") {
      create_image.image_map = {};
    }

    return function (scene, id = -1) {
      if (id === -1) {
        const image = new Phaser.GameObjects.Sprite(scene, x, y, asset_key);
        const new_id = get_id();

        // Set image settings
        image.setDataEnabled();
        image.data.set(type_key, image_type);
        image.data.set(id_key, new_id);

        // Insert into the map
        create_image.image_map[new_id] = image;
        return new_id;
      } else {
        return create_image.image_map[id];
      }
    };
  }

  ///////////////////////////
  //         TEXT          //
  ///////////////////////////

  function create_text(x, y, text, style) {
    // Set up local mapping
    if (typeof create_text.text_map === "undefined") {
      create_text.text_map = {};
    }

    return function (scene, id = -1) {
      if (id === -1) {
        const text_obj = new Phaser.GameObjects.Text(scene, x, y, text, style);
        const new_id = get_id();

        // Set text settings
        text_obj.setDataEnabled();
        text_obj.data.set(type_key, text_type);
        text_obj.data.set(id_key, new_id);

        // Insert into the map
        create_text.text_map[new_id] = text_obj;
        return new_id;
      } else {
        return create_image.image_map[id];
      }
    };
  }

  ///////////////////////////
  //       CONTAINER       //
  ///////////////////////////

  function create_container(x, y) {
    // Set up local mapping
    if (typeof create_container.container_map === "undefined") {
      create_container.container_map = {};
    }

    return function (scene, id = -1) {
      if (id === -1) {
        const container = new Phaser.GameObjects.Container(scene, x, y);
        const new_id = get_id();

        // Set container settings
        container.setDataEnabled();
        container.data.set(type_key, container_type);
        container.data.set(id_key, new_id);

        // Insert into the map
        create_container.container_map[new_id] = container;
        return new_id;
      } else {
        return create_container.container_map[id];
      }
    };
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

  function add_tween(obj, tween_prop) {
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
