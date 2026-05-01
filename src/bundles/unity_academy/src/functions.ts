/**
 * Functions for Source Academy's Unity Academy module
 * @module unity_academy
 * @author Wang Zihan
 */

import { GeneralRuntimeError, InvalidParameterTypeError } from '@sourceacademy/modules-lib/errors';
import { assertFunctionOfLength, assertNumberWithinRange } from '@sourceacademy/modules-lib/utilities';
import { getInstance, initializeModule, type AudioClipIdentifier, type GameObjectIdentifier } from './UnityAcademy';
import {
  addVectors,
  checkVector3Parameter,
  crossProduct,
  dotProduct,
  makeVector3D,
  normalizeVector,
  pointDistance,
  scaleVector,
  vectorDifference,
  vectorMagnitude,
  zeroVector,
  type Vector3
} from './UnityAcademyMaths';

/**
 * Load and initialize Unity Academy WebGL player and set it to 2D mode. All other functions (except Maths functions) in this module requires calling this function or `init_unity_academy_3d` first.
 *
 * I recommand you just call this function at the beginning of your Source Unity program under the 'import' statements.
 *
 * @category Application Initialization
 * @category Outside Lifecycle
 */
export function init_unity_academy_2d(): void {
  initializeModule('2d');
}

/**
 * Load and initialize Unity Academy WebGL player and set it to 3D mode. All other functions (except Maths functions) in this module requires calling this function or `init_unity_academy_2d` first.
 *
 * I recommand you just call this function at the beginning of your Source Unity program under the 'import' statements.
 *
 * @category Application Initialization
 * @category Outside Lifecycle
 */
export function init_unity_academy_3d(): void {
  initializeModule('3d');
}

function checkUnityAcademyExistence(func_name: string, mode?: '3D' | '2D') {
  const instance = getInstance();

  if (instance === undefined) {
    throw new GeneralRuntimeError(`${func_name}: Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function`);
  }

  if (mode === '3D' && instance.dimensionMode !== '3d') {
    throw new GeneralRuntimeError(`${func_name}: You are calling a "3D mode only" function in non-3d mode.`);
  } else if (mode === '2D' && instance.dimensionMode !== '2d') {
    throw new GeneralRuntimeError(`${func_name}: You are calling a "2D mode only" function in non-2d mode.`);
  }

  return instance;
}

function checkGameObjectIdentifierParameter(
  gameObjectIdentifier: unknown,
  func_name: string,
  param_name?: string
): asserts gameObjectIdentifier is GameObjectIdentifier {
  // Here I can not just do "gameObjectIdentifier instanceof GameObjectIdentifier".
  // Because if I do that, when students re-run their code on the same Unity instance, (gameObjectIdentifier instanceof GameObjectIdentifier) will always evaluate to false
  // even when students provide the parameter with the correct type.
  const instance = getInstance()!;
  if (!(gameObjectIdentifier instanceof instance.gameObjectIdentifierWrapperClass)) {
    throw new InvalidParameterTypeError('GameObjectIdentifier', gameObjectIdentifier, func_name, param_name);
  }
  if (instance.getStudentGameObject(gameObjectIdentifier).isDestroyed) {
    throw new GeneralRuntimeError(`${func_name}: Trying to use a GameObject that is already destroyed.`);
  }
}

function validateNumber(obj: unknown, func_name: string, param_name?: string, allowInfinity: boolean = false): asserts obj is number {
  assertNumberWithinRange(obj, {
    func_name, param_name
  });

  if (!allowInfinity && (obj === Infinity || obj === -Infinity)) {
    throw new InvalidParameterTypeError('finite number', obj, func_name, param_name);
  }
}

/**
 * Determines whether two GameObject identifiers refers to the same GameObject.
 *
 * @param first The first GameObject identifier to compare with.
 * @param second The second GameObject identifier to compare with.
 * @returns Returns true if the two GameObject identifiers refers to the same GameObject and false otherwise.
 * @category Common
 */
export function same_gameobject(first: GameObjectIdentifier, second: GameObjectIdentifier): boolean {
  const instance = checkUnityAcademyExistence(same_gameobject.name);

  if (!(first instanceof instance.gameObjectIdentifierWrapperClass) || !(second instanceof instance.gameObjectIdentifierWrapperClass)) {
    return false;
  }
  return first.gameObjectIdentifier === second.gameObjectIdentifier;
}

/**
 * Sets the Start function of a given GameObject
 * @param gameObjectIdentifier The identifier for the GameObject that you want to bind the Start function on.
 * @param startFunction The Start function you want to assign to this GameObject. The Start function should contain one parameter, that Unity will pass the owner GameObject's identifier to this parameter.
 *
 * @category Common
 * @category Outside Lifecycle
 */
export function set_start(gameObjectIdentifier: GameObjectIdentifier, startFunction: (id: GameObjectIdentifier) => void): void {
  const instance = checkUnityAcademyExistence(set_start.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, set_start.name);
  assertFunctionOfLength(startFunction, 1, set_start.name);

  instance.setStartInternal(gameObjectIdentifier, startFunction);
}

/**
 * Sets the Update function of a given GameObject
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to bind the Update function on.
 * @param updateFunction The Update function you want to assign to this GameObject. The Update function should contain one parameter, that Unity will pass the owner GameObject's identifier to this parameter.
 *
 * @category Common
 * @category Outside Lifecycle
 */
export function set_update(gameObjectIdentifier: GameObjectIdentifier, updateFunction: (id: GameObjectIdentifier) => void): void {
  const instance = checkUnityAcademyExistence(set_update.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, set_update.name);
  assertFunctionOfLength(updateFunction, 1, set_update.name);

  instance.setUpdateInternal(gameObjectIdentifier, updateFunction);
}

/**
 * Creates a new GameObject from an existing Prefab
 *
 * **3D mode only**
 *
 * A prefab is something that is pre-built and can be created and used as a whole.
 *
 * Available Prefab Information: <a href = 'https://unity-academy.s3.ap-southeast-1.amazonaws.com/webgl_assetbundles/prefab_info.html' rel="noopener noreferrer" target="_blank">Click Here</a>
 *
 * @param prefab_name The prefab name
 * @returns the identifier of the newly created GameObject
 *
 * @category Common
 * @category Outside Lifecycle
 */
export function instantiate(prefab_name: string): GameObjectIdentifier {
  const instance = checkUnityAcademyExistence(instantiate.name, '3D');

  if (typeof prefab_name !== 'string') {
    throw new InvalidParameterTypeError('string', prefab_name, instantiate.name);
  }

  return instance.instantiateInternal(prefab_name);
}

/**
 * Creates a new 2D Sprite GameObject from an online image.
 *
 * The Sprite GameObject has a BoxCollider2D that matches its size by default. You may use `remove_collider_components` function to remove the default collider.
 *
 * Note that Unity Academy will use a HTTP GET request to download the image, which means that the HTTP response from the URL must allows CORS.
 *
 * **2D mode only**
 *
 * @param sourceImageUrl The image url for the sprite.
 * @returns the identifier of the newly created GameObject
 *
 * @category Common
 * @category Outside Lifecycle
 */
