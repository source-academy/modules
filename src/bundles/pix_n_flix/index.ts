import {
  start,
  red_of,
  blue_of,
  green_of,
  alpha_of,
  set_rgba,
  image_height,
  image_width,
  copy_image,
  install_filter,
  reset_filter,
  compose_filter,
  pause_at,
  set_dimensions,
  set_fps,
  set_volume,
  use_local_file,
  use_image_url,
  use_video_url,
  get_video_time,
} from './functions';

/**
 * Bundle for Source Academy pix_n_flix module
 * @author Loh Xian Ze, Bryan
 * @author Tang Xin Kye, Marcus
 */

export default () => ({
  start,
  red_of,
  blue_of,
  green_of,
  alpha_of,
  set_rgba,
  image_height,
  image_width,
  copy_image,
  install_filter,
  reset_filter,
  compose_filter,
  pause_at,
  set_dimensions,
  set_fps,
  set_volume,
  use_local_file,
  use_image_url,
  use_video_url,
  get_video_time,
});
