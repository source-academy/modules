(function () {
  const image_type = "image";
  const text_type = "text";
  const container_type = "container";
  const obj_type = [image_type, text_type, container_type];

  ///////////////////////////
  //        HELPER         //
  ///////////////////////////

  function is_type(obj, type) {
    return obj[0] === type;
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
    return function (scene) {
      scene.load.image(key, url);
    };
  }

  ///////////////////////////
  //         CREATE        //
  ///////////////////////////

  function add(obj) {
    return function (scene) {
      if (is_any_type(obj, obj_type)) {
        scene.add(obj);
      } else {
        // TODO: Handle error
      }
    };
  }

  ///////////////////////////
  //         IMAGE         //
  ///////////////////////////

  function create_image(x, y, asset_key) {
    return function (scene) {
      return [
        image_type,
        new Phaser.GameObjects.Sprite(scene, x, y, asset_key),
      ];
    };
  }

  ///////////////////////////
  //         TEXT          //
  ///////////////////////////

  function create_text(x, y, text, text_style) {
    return function (scene) {
      return [
        text_type,
        new Phaser.GameObjects.Text(scene, x, y, text, text_style),
      ];
    };
  }

  ///////////////////////////
  //         OBJECT        //
  ///////////////////////////

  function set_display_size(obj, x, y) {
    return function (scene) {
      const actual_obj = obj(scene);
      if (is_any_type(actual_obj, obj_type)) {
        return actual_obj.setDisplaySize(x, y);
      } else {
        // TODO: Handle error
      }
    };
  }

  function set_alpha(obj, alpha) {
    return function (scene) {
      const actual_obj = obj(scene);
      if (is_any_type(actual_obj, obj_type)) {
        return actual_obj.setAlpha(alpha);
      } else {
        // TODO: Handle error
      }
    };
  }

  function set_interactive(obj, shape) {
    return function (scene) {
      const actual_obj = obj(scene);
      if (is_any_type(actual_obj, obj_type)) {
        return actual_obj.setInteractive(shape);
      } else {
        // TODO: Handle error
      }
    };
  }

  return {
    load_image: load_image,
    add: add,
    create_image: create_image,
    create_text: create_text,
    set_display_size: set_display_size,
    set_alpha: set_alpha,
    set_interactive: set_interactive,
  };
})();