export function instantiate_sprite(sourceImageUrl: string) {
  const instance = checkUnityAcademyExistence(instantiate_sprite.name, '2D');

  if (typeof sourceImageUrl !== 'string') {
    throw new InvalidParameterTypeError('string', sourceImageUrl, instantiate_sprite.name);
  }

  return instance.instantiate2DSpriteUrlInternal(sourceImageUrl);
}

/**
 * Creates a new empty GameObject.
 *
 * An empty GameObject is invisible and only have transform properties by default.
 *
 * You may use the empty GameObject to run some general game management code or use the position of the empty GameObject to represent a point in the scene that the rest of your codes can access and utilize.
 *
 * @returns the identifier of the newly created GameObject
 *
 * @category Common
 * @category Outside Lifecycle
 */
export function instantiate_empty(): GameObjectIdentifier {
  const instance = checkUnityAcademyExistence(instantiate_empty.name);
  return instance.instantiateEmptyGameObjectInternal();
}

/**
 * Returns the value of Time.deltaTime in Unity ( roughly saying it's about `1 / instant_frame_rate_per_second` )
 *
 * This should be useful when implementing timers or constant speed control in Update function.
 *
 * For example:
 * ```
 * function update(gameObject){
 *     const move_speed = 3;
 *     translate_world(gameObject, 0, 0, move_speed * delta_time());
 * }
 * ```
 * By assigning the above code to a GameObject with `set_update`, that GameObject will move in a constant speed for about 3 units per second along world +Z axis.
 *
 * For more information, see https://docs.unity3d.com/ScriptReference/Time-deltaTime.html
 * @returns the delta time value in decimal
 *
 * @category Common
 */
export function delta_time() {
  const instance = checkUnityAcademyExistence(delta_time.name);
  return instance.getDeltaTime();
}

/**
 * Removes a GameObject
 *
 * Note that this won't remove the GameObject immediately, the actual removal will happen at the end of the current main cycle loop.
 *
 * For more information, see https://docs.unity3d.com/ScriptReference/Object.Destroy.html
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to destroy.
 * @category Common
 */
export function destroy(gameObjectIdentifier: GameObjectIdentifier): void {
  const instance = checkUnityAcademyExistence(destroy.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, destroy.name);

  instance.destroyGameObjectInternal(gameObjectIdentifier);
}

/**
 * Returns the world position of a given GameObject
 * @param gameObjectIdentifier The identifier for the GameObject that you want to get position for.
 * @returns The position represented in a Vector3.
 *
 * @category Transform
 */
export function get_position(gameObjectIdentifier: GameObjectIdentifier): Vector3 {
  const instance = checkUnityAcademyExistence(get_position.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, get_position.name);
  return instance.getGameObjectTransformProp('position', gameObjectIdentifier);
}

/**
 * Set the world position of a given GameObject
 * @param gameObjectIdentifier The identifier for the GameObject that you want to change position for.
 * @param position The new position for the GameObject.
 *
 * @category Transform
 */
export function set_position(gameObjectIdentifier: GameObjectIdentifier, position: Vector3): void {
  const instance = checkUnityAcademyExistence(set_position.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, set_position.name);
  checkVector3Parameter(position, set_position.name);

  return instance.setGameObjectTransformProp('position', gameObjectIdentifier, position);
}

/**
 * Returns the world Euler angle rotation of a given GameObject
 * @param gameObjectIdentifier The identifier for the GameObject that you want to get rotation for.
 * @returns The Euler angle rotation represented in a Vector3.
 *
 * @category Transform
 */
export function get_rotation_euler(gameObjectIdentifier: GameObjectIdentifier): Vector3 {
  const instance = checkUnityAcademyExistence(get_rotation_euler.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, get_rotation_euler.name);

  return instance.getGameObjectTransformProp('rotation', gameObjectIdentifier);
}

/**
 * Set the world rotation of a given GameObject with given Euler angle rotation.
 * @param gameObjectIdentifier The identifier for the GameObject that you want to change rotation for.
 * @param rotation The new rotation (in Euler angles) for the GameObject.
 *
 * @category Transform
 */
export function set_rotation_euler(gameObjectIdentifier: GameObjectIdentifier, rotation: Vector3): void {
  const instance = checkUnityAcademyExistence(set_rotation_euler.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, set_rotation_euler.name);
  checkVector3Parameter(rotation, set_rotation_euler.name);

  return instance.setGameObjectTransformProp('rotation', gameObjectIdentifier, rotation);
}

/**
 * Returns the scale (size factor) of a given GameObject
 *
 * By default the scale of a GameObject is (1, 1, 1)
 * @param gameObjectIdentifier The identifier for the GameObject that you want to get scale for.
 * @returns The scale represented in a Vector3.
 *
 * @category Transform
 */
export function get_scale(gameObjectIdentifier: GameObjectIdentifier): Vector3 {
  const instance = checkUnityAcademyExistence(get_scale.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, get_scale.name);

  return instance.getGameObjectTransformProp('scale', gameObjectIdentifier);
}

/**
 * Set the scale (size) of a given GameObject
 *
 * By default the scale of a GameObject is (1, 1, 1). Changing the scale of a GameObject along one axis will lead to a stretch or squeeze of the GameObject along that axis.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to change scale for.
 * @param scale Vector to scale by
 * @category Transform
 */
export function set_scale(gameObjectIdentifier: GameObjectIdentifier, scale: Vector3): void {
  const instance = checkUnityAcademyExistence(set_scale.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, set_scale.name);
  checkVector3Parameter(scale, set_scale.name, 'scale');

  return instance.setGameObjectTransformProp('scale', gameObjectIdentifier, scale);
}

/**
 * Moves a GameObject with given x, y and z values
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to translate.
 * @param deltaPosition The values you want to move the GameObject along each axis with respect to the world space.
 *
 * @category Transform
 */
export function translate_world(gameObjectIdentifier: GameObjectIdentifier, deltaPosition: Vector3): void {
  const instance = checkUnityAcademyExistence(translate_world.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, translate_world.name);
  checkVector3Parameter(deltaPosition, translate_world.name, 'deltaPosition');

  return instance.translateWorldInternal(gameObjectIdentifier, deltaPosition);
}

/**
 * Moves a GameObject with given x, y and z values, **with respect to its local space**.
 *
 * The current rotation of the GameObject will affect the real direction of movement.
 *
 * In Unity, usually, the direction of +Z axis denotes forward.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to translate.
 * @param deltaPosition The values you want to move the GameObject along each axis with respect to the local space.
 *
 * @category Transform
 */
export function translate_local(gameObjectIdentifier: GameObjectIdentifier, deltaPosition: Vector3): void {
  const instance = checkUnityAcademyExistence(translate_local.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, translate_local.name);
  checkVector3Parameter(deltaPosition, translate_local.name, 'deltaPosition');

  return instance.translateLocalInternal(gameObjectIdentifier, deltaPosition);
}

/**
 * Rotates a GameObject with given x, y and z values (Euler angle)
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to rotate.
 * @param angles The values you want to rotate along each axis with respect to the world space
 *
 * @category Transform
 */
export function rotate_world(gameObjectIdentifier: GameObjectIdentifier, angles: Vector3): void {
  const instance = checkUnityAcademyExistence(rotate_world.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, rotate_world.name);
  checkVector3Parameter(angles, rotate_world.name, 'angles');

  return instance.rotateWorldInternal(gameObjectIdentifier, angles);
}

