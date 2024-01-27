require => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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
  var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
    value: true
  }), mod);
  var sound_matrix_exports = {};
  __export(sound_matrix_exports, {
    ToneMatrix: () => ToneMatrix,
    clear_all_timeout: () => clear_all_timeout,
    clear_matrix: () => clear_matrix,
    get_matrix: () => get_matrix,
    set_timeout: () => set_timeout
  });
  function pair(x, xs) {
    return [x, xs];
  }
  function vector_to_list(vector) {
    let result = null;
    for (let i = vector.length - 1; i >= 0; i = i - 1) {
      result = pair(vector[i], result);
    }
    return result;
  }
  var ToneMatrix = {
    initialise_matrix,
    clear_matrix,
    randomise_matrix,
    bindMatrixButtons
  };
  var $tone_matrix;
  var color_on = "#cccccc";
  var color_off = "#333333";
  var square_side_length = 18;
  var distance_between_squares = 6;
  var margin_length = 20;
  var matrix;
  var timeout_objects = [];
  function x_y_to_row_column(x, y) {
    const row = Math.floor((y - margin_length) / (square_side_length + distance_between_squares));
    const column = Math.floor((x - margin_length) / (square_side_length + distance_between_squares));
    return [row, column];
  }
  function row_to_y(row) {
    return margin_length + row * (square_side_length + distance_between_squares);
  }
  function column_to_x(column) {
    return margin_length + column * (square_side_length + distance_between_squares);
  }
  function set_color(row, column, color) {
    if (row < 0 || row > 15 || column < 0 || column > 15) {
      return;
    }
    const ctx = $tone_matrix.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(column_to_x(column), row_to_y(row), square_side_length, square_side_length);
  }
  function initialise_matrix($container) {
    if (!$tone_matrix) {
      $tone_matrix = document.createElement("canvas");
      $tone_matrix.width = 420;
      $tone_matrix.height = 420;
      matrix = new Array(16);
      const ctx = $tone_matrix.getContext("2d");
      for (let i = 15; i >= 0; i--) {
        matrix[i] = new Array(16);
        for (let j = 15; j >= 0; j--) {
          set_color(i, j, color_off);
          matrix[i][j] = false;
        }
      }
      bind_events_to_rect($tone_matrix);
    }
    $tone_matrix.hidden = false;
    $container.appendChild($tone_matrix);
  }
  ToneMatrix.initialise_matrix = initialise_matrix;
  function bind_events_to_rect(c) {
    c.addEventListener("click", event => {
      const rect = c.getBoundingClientRect();
      const offset_top = rect.top + document.documentElement.scrollTop;
      const offset_left = rect.left + document.documentElement.scrollLeft;
      const x = event.pageX - offset_left;
      const y = event.pageY - offset_top;
      const row_column = x_y_to_row_column(x, y);
      const row = row_column[0];
      const column = row_column[1];
      if (row < 0 || row > 15 || column < 0 || column > 15) {
        return;
      }
      if (matrix[row][column] === void 0 || !matrix[row][column]) {
        matrix[row][column] = true;
        set_color(row, column, color_on);
      } else {
        matrix[row][column] = false;
        set_color(row, column, color_off);
      }
    }, false);
  }
  function randomise_matrix() {
    const ctx = $tone_matrix.getContext("2d");
    let on;
    clear_matrix();
    for (let i = 15; i >= 0; i--) {
      for (let j = 15; j >= 0; j--) {
        on = Math.random() > 0.9;
        if (on) {
          set_color(i, j, color_on);
          matrix[i][j] = true;
        } else {
          set_color(i, j, color_off);
          matrix[i][j] = false;
        }
      }
    }
  }
  ToneMatrix.randomise_matrix = randomise_matrix;
  function bindMatrixButtons() {
    const clear = document.getElementById("clear-matrix");
    if (clear) {
      clear.addEventListener("click", () => {
        clear_matrix();
        const play = document.getElementById("play-matrix");
        if (play) {
          play.setAttribute("value", "Play");
        }
      });
    }
  }
  ToneMatrix.bindMatrixButtons = bindMatrixButtons;
  function get_matrix() {
    if (!matrix) {
      throw new Error("Please activate the tone matrix first by clicking on the tab!");
    }
    const matrix_list = matrix.slice(0);
    const result = [];
    for (let i = 0; i <= 15; i++) {
      result[i] = vector_to_list(matrix_list[15 - i]);
    }
    return vector_to_list(result);
  }
  function clear_matrix() {
    matrix = new Array(16);
    const ctx = $tone_matrix.getContext("2d");
    for (let i = 15; i >= 0; i--) {
      matrix[i] = new Array(16);
      for (let j = 15; j >= 0; j--) {
        set_color(i, j, color_off);
        matrix[i][j] = false;
      }
    }
  }
  ToneMatrix.clear_matrix = clear_matrix;
  var set_time_out_renamed = window.setTimeout;
  function set_timeout(f, t) {
    if (typeof f === "function" && typeof t === "number") {
      const timeoutObj = set_time_out_renamed(f, t);
      timeout_objects.push(timeoutObj);
    } else {
      throw new Error("set_timeout(f, t) expects a function and a number respectively.");
    }
  }
  function clear_all_timeout() {
    for (let i = timeout_objects.length - 1; i >= 0; i--) {
      clearTimeout(timeout_objects[i]);
    }
    timeout_objects = [];
  }
  return __toCommonJS(sound_matrix_exports);
}