/**
 * Functions for Source Academy's Unity Academy module
 * @module unity_academy
 * @author Wang Zihan
 */

import { initializeModule, getInstance, type GameObjectIdentifier, type AudioClipIdentifier } from './UnityAcademy';
import {
  type Vector3, checkVector3Parameter, makeVector3D, scaleVector, addVectors, vectorDifference, dotProduct,
  crossProduct, normalizeVector, vectorMagnitude, zeroVector, pointDistance,
} from './UnityAcademyMaths';


/**
 * Load and initialize Unity Academy WebGL player and set it to 2D mode. All other functions (except Maths functions) in this module requires calling this function or `init_unity_academy_3d` first.
 *
 * I recommand you just call this function at the beginning of your Source Unity program under the 'import' statements.
 *
 * @category Application Initialization
 * @category Outside Lifecycle
 */
export function init_unity_academy_2d() : void {
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
export function init_unity_academy_3d() : void {
  initializeModule('3d');
}

function checkUnityAcademyExistence() {
  if (getInstance() === undefined) {
    throw new Error('Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function');
  }
}

function checkIs2DMode() : void {
  if (getInstance().dimensionMode !== '2d') throw new Error('You are calling a "2D mode only" function in non-2d mode.');
}

function checkIs3DMode() : void {
  if (getInstance().dimensionMode !== '3d') throw new Error('You are calling a "3D mode only" function in non-3d mode.');
}

function checkGameObjectIdentifierParameter(gameObjectIdentifier : any) {
  // Here I can not just do "gameObjectIdentifier instanceof GameObjectIdentifier".
  // Because if I do that, when students re-run their code on the same Unity instance, (gameObjectIdentifier instanceof GameObjectIdentifier) will always evaluate to false
  // even when students provide the parameter with the correct type.
  const instance = getInstance();
  if (!(gameObjectIdentifier instanceof instance.gameObjectIdentifierWrapperClass)) {
    throw new Error(`Type "${(typeof (gameObjectIdentifier)).toString()}" can not be used as game object identifier!`);
  }
  if (instance.getStudentGameObject(gameObjectIdentifier).isDestroyed) {
    throw new Error('Trying to use a GameObject that is already destroyed.');
  }
}

function checkParameterType(parameter : any, expectedType : string, numberAllowInfinity = false) {
  const actualType = typeof (parameter);
  if (actualType !== expectedType) {
    throw new Error(`Wrong parameter type: expected ${expectedType}, but got ${actualType}`);
  }
  if (actualType.toString() === 'number') {
    if (!numberAllowInfinity && (parameter === Infinity || parameter === -Infinity)) {
      throw new Error('Wrong parameter type: expected a finite number, but got Infinity or -Infinity');
    }
  }
}

/**
 * Determines whether two GameObject identifiers refers to the same GameObject.
 *
 * @param first The first GameObject identifier to compare with.
 * @param second The second GameObject identifier to compare with.
 * @return Returns true if the two GameObject identifiers refers to the same GameObject and false otherwise.
 * @category Common
 */
export function same_gameobject(first : GameObjectIdentifier, second : GameObjectIdentifier) : boolean {
  checkUnityAcademyExistence();
  const instance = getInstance();
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
export function set_start(gameObjectIdentifier : GameObjectIdentifier, startFunction : Function) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkParameterType(startFunction, 'function');
  getInstance()
    .setStartInternal(gameObjectIdentifier, startFunction);
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
export function set_update(gameObjectIdentifier : GameObjectIdentifier, updateFunction : Function) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkParameterType(updateFunction, 'function');
  getInstance()
    .setUpdateInternal(gameObjectIdentifier, updateFunction);
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
 * @return the identifier of the newly created GameObject
 *
 * @category Common
 * @category Outside Lifecycle
 */
export function instantiate(prefab_name : string) : GameObjectIdentifier {
  checkUnityAcademyExistence();
  checkIs3DMode();
  checkParameterType(prefab_name, 'string');
  return getInstance()
    .instantiateInternal(prefab_name);
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
 * @return the identifier of the newly created GameObject
 *
 * @category Common
 * @category Outside Lifecycle
 */
export function instantiate_sprite(sourceImageUrl : string) {
  checkUnityAcademyExistence();
  checkIs2DMode();
  checkParameterType(sourceImageUrl, 'string');
  return getInstance()
    .instantiate2DSpriteUrlInternal(sourceImageUrl);
}

/**
 * Creates a new empty GameObject.
 *
 * An empty GameObject is invisible and only have transform properties by default.
 *
 * You may use the empty GameObject to run some general game management code or use the position of the empty GameObject to represent a point in the scene that the rest of your codes can access and utilize.
 *
 * @return the identifier of the newly created GameObject
 *
 * @category Common
 * @category Outside Lifecycle
 */
export function instantiate_empty() : GameObjectIdentifier {
  checkUnityAcademyExistence();
  return getInstance()
    .instantiateEmptyGameObjectInternal();
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
 * @return the delta time value in decimal
 *
 * @category Common
 */
export function delta_time() {
  checkUnityAcademyExistence();
  return getInstance()
    .getDeltaTime();
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
export function destroy(gameObjectIdentifier : GameObjectIdentifier) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  getInstance()
    .destroyGameObjectInternal(gameObjectIdentifier);
}

/**
 * Returns the world position of a given GameObject
 * @param gameObjectIdentifier The identifier for the GameObject that you want to get position for.
 * @return The position represented in a Vector3.
 *
 * @category Transform
 */
export function get_position(gameObjectIdentifier : GameObjectIdentifier) : Vector3 {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  return getInstance()
    .getGameObjectTransformProp('position', gameObjectIdentifier);
}

/**
 * Set the world position of a given GameObject
 * @param gameObjectIdentifier The identifier for the GameObject that you want to change position for.
 * @param position The new position for the GameObject.
 *
 * @category Transform
 */
export function set_position(gameObjectIdentifier : GameObjectIdentifier, position : Vector3) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkVector3Parameter(position);
  return getInstance()
    .setGameObjectTransformProp('position', gameObjectIdentifier, position);
}

/**
 * Returns the world Euler angle rotation of a given GameObject
 * @param gameObjectIdentifier The identifier for the GameObject that you want to get rotation for.
 * @return The Euler angle rotation represented in a Vector3.
 *
 * @category Transform
 */
export function get_rotation_euler(gameObjectIdentifier : GameObjectIdentifier) : Vector3 {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  return getInstance()
    .getGameObjectTransformProp('rotation', gameObjectIdentifier);
}

/**
 * Set the world rotation of a given GameObject with given Euler angle rotation.
 * @param gameObjectIdentifier The identifier for the GameObject that you want to change rotation for.
 * @param rotation The new rotation (in Euler angles) for the GameObject.
 *
 * @category Transform
 */
export function set_rotation_euler(gameObjectIdentifier : GameObjectIdentifier, rotation : Vector3) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkVector3Parameter(rotation);
  return getInstance()
    .setGameObjectTransformProp('rotation', gameObjectIdentifier, rotation);
}

/**
 * Returns the scale (size factor) of a given GameObject
 *
 * By default the scale of a GameObject is (1, 1, 1)
 * @param gameObjectIdentifier The identifier for the GameObject that you want to get scale for.
 * @return The scale represented in a Vector3.
 *
 * @category Transform
 */
export function get_scale(gameObjectIdentifier : GameObjectIdentifier) : Vector3 {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  return getInstance()
    .getGameObjectTransformProp('scale', gameObjectIdentifier);
}

/**
 * Set the scale (size) of a given GameObject
 *
 * By default the scale of a GameObject is (1, 1, 1). Changing the scale of a GameObject along one axis will lead to a stretch or squeeze of the GameObject along that axis.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to change scale for.
 * @param x The x component for the scale.
 * @param y The y component for the scale.
 * @param z The z component for the scale.
 *
 * @category Transform
 */
export function set_scale(gameObjectIdentifier : GameObjectIdentifier, scale : Vector3) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkVector3Parameter(scale);
  return getInstance()
    .setGameObjectTransformProp('scale', gameObjectIdentifier, scale);
}

/**
 * Moves a GameObject with given x, y and z values
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to translate.
 * @param deltaPosition The values you want to move the GameObject along each axis with respect to the world space.
 *
 * @category Transform
 */
export function translate_world(gameObjectIdentifier : GameObjectIdentifier, deltaPosition : Vector3) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkVector3Parameter(deltaPosition);
  return getInstance()
    .translateWorldInternal(gameObjectIdentifier, deltaPosition);
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
export function translate_local(gameObjectIdentifier : GameObjectIdentifier, deltaPosition : Vector3) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkVector3Parameter(deltaPosition);
  return getInstance()
    .translateLocalInternal(gameObjectIdentifier, deltaPosition);
}