/**
 * Copy the position values from one GameObject to another GameObject along with delta values.
 *
 * Set one or more coordinate value(s) in the `deltaPosition` Vector3 to the exact value "999999" (six nines) to remain the position of the destination GameObject on the corresponding axis/axes unaffected by this function.
 *
 * @param from The identifier for the GameObject that you want to copy position from.
 * @param to The identifier for the GameObject that you want to copy position to.
 * @param deltaPosition This value will be added to the copied value when copying the position value to the destination GameObject.
 *
 * @category Transform
 */
export function copy_position(from: GameObjectIdentifier, to: GameObjectIdentifier, deltaPosition: Vector3): void {
  const instance = checkUnityAcademyExistence(copy_position.name);
  checkGameObjectIdentifierParameter(from, copy_position.name, 'from');
  checkGameObjectIdentifierParameter(to, copy_position.name, 'to');
  checkVector3Parameter(deltaPosition, copy_position.name, 'deltaPosition');

  return instance.copyTransformPropertiesInternal('position', from, to, deltaPosition);
}

/**
 * Copy the rotation values (Euler angles) from one GameObject to another GameObject along with delta values.
 *
 * Set one or more coordinate value(s) in the `deltaPosition` Vector3 to the exact value "999999" (six nines) to remain the rotation of the destination GameObject on the corresponding axis/axes unaffected by this function.
 *
 * @param from The identifier for the GameObject that you want to copy rotation from.
 * @param to The identifier for the GameObject that you want to copy rotation to.
 * @param deltaRotation This value will be added to the copied value when copying the rotation value to the destination GameObject.
 *
 * @category Transform
 */
export function copy_rotation(from: GameObjectIdentifier, to: GameObjectIdentifier, deltaRotation: Vector3): void {
  const instance = checkUnityAcademyExistence(copy_rotation.name);
  checkGameObjectIdentifierParameter(from, copy_rotation.name, 'from');
  checkGameObjectIdentifierParameter(to, copy_rotation.name, 'to');
  checkVector3Parameter(deltaRotation, copy_rotation.name, 'deltaRotation');

  return instance.copyTransformPropertiesInternal('rotation', from, to, deltaRotation);
}

/**
 * Copy the scale values from one GameObject to another GameObject along with delta values.
 *
 * Set one or more coordinate value(s) in the `deltaPosition` Vector3 to the exact value "999999" (six nines) to remain the scale of the destination GameObject on the corresponding axis/axes unaffected by this function.
 *
 * @param from The identifier for the GameObject that you want to copy scale from.
 * @param to The identifier for the GameObject that you want to copy scale to.
 * @param deltaScale This value will be added to the copied value when copying the scale value to the destination GameObject.
 *
 * @category Transform
 */
export function copy_scale(from: GameObjectIdentifier, to: GameObjectIdentifier, deltaScale: Vector3): void {
  const instance = checkUnityAcademyExistence(copy_scale.name);
  checkGameObjectIdentifierParameter(from, copy_scale.name, 'from');
  checkGameObjectIdentifierParameter(to, copy_scale.name, 'to');
  checkVector3Parameter(deltaScale, copy_scale.name, 'deltaScale');

  return instance.copyTransformPropertiesInternal('scale', from, to, deltaScale);
}

/**
 * Rotates the GameObject's transform so the local forward vector points at the given position.
 *
 * The +Z direction of the GameObject (with respect to the GameObject's local space), which denotes forward in Unity's conventions, will pointing to the given position.
 *
 * For more information, see https://docs.unity3d.com/ScriptReference/Transform.LookAt.html
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you need to make it "look at" a position
 * @param position The target position
 *
 * @category Transform
 */
export function look_at(gameObjectIdentifier: GameObjectIdentifier, position: Vector3): void {
  const instance = checkUnityAcademyExistence(look_at.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, look_at.name);
  checkVector3Parameter(position, look_at.name, 'position');

  instance.lookAtPositionInternal(gameObjectIdentifier, position);
}

/**
 * Calcuate the distance between two GameObjects, based on each other's position
 * @param gameObjectIdentifier_A The identifier for the first GameObject
 * @param gameObjectIdentifier_B The identifier for the second GameObject
 *
 *
 * @returns The value of the distance between these two GameObjects
 * @category Transform
 */
export function gameobject_distance(gameObjectIdentifier_A: GameObjectIdentifier, gameObjectIdentifier_B: GameObjectIdentifier): number {
  const instance = checkUnityAcademyExistence(gameobject_distance.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier_A, gameobject_distance.name, 'gameObjectIdentifier_A');
  checkGameObjectIdentifierParameter(gameObjectIdentifier_B, gameobject_distance.name, 'gameObjectIdentifier_B');
  return instance.gameObjectDistanceInternal(gameObjectIdentifier_A, gameObjectIdentifier_B);
}

export const BUTTON_KEY_CODES = [
  'LeftMouseBtn',
  'RightMouseBtn',
  'MiddleMouseBtn',
  'Space',
  'LeftShift',
  'RightShift'
] as const;

type ButtonKeyCodes = (typeof BUTTON_KEY_CODES)[number];

type CharKeyCodes =
  | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g'
  | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n'
  | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u'
  | 'v' | 'w' | 'x' | 'y' | 'z'
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

type KeyCode = ButtonKeyCodes | CharKeyCodes | Uppercase<CharKeyCodes>;

export function assertIsValidKeyCode(obj: unknown, func_name: string, param_name?: string): asserts obj is KeyCode {
  if (typeof obj === 'string') {
    if (BUTTON_KEY_CODES.includes(obj as any)) return;
    if (/^[a-zA-Z0-9]$/.test(obj)) return;
  }

  throw new InvalidParameterTypeError('KeyCode', obj, func_name, param_name);
}

/**
 * When user presses a key on the keyboard or mouse button, this function will return true only at the frame when the key is just pressed down and return false afterwards.
 *
 * For more information, see https://docs.unity3d.com/ScriptReference/Input.GetKeyDown.html
 * @returns A boolean value equivalent to Input.GetKeyDown(keyCode) in Unity.
 *
 * @param keyCode The key to detact input for.
 * @category Input
 */
export function get_key_down(keyCode: KeyCode): boolean {
  const instance = checkUnityAcademyExistence(get_key_down.name);
  assertIsValidKeyCode(keyCode, get_key_down.name);

  return instance.getKeyState(keyCode) === 1;
}

/**
 * When user presses a key on the keyboard or mouse button, this function will return true in every frame that the key is still being pressed and false otherwise.
 *
 * For more information, see https://docs.unity3d.com/ScriptReference/Input.GetKey.html
 * @returns A boolean value equivalent to Input.GetKey(keyCode) in Unity.
 *
 * @param keyCode The key to detact input for.
 * @category Input
 */
export function get_key(keyCode: KeyCode): boolean {
  const instance = checkUnityAcademyExistence(get_key.name);
  assertIsValidKeyCode(keyCode, get_key.name);

  const keyState = instance.getKeyState(keyCode);
  return keyState === 1 || keyState === 2 || keyState === 3;
}

/**
 * When user releases a pressed key on the keyboard or mouse button, this function will return true only at the frame when the key is just released up and return false otherwise.
 *
 * For more information, see https://docs.unity3d.com/ScriptReference/Input.GetKeyUp.html
 * @returns A boolean value equivalent to Input.GetKeyUp(keyCode) in Unity.
 *
 * @param keyCode The key to detact input for.
 * @category Input
 */
