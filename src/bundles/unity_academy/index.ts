/**
 * <b>A module that allows students to program with Unity Engine in either <u>2-D</u> or <u>3-D</u> scene in Source Academy.</b>
 * <br>
 * Makes use of "<b>Unity Academy Embedded WebGL Frontend</b>" (also made by me) to work together.<br>
 * <br>
 * <b>Code Examples: </b><a href = 'https://unity-academy.s3.ap-southeast-1.amazonaws.com/code_examples.html' rel="noopener noreferrer" target="_blank">Click Here</a><br>
 * <b>Prefab Information: </b><a href = 'https://unity-academy.s3.ap-southeast-1.amazonaws.com/webgl_assetbundles/prefab_info.html' rel="noopener noreferrer" target="_blank">Click Here</a><br>
 * <br>
 * <b><u>Note that you need to use this module with a 'Native' variant of Source language, otherwise you may get strange errors.</u></b>
 * <br>
 * <br>
 * <b>Lifecycle Event Functions</b><br>
 * ● Unity Academy has its own internal loop on students' GameObject lifecycle.<br>
 * ● <u>Lifecycle event functions</u> are functions that are not supposed to be called by Source Academy's default evaluator, instead they are called by Unity Academy at certain time in the GameObject's lifecycle.<br>
 * ● Currently there are five types of Unity Academy lifecycle event function: `Start`, `Update` and three collision detaction functions.<br>
 * ● Both `Start` and `Update` functions should be a student-side function object with only one parameter, which automatically refers to the GameObject that is binded with the function when Unity Academy calls the function. So different GameObject instances can share the same lifecycle event function together.<br>
 * For example:
 * ```
 * function my_start(gameObject){...};
 * const my_update = (gameObject) => {...};
 * ```
 * ● The functions `set_start` and `set_update` in this module can be used to set one GameObject's `Start` and `Update` functions<br>
 * ● ===>`Start` is called only for one time after the GameObject is created (instantiated) and before its first `Update` call.<br>
 * ● ===>`Update` is called on every GameObject once in every frame after `Start` have been called. <br>
 * ● For the three collision detaction lifecycle event functions, please refer to `on_collision_enter`, `on_collision_stay` and `on_collision_exit` functions under the `Physics - Collision` category.<br>
 * ● You can not bind multiple lifecycle functions of the same type to the same GameObject. For example, you can't bind two `Update` functions to the same GameObject. In this case, previously binded `Update` functions will be overwritten by the latest binded `Update` function.<br><br>
 * <u><b>[IMPORTANT]</b> All functions in this module that is NOT under the "<b>Outside Lifecycle</b>" or "Maths" category need to call by Unity Academy lifecycle event functions (Start or Update) to work correctly. Failure to follow this rule may lead to noneffective or incorrect behaviors of the functions and may crash the Unity Academy instance.</u><br>
 * For example:
 * ```
 * import {init_unity_academy_3d, instantiate, set_start, set_update, set_position} from 'unity_academy';
 * init_unity_academy_3d(); // Correct, since this function is under the "Outside Lifecycle" category and it can be called outside lifecycle event functions.
 * const cube = instantiate("cube"); // Correct
 * set_position(cube, 1, 2, 3); // WRONG, since set_position should ONLY be called inside a lifecycle event function
 * function my_start(gameObject){ // A sample Start event function which will be binded to cube by my_start later.
 *     set_position(gameObject, 1, 2, 3); // Correct, since the call to set_position is inside a lifecycle event function
 * }
 * set_start(cube, my_start); // Correct
 * ```
 * <br>
 * When any runtime errors happen in lifecycle event functions, they will be displayed in Unity Academy's information page and the lifecycle event function that caused the errors will automatically unbind from the GameObject.
 * <br>
 * <br>
 * <b>Input Function Key Codes</b> Accepts A-Z, a-z and "LeftMouseBtn" / "RightMouseBtn" / "MiddleMouseBtn" / "LeftShift" / "RightShift"
 * <br>
 * <br>
 * <b>Key differences between 2D and 3D mode</b><br>
 * ● In 2D mode the main camera renders the scene in <b>orthographic</b> mode (Z position is used to determine sequence when sprites overlapping), whereas in 3D mode the camera renders the scene in <b>perspective</b> mode. Moreover, 3D mode and 2D mode have different kinds of default camera controller.<br>
 * ● In 2D mode, due to the loss of one dimension, for some values and axis in 3D coordinate system, they sometimes behaves differently with 3D mode. For example, some coordinate values is ignored in 2D mode. Whereas in 3D mode you can use the fully-supported 3D coordinate system. (Actually, in general, Unity Academy just simply uses 3D space and an orthographic camera to simulate 2D space.)<br>
 * ● In 2D mode you need to use <b>instantiate_sprite</b> to create new GameObjects, whereas in 3D mode you need to use <b>instantiate</b> to create new GameObjects.<br>
 * ● In 2D mode Unity Academy will use Rigidbody2D and 2D colliders like BoxCollider2D for physics engine (certain values for 3D physics engine in 2D physics engine is ignored and will always be zero), whereas in 3D mode Unity Academy use regular 3D rigidbody and 3D colliders to simulate 3D physics.<br>
 * ● In 2D mode playing frame animations for sprite GameObjects is currently unavailable, whereas in 3D mode you need to use <b>play_animator_state</b> to play 3D animations.<br>
 * <br>
 * <br>
 * <b>Space and Coordinates</b><br>
 * ● 3D: Uses <b>left-hand coordinate system</b>: +X denotes rightward, +Y denotes upward, +Z denotes forward.<br>
 * ● 2D: +X denotes rightward, +Y denotes upward, Z value actually still exists and usually used for determining sequence of overlapping 2D GameObjects like sprites.
 * <br>
 * <br>
 * <b>Unity Academy Camera Control (only available when the default camera controllers are being used)</b><br>
 * ● <u>In 2D mode:</u><br>
 * ● 'W'/'A'/'S'/'D' : Moves the main camera around<br>
 * ● '=' (equals key) : Resets the main camera to its initial position<br>
 * ● <u>In 3D mode:</u><br>
 * ● '=' (equals key) : Resets the main camera to its initial position and rotation<br>
 * ● Left Mouse Button : Hold to rotate the main camera in a faster speed<br>
 * ● Mouse Scrollwheel : Zoom in / out
 * @module unity_academy
 * @author Wang Zihan
 */


