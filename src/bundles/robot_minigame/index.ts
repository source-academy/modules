/**
 * The robot_minigame module allows us to control a robot to complete various tasks
 *
 * @module robot_minigame
 * @author Koh Wai Kei
 * @author Justin Cheng
 */

export {
  init, create_area, create_rect_area, create_obstacle, create_rect_obstacle, complete_init,
  get_distance, get_flags, get_color,
  move_forward, move_forward_to_wall, rotate, turn_left, turn_right,
  start_testing, entered_areas, entered_colors
} from './functions';
