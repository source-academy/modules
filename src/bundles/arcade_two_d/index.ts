/**
 * Bundle for Source Academy Arcade2D module.
 *
 * Arcade2D allows users to create their own 2D games with Source §3 and above variants.
 * This module will simplify the features available in Phaser 3 to make it more accessible
 * to CS1101S students. Some examples have been included below.
 *
 * ### WASD input example
 * ```
import { create_rectangle, query_position, update_position, update_loop, build_game, input_key_down } from "arcade_two_d";

// Create GameObjects outside update_loop(...)
const player = update_position(create_rectangle(100, 100), [300, 300]);
const movement_dist = 10;

function add_vectors(to, from) {
    to[0] = to[0] + from[0];
    to[1] = to[1] + from[1];
}

update_loop(game_state => {
    const new_position = query_position(player);

    if (input_key_down("w")) {
        add_vectors(new_position, [0, -1 * movement_dist]);
    }
    if (input_key_down("a")) {
        add_vectors(new_position, [-1 * movement_dist, 0]);
    }
    if (input_key_down("s")) {
        add_vectors(new_position, [0, movement_dist]);
    }
    if (input_key_down("d")) {
        add_vectors(new_position, [movement_dist, 0]);
    }

    // Update GameObjects within update_loop(...)
    update_position(player, new_position);
});
build_game();
 * ```
 *
 * ### Draggable objects example
 * ```
import { create_rectangle, query_position, update_position, update_color, pointer_over_gameobject, input_left_mouse_down, update_to_top, query_pointer_position, update_loop, build_game } from "arcade_two_d";

const gameobjects = [];
for (let i = 0; i < 6; i = i + 1) {
    gameobjects[i] = update_color(update_position(create_rectangle(50, 50),
        [50 + i * 100, 300]),
        [256 * math_random(), 256 * math_random(), 256 * math_random(), 255]);
}

// Function to drag
let dragging = -1;
function drag_gameobject(i) {
    const gameobject = gameobjects[i];
    if (dragging === -1 && input_left_mouse_down() && pointer_over_gameobject(gameobject)) {
        dragging = i;
    }
    if (dragging === i) {
        update_to_top(update_position(gameobject , query_pointer_position()));
    }
    if (!input_left_mouse_down()) {
        dragging = -1;
    }
}

update_loop(game_state => {
    for (let i = 0; i < 6; i = i + 1) {
        drag_gameobject(i);
    }
});
build_game();
 * ```
 *
 * ### Grid coloring example
 * ```
import { create_rectangle, update_position, update_color, get_loop_count, set_scale, update_loop, build_game } from "arcade_two_d";

// It can handle 10000 GameObjects
const gameobjects = [];
for (let i = 0; i < 100; i = i + 1) {
   gameobjects[i] = [];
   for (let j = 0; j < 100; j = j + 1) {
       gameobjects[i][j] = update_position(create_rectangle(1, 1), [i, j]);
   }
}

update_loop(game_state => {
   const k = get_loop_count();
   for (let i = 0; i < 100; i = i + 1) {
       for (let j = 0; j < 100; j = j + 1) {
           update_color(gameobjects[i][j],
       [k * i * j * 7, k * j * i * 2, i * j * k * 3, i * j * k * 5]);
       }
   }
});
set_scale(6);
build_game();
 * ```
 *
 * @module arcade_two_d
 * @author Titus Chew Xuan Jun
 * @author Xenos Fiorenzo Anong
 */

export {
  create_circle,
  create_rectangle,
  create_triangle,
  create_sprite,
  create_text,
  query_color,
  query_flip,
  query_id,
  query_pointer_position,
  query_position,
  query_rotation,
  query_scale,
  query_text,
  update_color,
  update_flip,
  update_position,
  update_rotation,
  update_scale,
  update_text,
  update_to_top,
  set_fps,
  set_dimensions,
  set_scale,
  get_game_time,
  get_loop_count,
  enable_debug,
  debug_log,
  input_key_down,
  input_left_mouse_down,
  input_right_mouse_down,
  pointer_over_gameobject,
  gameobjects_overlap,
  update_loop,
  build_game,
  create_audio,
  loop_audio,
  stop_audio,
  play_audio,
} from './functions';