export {
  init_unity_academy_2d,
  init_unity_academy_3d,
  same_gameobject,
  set_start,
  set_update,
  instantiate,
  instantiate_sprite,
  instantiate_empty,
  destroy,
  delta_time,
  get_position,
  set_position,
  get_rotation_euler,
  set_rotation_euler,
  get_scale,
  set_scale,
  translate_world,
  translate_local,
  rotate_world,
  copy_position,
  copy_rotation,
  copy_scale,
  look_at,
  gameobject_distance,
  get_key_down,
  get_key,
  get_key_up,
  play_animator_state,
  apply_rigidbody,
  get_mass,
  set_mass,
  set_drag,
  set_angular_drag,
  get_velocity,
  set_velocity,
  get_angular_velocity,
  set_angular_velocity,
  add_impulse_force,
  set_use_gravity,
  remove_collider_components,
  on_collision_enter,
  on_collision_stay,
  on_collision_exit,
  //  gui_label,
  //  gui_button,
  get_main_camera_following_target,
  request_for_main_camera_control,
  set_custom_prop,
  get_custom_prop,
  vector3,
  get_x,
  get_y,
  get_z,
  scale_vector,
  add_vector,
  dot,
  cross,
  normalize,
  magnitude,
  zero_vector,
  point_distance,
} from './functions';
