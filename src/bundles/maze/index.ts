/**
 * The maze module allows us to guide a robot through a maze.
 *
 * @module maze
 * @author Koh Wai Kei
 * @author Justin Cheng
 */

export {
  init, complete_init, set_border_color, set_border_width,
  create_area, create_rect_area, create_obstacle, create_rect_obstacle,
  get_distance, sense_obstacle, get_color,
  move_forward, move_forward_to_wall, rotate, turn_left, turn_right,
  should_enter_colors, run_all_tests
} from './functions';