export function get_key_up(keyCode: KeyCode): boolean {
  const instance = checkUnityAcademyExistence(get_key_up.name);
  assertIsValidKeyCode(keyCode, get_key_up.name);

  return instance.getKeyState(keyCode) === 3;
}

/**
 * Plays an Unity animation state with given name on the GameObject's animator. Note that not all game objects have Unity animations. You should ask the people who provided you the prefab asset bundle for available animation names assigned to the prefab.
 *
 * If you provide an invalid animator state name, this function will not take effect.
 *
 * **3D mode only**
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to play the animation on.
 * @param animatorStateName The name for the animator state to play.
 * @category Common
 */
export function play_animator_state(gameObjectIdentifier: GameObjectIdentifier, animatorStateName: string): void {
  const instance = checkUnityAcademyExistence(play_animator_state.name, '3D');
  checkGameObjectIdentifierParameter(gameObjectIdentifier, play_animator_state.name);

  if (typeof animatorStateName !== 'string') {
    throw new InvalidParameterTypeError('string', animatorStateName, play_animator_state.name, 'animatorStateName');
  }

  instance.playAnimatorStateInternal(gameObjectIdentifier, animatorStateName);
}

/**
 * Apply rigidbody (2D or 3D based on the current dimension mode) to the given GameObject to use Unity's physics engine.
 *
 * All other functions under the Physics - Rigidbody category require calling this function first on the applied GameObjects.
 *
 * For more information, see
 * - https://docs.unity3d.com/ScriptReference/Rigidbody.html (For 3D Mode)
 * - https://docs.unity3d.com/ScriptReference/Rigidbody2D.html (For 2D Mode)
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to apply rigidbody on.
 * @category Physics - Rigidbody
 */
export function apply_rigidbody(gameObjectIdentifier: GameObjectIdentifier): void {
  const instance = checkUnityAcademyExistence(apply_rigidbody.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, apply_rigidbody.name);
  instance.applyRigidbodyInternal(gameObjectIdentifier);
}

/**
 * Returns the mass of the rigidbody attached on the GameObject.
 *
 * Usage of all physics functions under the Physics - Rigidbody category requires calling `apply_rigidbody` first on the applied game objects.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to get mass for.
 * @returns The mass of the rigidbody attached on the GameObject
 * @category Physics - Rigidbody
 */
export function get_mass(gameObjectIdentifier: GameObjectIdentifier): number {
  const instance = checkUnityAcademyExistence(get_mass.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, get_mass.name);
  return instance.getRigidbodyNumericalProp('mass', gameObjectIdentifier);
}

/**
 * Set the mass of the rigidbody attached on the game object.
 *
 * Usage of all physics functions under the Physics - Rigidbody category requires calling `apply_rigidbody` first on the applied game objects.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to change mass for.
 * @param mass The value for the new mass.
 * @category Physics - Rigidbody
 */
export function set_mass(gameObjectIdentifier: GameObjectIdentifier, mass: number): void {
  const instance = checkUnityAcademyExistence(set_mass.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, set_mass.name);

  validateNumber(mass, set_mass.name, 'mass');
  instance.setRigidbodyNumericalProp('mass', gameObjectIdentifier, mass);
}

/**
 * Returns the velocity of the rigidbody attached on the GameObject.
 *
 * Usage of all physics functions under the Physics - Rigidbody category requires calling `apply_rigidbody` first on the applied game objects.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to get velocity for.
 * @returns the velocity at this moment represented in a Vector3.
 * @category Physics - Rigidbody
 */
export function get_velocity(gameObjectIdentifier: GameObjectIdentifier): Vector3 {
  const instance = checkUnityAcademyExistence(get_velocity.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, get_velocity.name);
  return instance.getRigidbodyVelocityVector3Prop('velocity', gameObjectIdentifier);
}

/**
 * Set the (linear) velocity of the rigidbody attached on the GameObject.
 *
 * Usage of all physics functions under the Physics - Rigidbody category requires calling `apply_rigidbody` first on the applied game objects.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to change velocity for.
 * @param velocity The new velocity for the rigidbody attached on the GameObject.
 * @category Physics - Rigidbody
 */
export function set_velocity(gameObjectIdentifier: GameObjectIdentifier, velocity: Vector3): void {
  const instance = checkUnityAcademyExistence(set_velocity.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, set_velocity.name);
  checkVector3Parameter(velocity, set_velocity.name, 'velocity');

  instance.setRigidbodyVelocityVector3Prop('velocity', gameObjectIdentifier, velocity);
}

/**
 * Returns the angular velocity of the rigidbody attached on the game object.
 *
 * Usage of all physics functions under the Physics - Rigidbody category requires calling `apply_rigidbody` first on the applied game objects.
 *
 * **2D Mode Special: **In 2D mode there is no angular velocity on X nor Y axis, so in the X and Y values in the returned Vector3 will always be zero.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to get angular velocity for.
 * @returns the angular velocity at this moment represented in a Vector3.
 * @category Physics - Rigidbody
 */
export function get_angular_velocity(gameObjectIdentifier: GameObjectIdentifier): Vector3 {
  const instance = checkUnityAcademyExistence(get_angular_velocity.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, get_angular_velocity.name);
  return instance.getRigidbodyVelocityVector3Prop('angularVelocity', gameObjectIdentifier);
}

/**
 * Set the angular velocity of the rigidbody attached on the game object.
 *
 * Usage of all physics functions under the Physics - Rigidbody category requires calling `apply_rigidbody` first on the applied game objects.
 *
 * **2D Mode Special: **In 2D mode there is no angular velocity on X nor Y axis, so the X and Y values in the Vector3 is ignored.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to change angular velocity for.
 * @param angularVelocity The new angular velocity for the rigidbody attached on the GameObject.
 * @category Physics - Rigidbody
 */
export function set_angular_velocity(gameObjectIdentifier: GameObjectIdentifier, angularVelocity: Vector3): void {
  const instance = checkUnityAcademyExistence(set_angular_velocity.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, set_angular_velocity.name);
  checkVector3Parameter(angularVelocity, set_angular_velocity.name, 'angularVelocity');

  instance.setRigidbodyVelocityVector3Prop('angularVelocity', gameObjectIdentifier, angularVelocity);
}

/**
 * Set the drag (similar to air resistance) the rigidbody attached on the game object.
 *
 * By default the drag is zero.
 *
 * Usage of all physics functions under the Physics - Rigidbody category requires calling `apply_rigidbody` first on the applied game objects.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to change drag for.
 * @param value The value of the new drag.
 * @category Physics - Rigidbody
 */
export function set_drag(gameObjectIdentifier: GameObjectIdentifier, value: number): void {
  const instance = checkUnityAcademyExistence(set_drag.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, set_drag.name);
  validateNumber(value, set_drag.name, 'value');

  instance.setRigidbodyNumericalProp('drag', gameObjectIdentifier, value);
}

/**
 * Set the angular drag (similar to an air resistance that affects angular velocity) the rigidbody attached on the game object.
 *
 * By default the angular drag is 0.05
 *
 * Usage of all physics functions under the Physics - Rigidbody category requires calling `apply_rigidbody` first on the applied game objects.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to change angular drag for.
 * @param value The value of the new angular drag.
 * @category Physics - Rigidbody
 */