/**
 * Rotates a GameObject with given x, y and z values (Euler angle)
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to rotate.
 * @param angles The values you want to rotate along each axis with respect to the world space
 *
 * @category Transform
 */
export function rotate_world(gameObjectIdentifier : GameObjectIdentifier, angles : Vector3) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkVector3Parameter(angles);
  return getInstance()
    .rotateWorldInternal(gameObjectIdentifier, angles);
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
export function copy_position(from : GameObjectIdentifier, to : GameObjectIdentifier, deltaPosition : Vector3) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(from);
  checkGameObjectIdentifierParameter(to);
  checkVector3Parameter(deltaPosition);
  return getInstance()
    .copyTransformPropertiesInternal('position', from, to, deltaPosition);
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
export function copy_rotation(from : GameObjectIdentifier, to : GameObjectIdentifier, deltaRotation : Vector3) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(from);
  checkGameObjectIdentifierParameter(to);
  checkVector3Parameter(deltaRotation);
  return getInstance()
    .copyTransformPropertiesInternal('rotation', from, to, deltaRotation);
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
export function copy_scale(from : GameObjectIdentifier, to : GameObjectIdentifier, deltaScale : Vector3) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(from);
  checkGameObjectIdentifierParameter(to);
  checkVector3Parameter(deltaScale);
  return getInstance()
    .copyTransformPropertiesInternal('scale', from, to, deltaScale);
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
export function look_at(gameObjectIdentifier : GameObjectIdentifier, position : Vector3) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkVector3Parameter(position);
  getInstance()
    .lookAtPositionInternal(gameObjectIdentifier, position);
}

