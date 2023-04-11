/**
 * Bundle for Source Academy physics_2d module
 * @author Muhammad Fikri Bin Abdul Kalam
 * @author Yu Jiali
 */

export {
  set_gravity,
  make_ground,
  add_wall,

  make_vector,
  make_force,

  add_box_object,
  add_circle_object,
  add_triangle_object,

  set_density,
  set_friction,
  scale_size,

  get_position,
  set_position,
  get_rotation,
  set_rotation,
  get_velocity,
  set_velocity,
  get_angular_velocity,
  set_angular_velocity,

  apply_force,
  apply_force_to_center,

  is_touching,
  impact_start_time,

  update_world,
  simulate_world,

  vector_to_array,
  array_to_vector,
  add_vector,
  subtract_vector,
} from './functions';