export function set_angular_drag(gameObjectIdentifier: GameObjectIdentifier, value: number): void {
  const instance = checkUnityAcademyExistence(set_angular_drag.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, set_angular_drag.name);
  validateNumber(value, set_angular_drag.name, 'value');

  instance.setRigidbodyNumericalProp('angularDrag', gameObjectIdentifier, value);
}

/**
 * Set whether the rigidbody attached on the game object should calculate for gravity.
 *
 * Usage of all physics functions under the Physics - Rigidbody category requires calling `apply_rigidbody` first on the applied game objects.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to enable/disable gravity on its rigidbody.
 * @param useGravity Set to true if you want gravity to be applied on this rigidbody, false otherwise.
 * @category Physics - Rigidbody
 */
export function set_use_gravity(gameObjectIdentifier: GameObjectIdentifier, useGravity: boolean): void {
  const instance = checkUnityAcademyExistence(set_use_gravity.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, set_use_gravity.name);

  if (typeof useGravity !== 'boolean') {
    throw new InvalidParameterTypeError('boolean', useGravity, set_use_gravity.name, 'useGravity');
  }

  instance.setUseGravityInternal(gameObjectIdentifier, useGravity);
}

/**
 * Add an impulse force on the Rigidbody attached on the GameObject, **using its mass**.
 *
 * Usage of all physics functions under the Physics category requires calling `apply_rigidbody` first on the applied game objects.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to add the force.
 * @param force The force vector.
 * @category Physics - Rigidbody
 */
export function add_impulse_force(gameObjectIdentifier: GameObjectIdentifier, force: Vector3): void {
  const instance = checkUnityAcademyExistence(add_impulse_force.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, add_impulse_force.name);
  checkVector3Parameter(force, add_impulse_force.name, 'force');

  instance.addImpulseForceInternal(gameObjectIdentifier, force);
}

/**
 * Removes all collider components directly attached on the given GameObject by default.
 *
 * You can use this function on GameObjects those you don't want them to collide with other GameObjects.
 *
 * For example, you may use this on the background image sprite GameObject in 2D scene.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to remove colliders for.
 * @category Physics - Collision
 */
export function remove_collider_components(gameObjectIdentifier: GameObjectIdentifier): void {
  const instance = checkUnityAcademyExistence(remove_collider_components.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, remove_collider_components.name);
  instance.removeColliderComponentsInternal(gameObjectIdentifier);
}

type CollisionHandler = (self: GameObjectIdentifier, other: GameObjectIdentifier) => void;

/**
 * Set the lifecycle event function that will be called when the collider on this GameObject just starting colliding with another collider.
 *
 * The given function should contain two parameters. The first parameter refers to the binded GameObject and the second parameter refers to the other GameObject that collides with the binded GameObject (both parameters are GameObject identifiers).
 *
 * For example: `const myFunction = (self, other) => {...};`
 *
 * - Note that for collision detaction to happen, for the two colliding GameObjects:
 *   - if **in 3D mode**, both GameObjects must applied Rigidbody by `apply_rigidbody`
 *   - if **in 2D mode**, at least one GameObject must applied Rigidbody by `apply_rigidbody`
 *
 * For more information, see
 * - https://docs.unity3d.com/ScriptReference/Collider.OnCollisionEnter.html (For 3D Mode)
 * - https://docs.unity3d.com/ScriptReference/MonoBehaviour.OnCollisionEnter2D.html (For 2D Mode)
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to bind the lifecycle event function on.
 * @param eventFunction The lifecycle event function for handling this event.
 * @category Physics - Collision
 * @category Outside Lifecycle
 */
export function on_collision_enter(gameObjectIdentifier: GameObjectIdentifier, eventFunction: CollisionHandler): void {
  const instance = checkUnityAcademyExistence(on_collision_enter.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, on_collision_enter.name);
  assertFunctionOfLength(eventFunction, 2, on_collision_enter.name, 'eventFunction');

  instance.setOnCollisionEnterInternal(gameObjectIdentifier, eventFunction);
}

/**
 * Set the lifecycle event function that will be called per frame when the collider on this GameObject is colliding with another collider.
 *
 * The given function should contain two parameters. The first parameter refers to the binded GameObject and the second parameter refers to the other GameObject that collides with the binded GameObject (both parameters are GameObject identifiers).
 *
 * For example: `const myFunction = (self, other) => {...};`
 *
 * - Note that for collision detaction to happen, for the two colliding GameObjects:
 *   - if **in 3D mode**, both GameObjects must applied Rigidbody by `apply_rigidbody`
 *   - if **in 2D mode**, at least one GameObject must applied Rigidbody by `apply_rigidbody`
 *
 * For more information, see
 * - https://docs.unity3d.com/ScriptReference/Collider.OnCollisionStay.html (For 3D Mode)
 * - https://docs.unity3d.com/ScriptReference/MonoBehaviour.OnCollisionStay2D.html (For 2D Mode)
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to bind the lifecycle event function on.
 * @param eventFunction The lifecycle event function for handling this event.
 * @category Physics - Collision
 * @category Outside Lifecycle
 */
export function on_collision_stay(gameObjectIdentifier: GameObjectIdentifier, eventFunction: CollisionHandler): void {
  const instance = checkUnityAcademyExistence(on_collision_stay.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, on_collision_stay.name);
  assertFunctionOfLength(eventFunction, 2, on_collision_stay.name, 'eventFunction');

  instance.setOnCollisionStayInternal(gameObjectIdentifier, eventFunction);
}

/**
 * Set the lifecycle event function that will be called when the collider on this GameObject just stops colliding with another collider.
 *
 * The given function should contain two parameters. The first parameter refers to the binded GameObject and the second parameter refers to the other GameObject that collides with the binded GameObject (both parameters are GameObject identifiers).
 *
 * For example: `const myFunction = (self, other) => {...};`
 *
 * - Note that for collision detaction to happen, for the two colliding GameObjects:
 *   - if **in 3D mode**, both GameObjects must applied Rigidbody by `apply_rigidbody`
 *   - if **in 2D mode**, at least one GameObject must applied Rigidbody by `apply_rigidbody`
 *
 * For more information, see
 * - https://docs.unity3d.com/ScriptReference/MonoBehaviour.OnCollisionExit.html (For 3D Mode)
 * - https://docs.unity3d.com/ScriptReference/MonoBehaviour.OnCollisionExit2D.html (For 2D Mode)
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to bind the lifecycle event function on.
 * @param eventFunction The lifecycle event function for handling this event.
 * @category Physics - Collision
 * @category Outside Lifecycle
 */
export function on_collision_exit(gameObjectIdentifier: GameObjectIdentifier, eventFunction: CollisionHandler): void {
  const instance = checkUnityAcademyExistence(on_collision_exit.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, on_collision_exit.name);
  assertFunctionOfLength(eventFunction, 2, on_collision_exit.name, 'eventFunction');

  instance.setOnCollisionExitInternal(gameObjectIdentifier, eventFunction);
}