/**
 * Calcuate the distance between two GameObjects, based on each other's position
 * @param gameObjectIdentifier_A The identifier for the first GameObject
 * @param gameObjectIdentifier_B The identifier for the second GameObject
 *
 *
 * @return The value of the distance between these two GameObjects
 * @category Transform
 */
export function gameobject_distance(gameObjectIdentifier_A : GameObjectIdentifier, gameObjectIdentifier_B : GameObjectIdentifier) : number {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier_A);
  checkGameObjectIdentifierParameter(gameObjectIdentifier_B);
  return getInstance()
    .gameObjectDistanceInternal(gameObjectIdentifier_A, gameObjectIdentifier_B);
}

function checkKeyCodeValidityAndToLowerCase(keyCode : string) : string {
  if (typeof (keyCode) !== 'string') throw new Error(`Key code must be a string! Given type: ${typeof (keyCode)}`);
  if (keyCode === 'LeftMouseBtn' || keyCode === 'RightMouseBtn' || keyCode === 'MiddleMouseBtn' || keyCode === 'Space' || keyCode === 'LeftShift' || keyCode === 'RightShift') return keyCode;
  keyCode = keyCode.toLowerCase();
  if (keyCode.length !== 1) throw new Error(`Key code must be either a string of length 1 or one among 'LeftMouseBtn', 'RightMouseBtn', 'MiddleMouseBtn', 'Space', 'LeftShift' or 'RightShift'! Given length: ${keyCode.length}`);
  const char = keyCode.charAt(0);
  if (!((char >= 'a' && char <= 'z') || (char >= '0' && char <= '9'))) {
    throw new Error(`Key code must be either a letter between A-Z or a-z or 0-9 or one among 'LeftMouseBtn', 'RightMouseBtn', 'MiddleMouseBtn', 'Space', 'LeftShift' or 'RightShift'! Given: ${keyCode}`);
  }
  return keyCode;
}

