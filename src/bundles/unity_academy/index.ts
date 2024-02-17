/**
 * **A module that allows students to program with Unity Engine in either <u>2-D</u> or <u>3-D</u> scene in Source Academy.**
 *
 * Makes use of "**Unity Academy Embedded WebGL Frontend**" (also made by me) to work together.
 *
 * **Code Examples:** <a href = 'https://unity-academy.s3.ap-southeast-1.amazonaws.com/code_examples.html' rel="noopener noreferrer" target="_blank">Click Here</a><br>
 * **Prefab Information:** <a href = 'https://unity-academy.s3.ap-southeast-1.amazonaws.com/webgl_assetbundles/prefab_info.html' rel="noopener noreferrer" target="_blank">Click Here</a><br>
 * **User Agreement:** <a href = 'https://unity-academy.s3.ap-southeast-1.amazonaws.com/user_agreement.html' rel="noopener noreferrer" target="_blank">Click Here</a><br>
 *
 * **<u>Note that you need to use this module with a '<i>Native</i>' variant of Source language, otherwise you may get strange errors.</u>**
 *
 *
 * **Lifecycle Event Functions**
 * - Unity Academy has its own internal loop on students' GameObject lifecycle.
 * - <u>Lifecycle event functions</u> are functions that are not supposed to be called by Source Academy's default evaluator, instead they are called by Unity Academy at certain time in the GameObject's lifecycle.
 * - Currently there are five types of Unity Academy lifecycle event function: `Start`, `Update` and three collision detaction functions.
 * - Both `Start` and `Update` functions should be a student-side function object with only one parameter, which automatically refers to the GameObject that is binded with the function when Unity Academy calls the function. So different GameObject instances can share the same lifecycle event function together.
 * For example:
 * ```
 * function my_start(gameObject){...};
 * const my_update = (gameObject) => {...};
 * ```
 * - The functions `set_start` and `set_update` in this module can be used to set one GameObject's `Start` and `Update` functions.
 *   - `Start` is called only for one time after the GameObject is created (instantiated) and before its first `Update` call.
 *   - `Update` is called on every GameObject once in every frame after `Start` have been called.
 * - For the three collision detaction lifecycle event functions, please refer to `on_collision_enter`, `on_collision_stay` and `on_collision_exit` functions under the `Physics - Collision` category.
 * - You can not bind multiple lifecycle functions of the same type to the same GameObject. For example, you can't bind two `Update` functions to the same GameObject. In this case, previously binded `Update` functions will be overwritten by the latest binded `Update` function.
 *
 * <u>**[IMPORTANT]** All functions in this module that is NOT under the "**Outside Lifecycle**" or "Maths" category need to call by Unity Academy lifecycle event functions (directly or intermediately) to work correctly. Failure to follow this rule may lead to noneffective or incorrect behaviors of the functions and may crash the Unity Academy instance.</u>
 * For example:
 * ```
 * import {init_unity_academy_3d, instantiate, set_start, set_update, set_position, set_rotation_euler} from 'unity_academy';
 * init_unity_academy_3d(); // Correct, since this function is under the "Outside Lifecycle" category and it can be called outside lifecycle event functions.
 * const cube = instantiate("cube"); // Correct
 * set_position(cube, 1, 2, 3); // WRONG, since set_position should ONLY be called inside a lifecycle event function
 * function my_start(gameObject){ // A sample Start event function which will be binded to cube by my_start later.
 *     set_position(gameObject, 1, 2, 3); // Correct, since the call to set_position is inside a lifecycle event function
 *     something_else(gameObject);
 * }
 * function something_else(obj){
 *    set_rotation_euler(obj, 0, 45, 45);  // Correct, since the function "set_rotation_euler" is intermediately called by the lifecycle event function "my_start" through "something_else"
 * }
 * set_start(cube, my_start); // Correct
 * ```
 *
 * When any runtime errors happen in lifecycle event functions, they will be displayed in Unity Academy's console and the lifecycle event function that caused the errors will automatically unbind from the GameObject.
 *
 *
 * **Input Function Key Codes**
 *
 * - Accepts A-Z, a-z, 0-9 and "LeftMouseBtn" / "RightMouseBtn" / "MiddleMouseBtn" / "Space" / "LeftShift" / "RightShift"
 *
 *
 * **Key differences between 2D and 3D mode**
 * - <u>In 2D mode</u> the main camera renders the scene in **orthographic** mode (Z position is used to determine sequence when sprites overlapping), whereas <u>in 3D mode</u> the camera renders the scene in **perspective** mode. Moreover, 3D mode and 2D mode have different kinds of default camera controller.
 * - <u>In 2D mode</u>, due to the loss of one dimension, for some values and axis in 3D coordinate system, they sometimes behaves differently with 3D mode. For example, some coordinate values is ignored in 2D mode. Whereas <u>in 3D mode</u> you can use the fully-supported 3D coordinate system. (Actually, in general, Unity Academy just simply uses 3D space and an orthographic camera to simulate 2D space.)
 * - <u>In 2D mode</u> you need to use **instantiate_sprite** to create new GameObjects, whereas <u>in 3D mode</u> you need to use **instantiate** to create new GameObjects.
 * - <u>In 2D mode</u> Unity Academy will use Rigidbody2D and 2D colliders like BoxCollider2D for physics engine (certain values for 3D physics engine in 2D physics engine is ignored and will always be zero), whereas <u>in 3D mode</u> Unity Academy use regular 3D rigidbody and 3D colliders to simulate 3D physics.
 * - <u>In 2D mode</u> playing frame animations for sprite GameObjects is currently unavailable, whereas <u>in 3D mode</u> you need to use **play_animator_state** to play 3D animations.
 *
 *
 * **Space and Coordinates**
 * - <u>3D:</u> Uses **left-hand coordinate system**: +X denotes rightward, +Y denotes upward, +Z denotes forward.
 * - <u>2D:</u> +X denotes rightward, +Y denotes upward, Z value actually still exists and usually used for determining sequence of overlapping 2D GameObjects like sprites.
 * - About **Vector3**
 *   - `Vector3` is an object that can represent either a 3D vector or simply a combination of three coordinate values (X, Y and Z) depends on where it is used. It can be created through `vector3(x, y, z);`.
 *   - For example:
 *     - In function `set_velocity`, the `Vector3` parameter represents the 3D vector for the velocity of the rigidbody.
 *     - In function `set_position`, the `Vector3` parameter represents a point defined by (X, Y, Z) in the space.
 *     - In function `set_scale`, the `Vector3` parameter represents the scale of the GameObject along each of the three axes (X, Y, Z).
 *
 *
 * **Unity Academy Camera Control (only available when the default camera controllers are being used)**
 * - <u>In 2D mode:</u>
 *   - 'W'/'A'/'S'/'D' : Moves the main camera around
 *   - '=' (equals key) : Resets the main camera to its initial position
 * - <u>In 3D mode:</u>
 *   - '=' (equals key) : Resets the main camera to its initial position and rotation
 *   - Left Mouse Button : Hold to rotate the main camera in a faster speed
 *   - Mouse Scrollwheel : Zoom in / out
 *
 * **Rich Text**
 *  - You can use Unity's rich text feature in the `text` parameter for functions `gui_label` and `gui_button`,
 *    and the `content` paramater for functions `debug_log`, `debug_logwarning` and `debug_logerror` to customize
 *    font color, font size and display your text in boldface and italics.
 *  - See https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/StyledText.html for more information about how to use this feature.
 *  - In Unity Academy, only tags `b`, `i`, `size` and `color` are supported.
 *
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
  gui_label,
  gui_button,
  get_main_camera_following_target,
  request_for_main_camera_control,
  set_custom_prop,
  get_custom_prop,
  vector3,
  get_x,
  get_y,
  get_z,
  scale_vector,
  add_vectors,
  vector_difference,
  dot,
  cross,
  normalize,
  magnitude,
  zero_vector,
  point_distance,
  /* I will uncomment these audio functions when I totally finish audio support.
  load_audio_clip_mp3,
  load_audio_clip_ogg,
  load_audio_clip_wav,
  instantiate_audio_source,
  play_audio,
  pause_audio,
  set_audio_play_speed,
  set_audio_play_progress,
  change_audio_clip,
  set_audio_looping,
  set_audio_volume,
  get_audio_play_progress,
  is_audio_playing,
  // todos
  set_audio_listener_position,
  play_audio_clip_3d_sound,
  */
  debug_log,
  debug_logwarning,
  debug_logerror,
} from './functions';