/**
 * Draw a text (string) on the screen with given **screen space position** in the current frame.
 *
 * The origin of screen space is upper-left corner and the positive Y direction is downward.
 *
 * The drawn text will only last for one frame. You should put this under the `Update` function (or a function that is called by the `Update` function) to keep the text stays in every frame.
 *
 * You can use rich text for the parameter `text`. For example: `gui_label("<color=#AA00FF>Hello World</color>", 100, 100);`
 *
 * @param text The string you want to display on screen.
 * @param x The x coordinate of the text (in screen position).
 * @param y The y coordinate of the text (in screen position).
 * @category Graphical User Interface
 */
export function gui_label(text: string, x: number, y: number): void {
  const instance = checkUnityAcademyExistence(gui_label.name);

  if (typeof text !== 'string') {
    throw new InvalidParameterTypeError('string', text, gui_label.name, 'text');
  }

  validateNumber(x, gui_label.name, 'x');
  validateNumber(y, gui_label.name, 'y');

  instance.onGUI_Label(text, x, y);
}

/**
 * Make a button on the screen with given **screen space position** in the current frame. When user clicks the button, the `onClick` function will be called.
 *
 * The origin of screen space is upper-left corner and the positive Y direction is downward.
 *
 * The drawn button will only last for one frame. You should put this under the `Update` function (or a function that is called by the `Update` function) to keep the button stays in every frame.
 *
 * If this function is called by a lifecycle event function, then the `onClick` function in the fourth parameter could also be considered as a lifecycle event function.
 *
 * This means that you can use other functions from this module inside the `onClick` function, even though the functions are not under the `Outside Lifecycle` category.
 *
 * For example, the code piece below
 * ```
 * import {init_unity_academy_3d, set_start, set_update, instantiate, gui_button, set_position }
 * from "unity_academy";
 * init_unity_academy_3d();
 *
 * const cube = instantiate("cube");
 *
 * const cube_update = (gameObject) => {
 *   gui_button("Button", 1000, 300, 200, 50, ()=>
 *     set_position(gameObject, 0, 10, 6) // calling set_position inside the onClick function
 *   );
 * };
 *
 * set_update(cube, cube_update);
 * ```
 * is correct.
 *
 * You can use rich text for the parameter `text`. For example: `gui_button("<color=#AA00FF>Hello World</color>", 100, 100, 200, 50, my_onclick_function);`
 *
 * @param text The text you want to display on the button.
 * @param x The x coordinate of the button (in screen position).
 * @param y The y coordinate of the button (in screen position).
 * @param width The width for the button.
 * @param height The height for the button.
 * @param onClick The function that will be called when user clicks the button on screen.
 * @category Graphical User Interface
 */
export function gui_button(text: string, x: number, y: number, width: number, height: number, onClick: () => void): void {
  const instance = checkUnityAcademyExistence(gui_button.name);

  if (typeof text !== 'string') {
    throw new InvalidParameterTypeError('string', text, gui_button.name, 'text');
  }

  validateNumber(x, gui_button.name, 'x');
  validateNumber(y, gui_button.name, 'y');
  validateNumber(width, gui_button.name, 'width');
  validateNumber(height, gui_button.name, 'height');
  assertFunctionOfLength(onClick, 0, gui_button.name, 'onClick');

  instance.onGUI_Button(text, x, y, width, height, onClick);
}

/**
 * Get the main camera following target GameObject (an invisible GameObject) to use it to control the position of the main camera with the default camera controller.
 * - **In 3D mode**, the default camera controller behaves as third-person camera controller, and the center to follow is the following target GameObject. Also, Unity Academy will automatically set the rotation of this "following target" to the same rotation as the current main camera's rotation to let you get the main camera's rotation.
 * - **In 2D mode**, the default camera controller will follow the target GameObject to move, along with a position delta value that you can adjust with the arrow keys on your keyboard.
 *
 * The main camera following target GameObject is a primitive GameObject. This means that you are not allowed to destroy it and/or instantiate it during runtime. Multiple calls to this function will return GameObject identifiers that refer to the same primitive GameObject.
 *
 * **If default main camera controllers are disabled (you have called `request_for_main_camera_control`), then the following target GameObject is useless.**
 *
 * @returns The GameObject idenfitier for the main camera following target GameObject.
 * @category Camera
 * @category Outside Lifecycle
 */
export function get_main_camera_following_target(): GameObjectIdentifier {
  const instance = checkUnityAcademyExistence(get_main_camera_following_target.name);
  return instance.getGameObjectIdentifierForPrimitiveGameObject('MainCameraFollowingTarget');
}

/**
 * Request for main camera control and get a GameObject identifier that can directly be used to control the main camera's position and rotation.
 *
 * When you request for the direct control over main camera with this function, the default camera controllers will be disabled, thus the GameObject identifier returned by `get_main_camera_following_target` will become useless, as you can no longer use the default main camera controllers.
 *
 * This function is for totally customizing the position and rotation of the main camera. If you'd like to simplify the camera controlling with the help of the default camera controllers in Unity Academy, please consider use `get_main_camera_following_target` function.
 *
 * @returns The GameObject identifier that can directly be used to control the main camera's position and rotation
 * @category Camera
 * @category Outside Lifecycle
 */
export function request_for_main_camera_control(): GameObjectIdentifier {
  const instance = checkUnityAcademyExistence(request_for_main_camera_control.name);
  return instance.requestForMainCameraControlInternal();
}

/**
 * Set a custom property with name and value on a GameObject
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to set the custom property on.
 * @param propName The name (a string) of the custom property
 * @param value The value of the custom property, can be anything you want
 *
 * @category Common
 */
export function set_custom_prop(gameObjectIdentifier: GameObjectIdentifier, propName: string, value: any): void {
  const instance = checkUnityAcademyExistence(set_custom_prop.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, set_custom_prop.name);

  if (typeof propName !== 'string') {
    throw new InvalidParameterTypeError('string', propName, set_custom_prop.name, 'propName');
  }

  instance.setCustomPropertyInternal(gameObjectIdentifier, propName, value);
}

/**
 * Get the value of a custom property with its name on a GameObject
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to get the custom property on.
 * @param propName The name (a string) of the custom property
 *
 * @returns The value of the custom property with the given name on the given GameObject. If the property value is not set, this function will return `undefined`.
 *
 * @category Common
 */
export function get_custom_prop(gameObjectIdentifier: GameObjectIdentifier, propName: string): any {
  const instance = checkUnityAcademyExistence(get_custom_prop.name);
  checkGameObjectIdentifierParameter(gameObjectIdentifier, get_custom_prop.name);

  if (typeof propName !== 'string') {
    throw new InvalidParameterTypeError('string', propName, get_custom_prop.name, 'propName');
  }

  return instance.getCustomPropertyInternal(gameObjectIdentifier, propName);
}

/**
 * Create a 3D vector
 * @param x The x component of the new vector
 * @param y The y component of the new vector
 * @param z The z component of the new vector
 *
 * @returns The 3D vector (x, y, z)
 *
 * @category Maths
 */
export function vector3(x: number, y: number, z: number): Vector3 {
  validateNumber(x, vector3.name, 'x');
  validateNumber(y, vector3.name, 'y');
  validateNumber(z, vector3.name, 'z');

  return makeVector3D(x, y, z);
}

/**
 * Get the X component of a 3D vector
 * @param vector The 3D vector
 *
 * @returns The X component of the given vector
 *
 * @category Maths
 */
