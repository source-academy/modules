/**
 * Arcade2D allows users to create their own 2D games with Source §3 and above variants.
 * This module will simplify the features available in Phaser 3 to make it more accessible
 * to CS1101S students. Some examples have been included below.
 *
 * How to use Arcade2D:
 * 1. Create gameobjects: create gameobjects using any of the create functions, such as `create_rectangle`.
 * 2. Create update function: call `update_loop` with your update function as an argument.
 * Your update function should take in an array as an argument, which you can use for maintaining
 * your game state. The logic of your game is contained within your update function.
 * 3. Build the game: call `build_game` as the last statement.
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
 * ### Grid colouring example
 *
 * ```
import { create_rectangle, update_position, update_color, get_loop_count, set_scale, update_loop, build_game } from "arcade_2d";

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
 * ### Snake game example
 * ```
import { create_rectangle, create_sprite, create_text, query_position, update_color, update_position, update_scale, update_text, update_to_top, set_fps, get_loop_count, enable_debug, debug_log, input_key_down, gameobjects_overlap, update_loop, build_game, create_audio, loop_audio, stop_audio, play_audio } from "arcade_2d";
// enable_debug(); // Uncomment this to see debug info

// Constants
let snake_length = 4;
const food_growth = 4;
set_fps(10);

const snake = [];
const size = 600;
const unit = 30;
const grid = size / unit;
const start_length = snake_length;

// Create Sprite Gameobjects
update_scale(create_sprite("https://labs.phaser.io/assets/games/germs/background.png"), [4, 4]); // Background
const food = create_sprite("https://labs.phaser.io/assets/sprites/tomato.png");
let eaten = true;

for (let i = 0; i < 1000; i = i + 1) {
    snake[i] = update_color(update_position(create_rectangle(unit, unit), [-unit / 2, -unit / 2]),
        [127 + 128 * math_sin(i / 20), 127 + 128 * math_sin(i / 50), 127 + 128 * math_sin(i / 30), 255]); // Store offscreen
}
const snake_head = update_color(update_position(create_rectangle(unit * 0.9, unit * 0.9), [-unit / 2, -unit / 2]), [0, 0, 0 ,0]); // Head

let move_dir = [unit, 0];

// Other functions
const add_vec = (v1, v2) => [v1[0] + v2[0], v1[1] + v2[1]];
const bound_vec = v => [(v[0] + size) % size, (v[1] + size) % size];
function input() {
    if (input_key_down("w") && move_dir[1] === 0) {
        move_dir = [0, -unit];
        play_audio(move);
    } else if (input_key_down("a") && move_dir[0] === 0) {
        move_dir = [-unit, 0];
        play_audio(move);
    } else if (input_key_down("s") && move_dir[1] === 0) {
        move_dir = [0, unit];
        play_audio(move);
    } else if (input_key_down("d") && move_dir[0] === 0) {
        move_dir = [unit, 0];
        play_audio(move);
    }
}
let alive = true;

// Create Text Gameobjects
const score = update_position(create_text("Score: "), [size - 60, 20]);
const game_text = update_color(update_scale(update_position(create_text(""), [size / 2, size / 2]), [2, 2]), [0, 0, 0, 255]);

// Audio
const eat = create_audio("https://labs.phaser.io/assets/audio/SoundEffects/key.wav", 1);
const lose = create_audio("https://labs.phaser.io/assets/audio/stacker/gamelost.m4a", 1);
const move = create_audio("https://labs.phaser.io/assets/audio/SoundEffects/alien_death1.wav", 1);
const bg_audio = play_audio(loop_audio(create_audio("https://labs.phaser.io/assets/audio/tech/bass.mp3", 0.5)));

// Create Update loop
update_loop(game_state => {
    update_text(score, "Score: " + stringify(snake_length - start_length));
    if (!alive) {
        update_text(game_text, "Game Over!");
        return undefined;
    }

    // Move snake
    for (let i = snake_length - 1; i > 0; i = i - 1) {
        update_position(snake[i], query_position(snake[i - 1]));
    }
    update_position(snake[0], query_position(snake_head)); // Update head
    update_position(snake_head, bound_vec(add_vec(query_position(snake_head), move_dir))); // Update head
    debug_log(query_position(snake[0])); // Head

    input();

    // Add food
    if (eaten) {
        update_position(food, [math_floor(math_random() * grid) * unit + unit / 2, math_floor(math_random() * grid) * unit + unit / 2]);
        eaten = false;
    }

    // Eat food
    if (get_loop_count() > 1 && gameobjects_overlap(snake_head, food)) {
        eaten = true;
        snake_length = snake_length + food_growth;
        play_audio(eat);
    }
    debug_log(snake_length); // Score

    // Check collision
    if (get_loop_count() > start_length) {
        for (let i = 0; i < snake_length; i = i + 1) {
            if (gameobjects_overlap(snake_head, snake[i])) {
                alive = false;
                play_audio(lose);
                stop_audio(bg_audio);
            }
        }
    }
});
build_game();
 * ```
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
