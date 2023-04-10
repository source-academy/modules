/**
 * Bundle for Source Academy Arcade2D module.
 *
 * Arcade2D allows users to create their own 2D games with Source §3 and above variants.
 * This module will simplify the features available in Phaser 3 to make it more accessible
 * to CS1101S students. Some examples have been included below.
 *
 * ### WASD input example
 * ```
import { create_rectangle, query_position, update_position, update_loop, build_game, input_key_down } from "arcade_2d";

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
import { create_sprite, update_position, update_scale, pointer_over_gameobject, input_left_mouse_down, update_to_top, query_pointer_position, update_loop, build_game } from "arcade_2d";

// Using assets
const gameobjects = [
    update_position(create_sprite("objects/cmr/splendall.png"), [200, 400]),
    update_position(update_scale(create_sprite("avatars/beat/beat.happy.png"), [0.3, 0.3]), [300, 200]),
    update_position(update_scale(create_sprite("avatars/chieftain/chieftain.happy.png"), [0.2, 0.2]), [400, 300])];

// Simple dragging function
function drag_gameobject(gameobject) {
   if (input_left_mouse_down() && pointer_over_gameobject(gameobject)) {
       update_to_top(update_position(gameobject, query_pointer_position()));
   }
}

update_loop(game_state => {
   for (let i = 0; i < 3; i = i + 1) {
       drag_gameobject(gameobjects[i]);
   }
});
build_game();
 * ```
 *
 * ### Playing audio example
 * ```
import { input_key_down, create_audio, play_audio, update_loop, build_game } from "arcade_2d";

const audio = create_audio("https://labs.phaser.io/assets/audio/SoundEffects/key.wav", 1);
update_loop(game_state => {
    // Press space to play audio
    if (input_key_down(" ")) {
        play_audio(audio);
    }
});
build_game();
 * ```
 *
 * @module arcade_2d
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