export function get_x(vector: Vector3): number {
  checkVector3Parameter(vector, get_x.name);
  return vector.x;
}

/**
 * Get the Y component of a 3D vector
 * @param vector The 3D vector
 *
 * @returns The Y component of the given vector
 *
 * @category Maths
 */
export function get_y(vector: Vector3): number {
  checkVector3Parameter(vector, get_y.name);
  return vector.y;
}

/**
 * Get the Z component of a 3D vector
 * @param vector The 3D vector
 *
 * @returns The Z component of the given vector
 *
 * @category Maths
 */
export function get_z(vector: Vector3): number {
  checkVector3Parameter(vector, get_z.name);
  return vector.z;
}

/**
 * Scales a 3D vector with the given factor.
 * @param vector The original vector
 * @param factor The scaling factor.
 * @returns The scaled vector
 *
 * @category Maths
 */
export function scale_vector(vector: Vector3, factor: number): Vector3 {
  checkVector3Parameter(vector, scale_vector.name);
  validateNumber(factor, scale_vector.name, 'factor');

  return scaleVector(vector, factor);
}

/**
 * Add two 3D vectors together.
 * @param vectorA The first vector
 * @param vectorB The second vector.
 * @returns The sum of the two vectors
 *
 * @category Maths
 */
export function add_vectors(vectorA: Vector3, vectorB: Vector3): Vector3 {
  checkVector3Parameter(vectorA, add_vectors.name, 'vectorA');
  checkVector3Parameter(vectorB, add_vectors.name, 'vectorB');

  return addVectors(vectorA, vectorB);
}

/**
 * Calcuate the vector difference between two vectors (vectorA - vectorB).
 * @param vectorA The minuend vector.
 * @param vectorB The subtrahend vector.
 * @returns The result for vectorA - vectorB
 *
 * @category Maths
 */
export function vector_difference(vectorA: Vector3, vectorB: Vector3): Vector3 {
  checkVector3Parameter(vectorA, vector_difference.name, 'vectorA');
  checkVector3Parameter(vectorB, vector_difference.name, 'vectorB');

  return vectorDifference(vectorA, vectorB);
}

/**
 * Calcuate the dot product of two 3D vectors.
 * @param vectorA The first vector
 * @param vectorB The second vector.
 * @returns The dot product
 *
 * @category Maths
 */
export function dot(vectorA: Vector3, vectorB: Vector3): number {
  checkVector3Parameter(vectorA, dot.name, 'vectorA');
  checkVector3Parameter(vectorB, dot.name, 'vectorB');

  return dotProduct(vectorA, vectorB);
}

/**
 * Calcuate the cross product of two 3D vectors.
 * @param vectorA The first vector
 * @param vectorB The second vector.
 * @returns The cross product
 *
 * @category Maths
 */
export function cross(vectorA: Vector3, vectorB: Vector3): Vector3 {
  checkVector3Parameter(vectorA, cross.name, 'vectorA');
  checkVector3Parameter(vectorB, cross.name, 'vectorB');

  return crossProduct(vectorA, vectorB);
}

/**
 * Normalize a vector. The returned vector will have the same direction as the original vector but have a magnitude of 1.
 * @param vector The original vector
 * @returns The normalized vector. This function will return a zero vector if the original vector is a zero vector.
 *
 * @category Maths
 */
export function normalize(vector: Vector3): Vector3 {
  checkVector3Parameter(vector, normalize.name);
  return normalizeVector(vector);
}

/**
 * Calcuate the magnitude of a vector
 * @param vector The vector
 * @returns The magnitude of the vector
 *
 * @category Maths
 */
export function magnitude(vector: Vector3): number {
  checkVector3Parameter(vector, magnitude.name);
  return vectorMagnitude(vector);
}

/**
 * Get the zero vector
 * @returns The zero vector
 *
 * @category Maths
 */
export function zero_vector(): Vector3 {
  return zeroVector();
}

/**
 * Calcuate the distance between two 3D points
 *
 * @param pointA The first point
 * @param pointB The second point
 *
 * @returns The value of the distance between the two points
 *
 * @category Maths
 */
export function point_distance(pointA: Vector3, pointB: Vector3): number {
  checkVector3Parameter(pointA, point_distance.name, 'pointA');
  checkVector3Parameter(pointB, point_distance.name, 'pointB');
  return pointDistance(pointA, pointB);
}

/**
 *
 * Documentation TODO
 *
 * @category Sound / Audio
 * @category Outside Lifecycle
 */
export function load_audio_clip_mp3(audioUrl: string): AudioClipIdentifier {
  const instance = checkUnityAcademyExistence(load_audio_clip_mp3.name);
  if (typeof audioUrl !== 'string') {
    throw new InvalidParameterTypeError('string', audioUrl, load_audio_clip_mp3.name);
  }

  return instance.loadAudioClipInternal(audioUrl, 'mp3');
}

/**
 *
 * Documentation TODO
 *
 * @category Sound / Audio
 * @category Outside Lifecycle
 */
export function load_audio_clip_ogg(audioUrl: string): AudioClipIdentifier {
  const instance = checkUnityAcademyExistence(load_audio_clip_ogg.name);

  if (typeof audioUrl !== 'string') {
    throw new InvalidParameterTypeError('string', audioUrl, load_audio_clip_ogg.name);
  }

  return instance.loadAudioClipInternal(audioUrl, 'ogg');
}

/**
 *
 * Documentation TODO
 *
 * @category Sound / Audio
 * @category Outside Lifecycle
 */
export function load_audio_clip_wav(audioUrl: string): AudioClipIdentifier {
  const instance = checkUnityAcademyExistence(load_audio_clip_wav.name);
  if (typeof audioUrl !== 'string') {
    throw new InvalidParameterTypeError('string', audioUrl, load_audio_clip_wav.name);
  }

  return instance.loadAudioClipInternal(audioUrl, 'wav');
}

/**
 *
 * Create an audio source GameObject
 *
 * The audio source GameObject can be used to play an audio clip with audio functions. But it's basically a regular GameObject with extra data for audio playing.
 * So you can still use the audio source as a regular GameObject, like setting its position with `set_position`, using `set_start` and `set_update` to set its `Start` and `Update` funtions, etc.
 *
 * @param audioClip the audio clip that you want to use for this audio source
 * @returns the identifier of the newly created GameObject
 *
 * @category Sound / Audio
 * @category Outside Lifecycle
 */
export function instantiate_audio_source(audioClip: AudioClipIdentifier): GameObjectIdentifier {
  // todo: check audio clip identifier type
  const instance = checkUnityAcademyExistence(instantiate_audio_source.name);
  return instance.instantiateAudioSourceInternal(audioClip);
}

/**
 *
 * Start / resume playing the audio of an audio source
 *
 * @param audioSrc the GameObject identifier for the audio source
 *
 * @category Sound / Audio
 */
export function play_audio(audioSrc: GameObjectIdentifier): void {
  const instance = checkUnityAcademyExistence(play_audio.name);
  checkGameObjectIdentifierParameter(audioSrc, play_audio.name);
  instance.setAudioSourceProp('isPlaying', audioSrc, true);
}

/**
 *
 * Pause the audio of an audio source
 *
 * @param audioSrc the GameObject identifier for the audio source
 *
 * @category Sound / Audio
 */
