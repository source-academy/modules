/**
 * Game library that translates Phaser 3 API into Source.
 *
 * More in-depth explanation of the Phaser 3 API can be found at
 * Phaser 3 documentation itself.
 *
 * For Phaser 3 API Documentation, check:
 * https://photonstorm.github.io/phaser3-docs/
 *
 * @module game
 * @author Anthony Halim
 * @author Chi Xu
 * @author Chong Sia Tiffany
 * @author Gokul Rajiv
 */

import gameFuncs from './functions';

export const {
  add,
  add_listener,
  add_keyboard_listener,
  add_to_container,
  add_tween,
  create_anim,
  create_anim_config,
  create_anim_frame_config,
  create_anim_spritesheet_frame_configs,
  create_award,
  create_config,
  create_container,
  create_ellipse,
  create_image,
  create_interactive_config,
  create_rect,
  create_text,
  create_text_config,
  create_tween_config,
  create_sound_config,
  create_spritesheet_config,
  destroy_obj,
  get_screen_width,
  get_screen_height,
  get_screen_display_width,
  get_screen_display_height,
  load_image,
  load_sound,
  load_spritesheet,
  play_anim_on_image,
  play_sound,
  prepend_remote_url,
  remove_listener,
  set_alpha,
  set_display_size,
  set_flip,
  set_interactive,
  set_origin,
  set_position,
  set_rotation,
  set_scale,
} = gameFuncs();