/**
 * When user presses a key on the keyboard or mouse button, this function will return true only at the frame when the key is just pressed down and return false afterwards.
 *
 * For more information, see https://docs.unity3d.com/ScriptReference/Input.GetKeyDown.html
 * @return A boolean value equivalent to Input.GetKeyDown(keyCode) in Unity.
 *
 * @param keyCode The key to detact input for.
 * @category Input
 */
export function get_key_down(keyCode : string) : boolean {
  checkUnityAcademyExistence();
  keyCode = checkKeyCodeValidityAndToLowerCase(keyCode);
  return getInstance()
    .getKeyState(keyCode) === 1;
}

/**
 * When user presses a key on the keyboard or mouse button, this function will return true in every frame that the key is still being pressed and false otherwise.
 *
 * For more information, see https://docs.unity3d.com/ScriptReference/Input.GetKey.html
 * @return A boolean value equivalent to Input.GetKey(keyCode) in Unity.
 *
 * @param keyCode The key to detact input for.
 * @category Input
 */
export function get_key(keyCode : string) : boolean {
  checkUnityAcademyExistence();
  keyCode = checkKeyCodeValidityAndToLowerCase(keyCode);
  const keyState = getInstance()
    .getKeyState(keyCode);
  return keyState === 1 || keyState === 2 || keyState === 3;
}


/**
 * When user releases a pressed key on the keyboard or mouse button, this function will return true only at the frame when the key is just released up and return false otherwise.
 *
 * For more information, see https://docs.unity3d.com/ScriptReference/Input.GetKeyUp.html
 * @return A boolean value equivalent to Input.GetKeyUp(keyCode) in Unity.
 *
 * @param keyCode The key to detact input for.
 * @category Input
 */
export function get_key_up(keyCode : string) : boolean {
  checkUnityAcademyExistence();
  keyCode = checkKeyCodeValidityAndToLowerCase(keyCode);
  return getInstance()
    .getKeyState(keyCode) === 3;
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
export function play_animator_state(gameObjectIdentifier : GameObjectIdentifier, animatorStateName : string) : void {
  checkUnityAcademyExistence();
  checkIs3DMode();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkParameterType(animatorStateName, 'string');
  getInstance()
    .playAnimatorStateInternal(gameObjectIdentifier, animatorStateName);
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
export function apply_rigidbody(gameObjectIdentifier : GameObjectIdentifier) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  getInstance()
    .applyRigidbodyInternal(gameObjectIdentifier);
}

/**
 * Returns the mass of the rigidbody attached on the GameObject.
 *
 * Usage of all physics functions under the Physics - Rigidbody category requires calling `apply_rigidbody` first on the applied game objects.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to get mass for.
 * @return The mass of the rigidbody attached on the GameObject
 * @category Physics - Rigidbody
 */
export function get_mass(gameObjectIdentifier : GameObjectIdentifier) : number {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  return getInstance()
    .getRigidbodyNumericalProp('mass', gameObjectIdentifier);
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
export function set_mass(gameObjectIdentifier : GameObjectIdentifier, mass : number) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkParameterType(mass, 'number');
  getInstance()
    .setRigidbodyNumericalProp('mass', gameObjectIdentifier, mass);
}

/**
 * Returns the velocity of the rigidbody attached on the GameObject.
 *
 * Usage of all physics functions under the Physics - Rigidbody category requires calling `apply_rigidbody` first on the applied game objects.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to get velocity for.
 * @return the velocity at this moment represented in a Vector3.
 * @category Physics - Rigidbody
 */
export function get_velocity(gameObjectIdentifier : GameObjectIdentifier) : Vector3 {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  return getInstance()
    .getRigidbodyVelocityVector3Prop('velocity', gameObjectIdentifier);
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
export function set_velocity(gameObjectIdentifier : GameObjectIdentifier, velocity : Vector3) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkVector3Parameter(velocity);
  getInstance()
    .setRigidbodyVelocityVector3Prop('velocity', gameObjectIdentifier, velocity);
}

/**
 * Returns the angular velocity of the rigidbody attached on the game object.
 *
 * Usage of all physics functions under the Physics - Rigidbody category requires calling `apply_rigidbody` first on the applied game objects.
 *
 * **2D Mode Special: **In 2D mode there is no angular velocity on X nor Y axis, so in the X and Y values in the returned Vector3 will always be zero.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to get angular velocity for.
 * @return the angular velocity at this moment represented in a Vector3.
 * @category Physics - Rigidbody
 */
export function get_angular_velocity(gameObjectIdentifier : GameObjectIdentifier) : Vector3 {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  return getInstance()
    .getRigidbodyVelocityVector3Prop('angularVelocity', gameObjectIdentifier);
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
export function set_angular_velocity(gameObjectIdentifier : GameObjectIdentifier, angularVelocity : Vector3) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkVector3Parameter(angularVelocity);
  getInstance()
    .setRigidbodyVelocityVector3Prop('angularVelocity', gameObjectIdentifier, angularVelocity);
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
export function set_drag(gameObjectIdentifier : GameObjectIdentifier, value: number) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkParameterType(value, 'number');
  getInstance()
    .setRigidbodyNumericalProp('drag', gameObjectIdentifier, value);
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
export function set_angular_drag(gameObjectIdentifier : GameObjectIdentifier, value: number) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkParameterType(value, 'number');
  getInstance()
    .setRigidbodyNumericalProp('angularDrag', gameObjectIdentifier, value);
}

/**
 * Set whether the rigidbody attached on the game object should calculate for gravity.
 *
 * Usage of all physics functions under the Physics - Rigidbody category requires calling `apply_rigidbody` first on the applied game objects.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to enable/disable gravity on its rigidbody.
 * @param {useGravity} Set to true if you want gravity to be applied on this rigidbody, false otherwise.
 * @category Physics - Rigidbody
 */
export function set_use_gravity(gameObjectIdentifier : GameObjectIdentifier, useGravity : boolean) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkParameterType(useGravity, 'boolean');
  getInstance()
    .setUseGravityInternal(gameObjectIdentifier, useGravity);
}


