/**
 * 2D Phyiscs simulation module for Source Academy.
 *
 * A *vector* is defined by its coordinates (x and y). The 2D vector is used to
 * represent direction, size, position, velocity and other physical attributes in
 * the physics world. Vector manipulation and transformations between vector and array
 * types are supported.
 *
 * A *world* is the single physics world the module is based on.
 * `set_gravity` needs to be called to initialize the world and set the gravity. It has
 * to be called exactly once and at the start of the program.
 * `make_ground` and `add_wall` are optional settings of the world.
 * After adding objects to the world, calling `update_world` will simulate the world.
 * The suggested time step is 1/60 (seconds).
 *
 * An *object* is defined by its shape, position, velocity, size, rotation and state
 * with the add function. Get and set functions are provided to change the objects'
 * physical attributes like density and friction. Two options of `apply_force` are
 * useful to change behavior of objects at specific time. Detection of collision and
 * precise starting time are provided by `is_touching` and `impact_start_time`.
 *
 * Visualization of the physics world can be seen in the display tab.
 *
 * The following example simulates a free fall of a circle object.
 * ```
 * import { set_gravity, make_vector, add_circle_object, update_world } from "physics_2d";
 * const gravity = make_vector(0, -9.8);
 * set_gravity(gravity);
 * const pos = make_vector(0, 100);
 * const velc = make_vector(0, 0);
 * add_circle_object(pos, 0, velc, 10, false);
 * for (let i = 0; i < 10; i = i + 1) {
 *   update_world(1/60);
 * }
 * ```
 *
 * @module physics_2d
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