export function pause_audio(audioSrc: GameObjectIdentifier): void {
  const instance = checkUnityAcademyExistence(pause_audio.name);
  checkGameObjectIdentifierParameter(audioSrc, pause_audio.name);
  instance.setAudioSourceProp('isPlaying', audioSrc, false);
}

/**
 *
 * Set the play speed of an audio source.
 *
 * @param audioSrc the GameObject identifier for the audio source
 * @param speed the play speed
 *
 * @category Sound / Audio
 */
export function set_audio_play_speed(audioSrc: GameObjectIdentifier, speed: number): void {
  const instance = checkUnityAcademyExistence(set_audio_play_speed.name);
  checkGameObjectIdentifierParameter(audioSrc, set_audio_play_speed.name);
  validateNumber(speed, set_audio_play_speed.name, 'speed');

  instance.setAudioSourceProp('playSpeed', audioSrc, speed);
}

/**
 *
 * Get the current play progress of an audio source
 *
 * @param audioSrc the GameObject identifier for the audio source
 * @returns the current play progress (seconds after the beginning of the audio clip)
 *
 * @category Sound / Audio
 */
export function get_audio_play_progress(audioSrc: GameObjectIdentifier): number {
  const instance = checkUnityAcademyExistence(get_audio_play_progress.name);
  checkGameObjectIdentifierParameter(audioSrc, get_audio_play_progress.name);
  return instance.getAudioSourceProp('playProgress', audioSrc);
}

/**
 *
 * Set the play progress of an audio source
 *
 * @param audioSrc the GameObject identifier for the audio source
 * @param progress the play progress (seconds after the beginning of the audio clip)
 *
 * @category Sound / Audio
 */
export function set_audio_play_progress(audioSrc: GameObjectIdentifier, progress: number): void {
  const instance = checkUnityAcademyExistence(set_audio_play_progress.name);
  checkGameObjectIdentifierParameter(audioSrc, set_audio_play_progress.name);
  validateNumber(progress, set_audio_play_progress.name, 'progresss');

  instance.setAudioSourceProp('playProgress', audioSrc, progress);
}

/**
 *
 * @category Sound / Audio
 */
export function change_audio_clip(audioSrc: GameObjectIdentifier, newAudioClip: AudioClipIdentifier): void {
  const instance = checkUnityAcademyExistence(change_audio_clip.name);
  checkGameObjectIdentifierParameter(audioSrc, change_audio_clip.name);
  // todo: check audio clip identifier type
  instance.setAudioSourceProp('audioClipIdentifier', audioSrc, newAudioClip);
}

/**
 *
 * @category Sound / Audio
 */
export function set_audio_looping(audioSrc: GameObjectIdentifier, looping: boolean): void {
  const instance = checkUnityAcademyExistence(set_audio_looping.name);
  checkGameObjectIdentifierParameter(audioSrc, set_audio_looping.name);

  if (typeof looping !== 'boolean') {
    throw new InvalidParameterTypeError('boolean', looping, set_audio_looping.name, 'looping');
  }

  instance.setAudioSourceProp('isLooping', audioSrc, looping);
}

/**
 *
 * @category Sound / Audio
 */
export function set_audio_volume(audioSrc: GameObjectIdentifier, volume: number): void {
  const instance = checkUnityAcademyExistence(set_audio_volume.name);
  checkGameObjectIdentifierParameter(audioSrc, set_audio_volume.name);
  validateNumber(volume, set_audio_volume.name, 'volume');

  instance.setAudioSourceProp('volume', audioSrc, volume);
}

/**
 *
 * @category Sound / Audio
 */
export function is_audio_playing(audioSrc: GameObjectIdentifier): boolean {
  const instance = checkUnityAcademyExistence(is_audio_playing.name);
  checkGameObjectIdentifierParameter(audioSrc, is_audio_playing.name);

  return instance.getAudioSourceProp('isPlaying', audioSrc);
}

/**
 *
 * Log to Unity Academy Embedded Frontend's console.
 *
 * You can use rich text for the parameter `content`.
 *
 * @param content The content of the log message.
 *
 * @category Common
 * @category Outside Lifecycle
 */
export function debug_log(content: any): void {
  const instance = checkUnityAcademyExistence(debug_log.name);
  const contentStr = content.toString();
  instance.studentLogger(contentStr, 'log');
}

/**
 *
 * Log to Unity Academy Embedded Frontend's console, with yellow font color as highlighting.
 *
 * You can use rich text for the parameter `content`.
 *
 * @param content The content of the log message.
 *
 * @category Common
 * @category Outside Lifecycle
 */
export function debug_logwarning(content: any): void {
  const instance = checkUnityAcademyExistence(debug_logwarning.name);
  const contentStr = content.toString();
  instance.studentLogger(contentStr, 'warning');
}

/**
 *
 * Log to Unity Academy Embedded Frontend's console, with red font color as highlighting.
 *
 * Note that this function does not "really" throw any error. It just logs a message with red font color and the student code will continue running normally after calling this function to log the error.
 *
 * You can use rich text for the parameter `content`.
 *
 * @param content The content of the log message.
 *
 * @category Common
 * @category Outside Lifecycle
 */
export function debug_logerror(content: any): void {
  const instance = checkUnityAcademyExistence(debug_logerror.name);
  const contentStr = content.toString();
  instance.studentLogger(contentStr, 'error');
}

/**
 *
 * Set the audio listener's position in the space.
 *
 * The audio listener's position will only be used when playing audio clips with 3D sound effects. (refer to `play_audio_clip_3d_sound`)
 *
 * By default, the audio listener's position will be the same as the main camera's position. After you calling this function, the audio listener's will no longer follow the main camera's position and will be set to your specified position.
 *
 * @category Sound / Audio
 */
export function set_audio_listener_position(positionX: number, positionY: number, positionZ: number) {
  // todo: check audio clip identifier type
  checkUnityAcademyExistence(set_audio_listener_position.name);

  validateNumber(positionX, set_audio_listener_position.name, 'positionX');
  validateNumber(positionY, set_audio_listener_position.name, 'positionY');
  validateNumber(positionZ, set_audio_listener_position.name, 'positionZ');

  // TODO
}

/**
 *
 * Plays an audio clip, using 3D sound effects.
 *
 * The audio listener in the space will receive the sound and outputs the sound to user's sound devices. So the position of the audio clip and position of the audio listener will both effect the volume and direction of the actual output sound.
 *
 * Refer to `set_audio_listener_position` to customize the position of listening the sound in the space.
 *
 * @category Sound / Audio
 */
export function play_audio_clip_3d_sound(audioClip: AudioClipIdentifier, volume: number, loop: boolean, positionX: number, positionY: number, positionZ: number) {
  // todo: check audio clip identifier type
  checkUnityAcademyExistence(play_audio_clip_3d_sound.name);
  validateNumber(volume, play_audio_clip_3d_sound.name, 'volume');

  if (typeof loop !== 'boolean') {
    throw new InvalidParameterTypeError('boolean', loop, play_audio_clip_3d_sound.name, 'loop');
  }

  validateNumber(positionX, play_audio_clip_3d_sound.name, 'positionX');
  validateNumber(positionY, play_audio_clip_3d_sound.name, 'positionY');
  validateNumber(positionZ, play_audio_clip_3d_sound.name, 'positionZ');
  // TODO
}