/**
 * Add an impulse force on the Rigidbody attached on the GameObject, **using its mass**.
 *
 * Usage of all physics functions under the Physics category requires calling `apply_rigidbody` first on the applied game objects.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to add the force.
 * @param The force vector.
 * @category Physics - Rigidbody
 */
export function add_impulse_force(gameObjectIdentifier : GameObjectIdentifier, force : Vector3) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkVector3Parameter(force);
  getInstance()
    .addImpulseForceInternal(gameObjectIdentifier, force);
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
export function remove_collider_components(gameObjectIdentifier : GameObjectIdentifier) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  getInstance()
    .removeColliderComponentsInternal(gameObjectIdentifier);
}

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
export function on_collision_enter(gameObjectIdentifier : GameObjectIdentifier, eventFunction : Function) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkParameterType(eventFunction, 'function');
  getInstance()
    .setOnCollisionEnterInternal(gameObjectIdentifier, eventFunction);
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
export function on_collision_stay(gameObjectIdentifier : GameObjectIdentifier, eventFunction : Function) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkParameterType(eventFunction, 'function');
  getInstance()
    .setOnCollisionStayInternal(gameObjectIdentifier, eventFunction);
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
export function on_collision_exit(gameObjectIdentifier : GameObjectIdentifier, eventFunction : Function) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkParameterType(eventFunction, 'function');
  getInstance()
    .setOnCollisionExitInternal(gameObjectIdentifier, eventFunction);
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
export function gui_label(text : string, x : number, y : number) : void {
  checkUnityAcademyExistence();
  checkParameterType(text, 'string');
  checkParameterType(x, 'number');
  checkParameterType(y, 'number');
  getInstance()
    .onGUI_Label(text, x, y);
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
export function gui_button(text : string, x: number, y : number, width : number, height : number, onClick : Function) : void {
  checkUnityAcademyExistence();
  checkParameterType(text, 'string');
  checkParameterType(x, 'number');
  checkParameterType(y, 'number');
  checkParameterType(width, 'number');
  checkParameterType(height, 'number');
  checkParameterType(onClick, 'function');
  getInstance()
    .onGUI_Button(text, x, y, width, height, onClick);
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
 * @return The GameObject idenfitier for the main camera following target GameObject.
 * @category Camera
 * @category Outside Lifecycle
 */
export function get_main_camera_following_target() : GameObjectIdentifier {
  checkUnityAcademyExistence();
  return getInstance()
    .getGameObjectIdentifierForPrimitiveGameObject('MainCameraFollowingTarget');
}


/**
 * Request for main camera control and get a GameObject identifier that can directly be used to control the main camera's position and rotation.
 *
 * When you request for the direct control over main camera with this function, the default camera controllers will be disabled, thus the GameObject identifier returned by `get_main_camera_following_target` will become useless, as you can no longer use the default main camera controllers.
 *
 * This function is for totally customizing the position and rotation of the main camera. If you'd like to simplify the camera controlling with the help of the default camera controllers in Unity Academy, please consider use `get_main_camera_following_target` function.
 *
 * @return The GameObject identifier that can directly be used to control the main camera's position and rotation
 * @category Camera
 * @category Outside Lifecycle
 */
export function request_for_main_camera_control() : GameObjectIdentifier {
  checkUnityAcademyExistence();
  return getInstance()
    .requestForMainCameraControlInternal();
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
export function set_custom_prop(gameObjectIdentifier : GameObjectIdentifier, propName : string, value : any) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkParameterType(propName, 'string');
  getInstance()
    .setCustomPropertyInternal(gameObjectIdentifier, propName, value);
}

/**
 * Get the value of a custom property with its name on a GameObject
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to get the custom property on.
 * @param propName The name (a string) of the custom property
 *
 * @return The value of the custom property with the given name on the given GameObject. If the property value is not set, this function will return `undefined`.
 *
 * @category Common
 */
export function get_custom_prop(gameObjectIdentifier : GameObjectIdentifier, propName : string) : any {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkParameterType(propName, 'string');
  return getInstance()
    .getCustomPropertyInternal(gameObjectIdentifier, propName);
}

/**
 * Create a 3D vector
 * @param x The x component of the new vector
 * @param y The y component of the new vector
 * @param z The z component of the new vector
 *
 * @return The 3D vector (x, y, z)
 *
 * @category Maths
 */
export function vector3(x : number, y : number, z : number) : Vector3 {
  checkParameterType(x, 'number');
  checkParameterType(y, 'number');
  checkParameterType(z, 'number');
  return makeVector3D(x, y, z);
}

/**
 * Get the X component of a 3D vector
 * @param vector The 3D vector
 *
 * @return The X component of the given vector
 *
 * @category Maths
 */
export function get_x(vector : Vector3) : number {
  checkVector3Parameter(vector);
  return vector.x;
}

/**
 * Get the Y component of a 3D vector
 * @param vector The 3D vector
 *
 * @return The Y component of the given vector
 *
 * @category Maths
 */
export function get_y(vector : Vector3) : number {
  checkVector3Parameter(vector);
  return vector.y;
}

/**
 * Get the Z component of a 3D vector
 * @param vector The 3D vector
 *
 * @return The Z component of the given vector
 *
 * @category Maths
 */
export function get_z(vector : Vector3) : number {
  checkVector3Parameter(vector);
  return vector.z;
}

/**
 * Scales a 3D vector with the given factor.
 * @param vector The original vector
 * @param factor The scaling factor.
 * @return The scaled vector
 *
 * @category Maths
 */
export function scale_vector(vector : Vector3, factor : number) : Vector3 {
  checkVector3Parameter(vector);
  checkParameterType(factor, 'number');
  return scaleVector(vector, factor);
}

/**
 * Add two 3D vectors together.
 * @param vectorA The first vector
 * @param vectorB The second vector.
 * @return The sum of the two vectors
 *
 * @category Maths
 */
export function add_vectors(vectorA : Vector3, vectorB : Vector3) : Vector3 {
  checkVector3Parameter(vectorA);
  checkVector3Parameter(vectorB);
  return addVectors(vectorA, vectorB);
}

/**
 * Calcuate the vector difference between two vectors (vectorA - vectorB).
 * @param vectorA The minuend vector.
 * @param vectorB The subtrahend vector.
 * @return The result for vectorA - vectorB
 *
 * @category Maths
 */
export function vector_difference(vectorA : Vector3, vectorB : Vector3) : Vector3 {
  checkVector3Parameter(vectorA);
  checkVector3Parameter(vectorB);
  return vectorDifference(vectorA, vectorB);
}

/**
 * Calcuate the dot product of two 3D vectors.
 * @param vectorA The first vector
 * @param vectorB The second vector.
 * @return The dot product
 *
 * @category Maths
 */
export function dot(vectorA : Vector3, vectorB : Vector3) : number {
  checkVector3Parameter(vectorA);
  checkVector3Parameter(vectorB);
  return dotProduct(vectorA, vectorB);
}

/**
 * Calcuate the cross product of two 3D vectors.
 * @param vectorA The first vector
 * @param vectorB The second vector.
 * @return The cross product
 *
 * @category Maths
 */
export function cross(vectorA : Vector3, vectorB : Vector3) : Vector3 {
  checkVector3Parameter(vectorA);
  checkVector3Parameter(vectorB);
  return crossProduct(vectorA, vectorB);
}

/**
 * Normalize a vector. The returned vector will have the same direction as the original vector but have a magnitude of 1.
 * @param vector The original vector
 * @return The normalized vector. This function will return a zero vector if the original vector is a zero vector.
 *
 * @category Maths
 */
export function normalize(vector : Vector3) : Vector3 {
  checkVector3Parameter(vector);
  return normalizeVector(vector);
}

/**
 * Calcuate the magnitude of a vector
 * @param vector The vector
 * @return The magnitude of the vector
 *
 * @category Maths
 */
export function magnitude(vector : Vector3) : number {
  checkVector3Parameter(vector);
  return vectorMagnitude(vector);
}

/**
 * Get the zero vector
 * @return The zero vector
 *
 * @category Maths
 */
export function zero_vector() : Vector3 {
  return zeroVector();
}

/**
 * Calcuate the distance between two 3D points
 *
 * @param pointA The first point
 * @param pointB The second point
 *
 * @return The value of the distance between the two points
 *
 * @category Maths
 */
export function point_distance(pointA : Vector3, pointB : Vector3) : number {
  checkVector3Parameter(pointA);
  checkVector3Parameter(pointB);
  return pointDistance(pointA, pointB);
}



/**
 *
 * Documentation TODO
 *
 * @category Sound / Audio
 * @category Outside Lifecycle
 */
export function load_audio_clip_mp3(audioUrl: string) : AudioClipIdentifier {
  checkUnityAcademyExistence();
  checkParameterType(audioUrl, 'string');
  return getInstance()
    .loadAudioClipInternal(audioUrl, 'mp3');
}

/**
 *
 * Documentation TODO
 *
 * @category Sound / Audio
 * @category Outside Lifecycle
 */
export function load_audio_clip_ogg(audioUrl: string) : AudioClipIdentifier {
  checkUnityAcademyExistence();
  checkParameterType(audioUrl, 'string');
  return getInstance()
    .loadAudioClipInternal(audioUrl, 'ogg');
}

/**
 *
 * Documentation TODO
 *
 * @category Sound / Audio
 * @category Outside Lifecycle
 */
export function load_audio_clip_wav(audioUrl: string) : AudioClipIdentifier {
  checkUnityAcademyExistence();
  checkParameterType(audioUrl, 'string');
  return getInstance()
    .loadAudioClipInternal(audioUrl, 'wav');
}

/**
 *
 * Create an audio source GameObject
 *
 * The audio source GameObject can be used to play an audio clip with audio functions. But it's basically a regular GameObject with extra data for audio playing.
 * So you can still use the audio source as a regular GameObject, like setting its position with `set_position`, using `set_start` and `set_update` to set its `Start` and `Update` funtions, etc.
 *
 * @param audioClip the audio clip that you want to use for this audio source
 * @return the identifier of the newly created GameObject
 *
 * @category Sound / Audio
 * @category Outside Lifecycle
 */
export function instantiate_audio_source(audioClip : AudioClipIdentifier) : GameObjectIdentifier {
  // todo: check audio clip identifier type
  checkUnityAcademyExistence();
  return getInstance()
    .instantiateAudioSourceInternal(audioClip);
}

/**
 *
 * Start / resume playing the audio of an audio source
 *
 * @param audioSrc the GameObject identifier for the audio source
 *
 * @category Sound / Audio
 */
export function play_audio(audioSrc : GameObjectIdentifier) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(audioSrc);
  getInstance()
    .setAudioSourceProp('isPlaying', audioSrc, true);
}

/**
 *
 * Pause the audio of an audio source
 *
 * @param audioSrc the GameObject identifier for the audio source
 *
 * @category Sound / Audio
 */
export function pause_audio(audioSrc : GameObjectIdentifier) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(audioSrc);
  getInstance()
    .setAudioSourceProp('isPlaying', audioSrc, false);
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
export function set_audio_play_speed(audioSrc : GameObjectIdentifier, speed : number) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(audioSrc);
  checkParameterType(speed, 'number');
  getInstance()
    .setAudioSourceProp('playSpeed', audioSrc, speed);
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
export function get_audio_play_progress(audioSrc : GameObjectIdentifier) : number {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(audioSrc);
  return getInstance()
    .getAudioSourceProp('playProgress', audioSrc);
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
export function set_audio_play_progress(audioSrc : GameObjectIdentifier, progress : number) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(audioSrc);
  checkParameterType(progress, 'number');
  getInstance()
    .setAudioSourceProp('playProgress', audioSrc, progress);
}

/**
 *
 * @category Sound / Audio
 */
export function change_audio_clip(audioSrc : GameObjectIdentifier, newAudioClip : AudioClipIdentifier) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(audioSrc);
  // todo: check audio clip identifier type
  getInstance()
    .setAudioSourceProp('audioClipIdentifier', audioSrc, newAudioClip);
}

