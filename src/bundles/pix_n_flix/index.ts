/**
 * The pix_n_flix module allows us to process still images and videos.
 *
 * An Image (which is a still image or a frame of a video) is a
 * two-dimensional array of Pixels, and a Pixel consists of red, blue and green color
 * values, each ranging from 0 to 255. To access these color values of a Pixel, we
 * provide the functions red_of, blue_of and green_of.
 *
 * A central element of pix_n_flix is the notion of a Filter, a function that is applied
 * to two Images: the source Image and the destination Image. When a Filter is installed
 * (using the function install_filter), it transforms each source Image from the live camera
 * or from a local/remote file to a destination Image that is then displayed on screen
 * in the Source Academy "Pix N Flix" tab (with a camera icon).
 *
 * The dimensions (i.e. width and height) of the displayed images can be set by the user using
 * the function set_dimensions, and all source and destination Images of the Filters will
 * also be set to the same dimensions. To access the current dimensions of the Images, the user
 * can use the functions image_width and image_height.
 *
 * @module pix_n_flix
 * @author Loh Xian Ze, Bryan
 * @author Tang Xin Kye, Marcus
 */

export {
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
  keep_aspect_ratio,
  set_loop_count,
} from './functions';