/**
 *
 * @category Sound / Audio
 */
export function set_audio_looping(audioSrc : GameObjectIdentifier, looping : boolean) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(audioSrc);
  checkParameterType(looping, 'boolean');
  getInstance()
    .setAudioSourceProp('isLooping', audioSrc, looping);
}

/**
 *
 * @category Sound / Audio
 */
export function set_audio_volume(audioSrc : GameObjectIdentifier, volume : number) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(audioSrc);
  checkParameterType(volume, 'number');
  getInstance()
    .setAudioSourceProp('volume', audioSrc, volume);
}

/**
 *
 * @category Sound / Audio
 */
export function is_audio_playing(audioSrc : GameObjectIdentifier) : boolean {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(audioSrc);
  return getInstance()
    .getAudioSourceProp('isPlaying', audioSrc);
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
export function debug_log(content : any) : void {
  checkUnityAcademyExistence();
  const contentStr = content.toString();
  getInstance()
    .studentLogger(contentStr, 'log');
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
export function debug_logwarning(content : any) : void {
  checkUnityAcademyExistence();
  const contentStr = content.toString();
  getInstance()
    .studentLogger(contentStr, 'warning');
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
export function debug_logerror(content : any) : void {
  checkUnityAcademyExistence();
  const contentStr = content.toString();
  getInstance()
    .studentLogger(contentStr, 'error');
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
  checkUnityAcademyExistence();
  checkParameterType(positionX, 'number');
  checkParameterType(positionY, 'number');
  checkParameterType(positionZ, 'number');
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
export function play_audio_clip_3d_sound(audioClip : AudioClipIdentifier, volume: number, loop: boolean, positionX: number, positionY: number, positionZ: number) {
  // todo: check audio clip identifier type
  checkUnityAcademyExistence();
  checkParameterType(volume, 'number');
  checkParameterType(loop, 'boolean');
  checkParameterType(positionX, 'number');
  checkParameterType(positionY, 'number');
  checkParameterType(positionZ, 'number');
  // TODO
}
