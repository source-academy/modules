/**
 * Functions for Source Academy's Unity Academy module
 * @module unity_academy
 * @author Wang Zihan
 */


import { initializeModule, getInstance, type GameObjectIdentifier } from './UnityAcademy';


/**
 * Load and initialize Unity Academy WebGL player and set it to 2D mode. All other functions in this module requires calling this function or init_unity_academy_3d first.<br>
 * I recommand you just call this function at the beginning of your Source Unity program under the 'import' statements.
 *
 * @category Application Initialization
 * @category Outside Lifecycle
 */
export function init_unity_academy_2d() : void {
  initializeModule('2d');
}

/**
 * Load and initialize Unity Academy WebGL player and set it to 3D mode. All other functions in this module requires calling this function or init_unity_academy_2d first.<br>
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
 * <br><b>3D mode only</b>
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
 * Creates a new 2D Sprite GameObject from an online image.<br>
 * The Sprite GameObject has a BoxCollider2D that matches its size by default. You may use `remove_collider_components` function to remove the default collider.<br><br>
 * Note that Unity Academy will use a HTTP GET request to download the image, which means that the HTTP response from the URL must allows CORS.<br><br>
 * <br><b>2D mode only</b>
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
 * Creates a new empty GameObject.<br>
 * <br>
 * An empty GameObject is invisible and only have transform properties by default.<br>
 * You may use the empty GameObject to run some general game management code or use the position of the empty GameObject to represent a point in the scene that the rest of your codes can access and utilize.
 *
 * @return the identifier of the newly created GameObject
 *
 * @category Common
 * @category Outside Lifecycle
 */
export function instantiate_empty() : GameObjectIdentifier {
  checkUnityAcademyExistence();
  checkIs3DMode();
  return getInstance()
    .instantiateEmptyGameObjectInternal();
}

/**
 * Returns the value of Time.deltaTime in Unity ( roughly saying it's about `1 / instant frame rate` )<br>
 * This should be useful when implementing timers or constant speed control in Update function.<br>
 * For example:
 * ```
 * function update(gameObject){
 *     const move_speed = 3;
 *     translate_world(gameObject, 0, 0, move_speed * delta_time());
 * }
 * ```
 * By assigning the above code to a GameObject with `set_update`, that GameObject will move in a constant speed of 3 units along world +Z axis, ignoring the affect of unstable instant frame rate.
 * <br>
 * <br>
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
 * Remove a GameObject<br>
 * Note that this won't remove the GameObject immediately, the actual removal will happen at the end of the current main cycle loop.<br>
 * <br>
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
 * Set the target frame rate of Unity Academy. The frame rate should be an integer between 1 and 30. The default value is 30.
 *
 * @category Basics
 */
/* export function set_target_fps(frameRate : number) {
  checkUnityEngineStatus();
  return getInstance()
    .setTargetFrameRate(frameRate);
}*/

/**
 * Returns the world position of a given GameObject
 * @param gameObjectIdentifier The identifier for the GameObject that you want to get position for.
 * @return the position represented in an array with three elements: [x, y, z]
 *
 * @category Transform
 */
export function get_position(gameObjectIdentifier : GameObjectIdentifier) : Array<Number> {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  return getInstance()
    .getGameObjectTransformProp('position', gameObjectIdentifier);
}

/**
 * Set the world position of a given GameObject
 * @param gameObjectIdentifier The identifier for the GameObject that you want to change position for.
 * @param x The x component for the position.
 * @param y The y component for the position.
 * @param z The z component for the position.
 *
 * @category Transform
 */
export function set_position(gameObjectIdentifier : GameObjectIdentifier, x : number, y : number, z : number) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkParameterType(x, 'number');
  checkParameterType(y, 'number');
  checkParameterType(z, 'number');
  return getInstance()
    .setGameObjectTransformProp('position', gameObjectIdentifier, x, y, z);
}

/**
 * Returns the world Euler angle rotation of a given GameObject
 * @param gameObjectIdentifier The identifier for the GameObject that you want to get rotation for.
 * @return the Euler angle rotation represented in an array with three elements: [x, y, z]
 *
 * @category Transform
 */
export function get_rotation_euler(gameObjectIdentifier : GameObjectIdentifier) : Array<Number> {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  return getInstance()
    .getGameObjectTransformProp('rotation', gameObjectIdentifier);
}

/**
 * Set the world rotation of a given GameObject with given Euler angle rotation.
 * @param gameObjectIdentifier The identifier for the GameObject that you want to change rotation for.
 * @param x The x component (Euler angle) for the rotation.
 * @param y The y component (Euler angle) for the rotation.
 * @param z The z component (Euler angle) for the rotation.
 *
 * @category Transform
 */
export function set_rotation_euler(gameObjectIdentifier : GameObjectIdentifier, x : number, y : number, z : number) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkParameterType(x, 'number');
  checkParameterType(y, 'number');
  checkParameterType(z, 'number');
  return getInstance()
    .setGameObjectTransformProp('rotation', gameObjectIdentifier, x, y, z);
}

/**
 * Returns the scale of a given GameObject
 * @param gameObjectIdentifier The identifier for the GameObject that you want to get scale for.
 * @return the scale represented in an array with three elements: [x, y, z]
 *
 * @category Transform
 */
export function get_scale(gameObjectIdentifier : GameObjectIdentifier) : Array<Number> {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  return getInstance()
    .getGameObjectTransformProp('scale', gameObjectIdentifier);
}

/**
 * Set the scale of a given GameObject
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to change scale for.
 * @param x The x component for the scale.
 * @param y The y component for the scale.
 * @param z The z component for the scale.
 *
 * @category Transform
 */
export function set_scale(gameObjectIdentifier : GameObjectIdentifier, x : number, y : number, z : number) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkParameterType(x, 'number');
  checkParameterType(y, 'number');
  checkParameterType(z, 'number');
  return getInstance()
    .setGameObjectTransformProp('scale', gameObjectIdentifier, x, y, z);
}

/**
 * Moves a GameObject with given x, y and z values
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to translate.
 * @param x The value you want to move along X-axis in the world space
 * @param y The value you want to move along Y-axis in the world space
 * @param z The value you want to move along Z-axis in the world space
 *
 * @category Transform
 */
export function translate_world(gameObjectIdentifier : GameObjectIdentifier, x: number, y : number, z : number) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkParameterType(x, 'number');
  checkParameterType(y, 'number');
  checkParameterType(z, 'number');
  return getInstance()
    .translateWorldInternal(gameObjectIdentifier, x, y, z);
}

/**
 * Moves a GameObject with given x, y and z values, <b>with respect to its local space</b>.<br>
 * The current rotation of the GameObject will affect the real direction of movement.<br>
 * In Unity, usually, the direction of +Z axis denotes forward.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to translate.
 * @param x The value you want to move along X-axis in the local space
 * @param y The value you want to move along Y-axis in the local space
 * @param z The value you want to move along Z-axis in the local space
 *
 * @category Transform
 */
export function translate_local(gameObjectIdentifier : GameObjectIdentifier, x: number, y : number, z : number) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkParameterType(x, 'number');
  checkParameterType(y, 'number');
  checkParameterType(z, 'number');
  return getInstance()
    .translateLocalInternal(gameObjectIdentifier, x, y, z);
}

/**
 * Rotates a GameObject with given x, y and z values (Euler angle)
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to rotate.
 * @param x The value you want to rotate along X-axis in the world space
 * @param y The value you want to rotate along Y-axis in the world space
 * @param z The value you want to rotate along Z-axis in the world space
 *
 * @category Transform
 */
export function rotate_world(gameObjectIdentifier : GameObjectIdentifier, x: number, y : number, z : number) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkParameterType(x, 'number');
  checkParameterType(y, 'number');
  checkParameterType(z, 'number');
  return getInstance()
    .rotateWorldInternal(gameObjectIdentifier, x, y, z);
}

/**
 * Copy the position values from one GameObject to another GameObject along with delta values.<br><br>
 * Set the delta parameters to `Infinity` or `-Infinity` to remain the position of the destination GameObject on the corresponding axis unaffected.<br>
 *
 * @param from The identifier for the GameObject that you want to copy position from.
 * @param to The identifier for the GameObject that you want to copy position to.
 * @param delta_x This value will be added to the copied value when coping the X-coordinate position value to the destination GameObject
 * @param delta_y This value will be added to the copied value when coping the Y-coordinate position value to the destination GameObject
 * @param delta_z This value will be added to the copied value when coping the Z-coordinate position value to the destination GameObject
 *
 * @category Transform
 */
export function copy_position(from : GameObjectIdentifier, to : GameObjectIdentifier, delta_x : number, delta_y : number, delta_z : number) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(from);
  checkGameObjectIdentifierParameter(to);
  checkParameterType(delta_x, 'number', true);
  checkParameterType(delta_y, 'number', true);
  checkParameterType(delta_z, 'number', true);
  return getInstance()
    .copyTransformPropertiesInternal('position', from, to, delta_x, delta_y, delta_z);
}

/**
 * Copy the rotation values (Euler angles) from one GameObject to another GameObject along with delta values.<br><br>
 * Set the delta parameters to `Infinity` or `-Infinity` to remain the rotation of the destination GameObject on the corresponding axis unaffected.<br>
 *
 * @param from The identifier for the GameObject that you want to copy rotation from.
 * @param to The identifier for the GameObject that you want to copy rotation to.
 * @param delta_x This value will be added to the copied value when coping the X-coordinate rotation value to the destination GameObject
 * @param delta_y This value will be added to the copied value when coping the Y-coordinate rotation value to the destination GameObject
 * @param delta_z This value will be added to the copied value when coping the Z-coordinate rotation value to the destination GameObject
 *
 * @category Transform
 */
export function copy_rotation(from : GameObjectIdentifier, to : GameObjectIdentifier, delta_x : number, delta_y : number, delta_z : number) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(from);
  checkGameObjectIdentifierParameter(to);
  checkParameterType(delta_x, 'number', true);
  checkParameterType(delta_y, 'number', true);
  checkParameterType(delta_z, 'number', true);
  return getInstance()
    .copyTransformPropertiesInternal('rotation', from, to, delta_x, delta_y, delta_z);
}

/**
 * Copy the scale values from one GameObject to another GameObject along with delta values.<br><br>
 * Set the delta parameters to `Infinity` or `-Infinity` to remain the scale of the destination GameObject on the corresponding axis unaffected.<br>
 *
 * @param from The identifier for the GameObject that you want to copy scale from.
 * @param to The identifier for the GameObject that you want to copy scale to.
 * @param delta_x This value will be added to the copied value when coping the X-coordinate scale value to the destination GameObject
 * @param delta_y This value will be added to the copied value when coping the Y-coordinate scale value to the destination GameObject
 * @param delta_z This value will be added to the copied value when coping the Z-coordinate scale value to the destination GameObject
 *
 * @category Transform
 */
export function copy_scale(from : GameObjectIdentifier, to : GameObjectIdentifier, delta_x : number, delta_y : number, delta_z : number) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(from);
  checkGameObjectIdentifierParameter(to);
  checkParameterType(delta_x, 'number', true);
  checkParameterType(delta_y, 'number', true);
  checkParameterType(delta_z, 'number', true);
  return getInstance()
    .copyTransformPropertiesInternal('scale', from, to, delta_x, delta_y, delta_z);
}

function checkKeyCodeValidityAndToLowerCase(keyCode : string) : string {
  if (typeof (keyCode) !== 'string') throw new Error(`Key code must be a string! Given type: ${typeof (keyCode)}`);
  if (keyCode === 'LeftMouseBtn' || keyCode === 'RightMouseBtn' || keyCode === 'MiddleMouseBtn' || keyCode === 'LeftShift' || keyCode === 'RightShift') return keyCode;
  keyCode = keyCode.toLowerCase();
  if (keyCode.length !== 1) throw new Error(`Key code must be either a string of length 1 or one among 'LeftMouseBtn', 'RightMouseBtn', 'MiddleMouseBtn', 'LeftShift' or 'RightShift'! Given length: ${keyCode.length}`);
  const char = keyCode.charAt(0);
  if (!((char >= 'a' && char <= 'z') || (char >= '0' && char <= '9'))) {
    throw new Error(`Key code must be either a letter between A-Z or a-z or 0-9 or one among 'LeftMouseBtn', 'RightMouseBtn', 'MiddleMouseBtn', 'LeftShift' or 'RightShift'! Given: ${keyCode}`);
  }
  return keyCode;
}

/**
 * When user presses a key on the keyboard or mouse button, this function will return true only at the frame when the key is just pressed down and return false afterwards.
 * <br>
 * <br>
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
 * <br>
 * <br>
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
 * <br>
 * <br>
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
 * Plays an Unity animation state with given name on the GameObject's animator. Note that not all game objects have Unity animations. You should ask the people who provided you the prefab asset bundle for available animation names assigned to the prefab.<br><br>
 * If you provide an invalid animator state name, this function will not take effect.<br><br>
 * <b>3D mode only</b><br><br>
 * [For Prefab Authors] Please follow these conventions if you are making humanoid prefabs (for example: any human-like characters): Name the standing animation state as "Idle" and name the walking animation state as "Walk" in Unity Animator.<br>
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
 * Apply rigidbody (2D or 3D based on the current dimension mode) to the given game object to use Unity's physics engine<br>
 * <br><br>All other functions under the Physics - Rigidbody category require calling this function first on the applied game objects.
 * <br>
 * <br>
 * For more information, see
 * <br>https://docs.unity3d.com/ScriptReference/Rigidbody.html (For 3D Mode) or
 * <br>https://docs.unity3d.com/ScriptReference/Rigidbody2D.html (For 2D Mode)
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
 * Returns the mass of the rigidbody attached on the game object.
 * <br><br>Usage of all physics functions under the Physics - Rigidbody category requires calling `apply_rigidbody` first on the applied game objects.
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
 * <br><br>Usage of all physics functions under the Physics - Rigidbody category requires calling `apply_rigidbody` first on the applied game objects.
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
 * Returns the velocity of the rigidbody attached on the game object.
 * <br><br>Usage of all physics functions under the Physics - Rigidbody category requires calling `apply_rigidbody` first on the applied game objects.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to get velocity for.
 * @return the velocity at this moment represented in an array with three elements: [x, y, z]
 * @category Physics - Rigidbody
 */
export function get_velocity(gameObjectIdentifier : GameObjectIdentifier) : Array<number> {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  return getInstance()
    .getRigidbodyVelocityVector3Prop('velocity', gameObjectIdentifier);
}

/**
 * Set the (linear) velocity of the rigidbody attached on the game object.
 * <br><br>Usage of all physics functions under the Physics - Rigidbody category requires calling `apply_rigidbody` first on the applied game objects.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to change velocity for.
 * @param x The x component of the velocity vector.
 * @param y The y component of the velocity vector.
 * @param z The z component of the velocity vector.
 * @category Physics - Rigidbody
 */
export function set_velocity(gameObjectIdentifier : GameObjectIdentifier, x: number, y: number, z: number) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkParameterType(x, 'number');
  checkParameterType(y, 'number');
  checkParameterType(z, 'number');
  getInstance()
    .setRigidbodyVelocityVector3Prop('velocity', gameObjectIdentifier, x, y, z);
}

/**
 * Returns the angular velocity of the rigidbody attached on the game object.
 * <br><br>Usage of all physics functions under the Physics - Rigidbody category requires calling `apply_rigidbody` first on the applied game objects.
 * <br><br><b>2D Mode Special: </b>In 2D mode there is no angular velocity on X nor Y axis, so in the first two elements for the returned array will always be zero.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to get angular velocity for.
 * @return the angular velocity at this moment represented in an array with three elements: [x, y, z]
 * @category Physics - Rigidbody
 */
export function get_angular_velocity(gameObjectIdentifier : GameObjectIdentifier) : Array<number> {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  return getInstance()
    .getRigidbodyVelocityVector3Prop('angularVelocity', gameObjectIdentifier);
}

/**
 * Set the angular velocity of the rigidbody attached on the game object.
 * <br><br>Usage of all physics functions under the Physics - Rigidbody category requires calling `apply_rigidbody` first on the applied game objects.
 * <br><br><b>2D Mode Special: </b>In 2D mode there is no angular velocity on X nor Y axis, so the value of the first two parameters for this function is ignored.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to change angular velocity for.
 * @param x The x component of the angular velocity vector.
 * @param y The y component of the angular velocity vector.
 * @param z The z component of the angular velocity vector.
 * @category Physics - Rigidbody
 */
export function set_angular_velocity(gameObjectIdentifier : GameObjectIdentifier, x: number, y: number, z: number) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkParameterType(x, 'number');
  checkParameterType(y, 'number');
  checkParameterType(z, 'number');
  getInstance()
    .setRigidbodyVelocityVector3Prop('angularVelocity', gameObjectIdentifier, x, y, z);
}

/**
 * Set the drag (similar to air resistance) the rigidbody attached on the game object.<br>
 * By default the drag is zero
 * <br><br>Usage of all physics functions under the Physics - Rigidbody category requires calling `apply_rigidbody` first on the applied game objects.
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
 * Set the angular drag (similar to an air resistance that affects angular velocity) the rigidbody attached on the game object.<br>
 * By default the angular drag is 0.05
 * <br><br>Usage of all physics functions under the Physics - Rigidbody category requires calling `apply_rigidbody` first on the applied game objects.
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
 * <br><br>Usage of all physics functions under the Physics - Rigidbody category requires calling `apply_rigidbody` first on the applied game objects.
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
 * Add an impulse force on the Rigidbody attached on the GameObject, <b>using its mass</b>.
 * <br><br>Usage of all physics functions under the Physics category requires calling `apply_rigidbody` first on the applied game objects.
 *
 * @param gameObjectIdentifier The identifier for the GameObject that you want to add the force.
 * @param x The x component of the force vector.
 * @param y The y component of the force vector.
 * @param z The z component of the force vector.
 * @category Physics - Rigidbody
 */
export function add_impulse_force(gameObjectIdentifier : GameObjectIdentifier, x: number, y: number, z: number) : void {
  checkUnityAcademyExistence();
  checkGameObjectIdentifierParameter(gameObjectIdentifier);
  checkParameterType(x, 'number');
  checkParameterType(y, 'number');
  checkParameterType(z, 'number');
  getInstance()
    .addImpulseForceInternal(gameObjectIdentifier, x, y, z);
}

/**
 * Removes all collider components directly attached on the given GameObject by default.<br>
 * <br>
 * You can use this function on GameObjects those you don't want them to collide with other GameObjects.<br>
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
 * Set the lifecycle event function that will be called when the collider on this GameObject just starting colliding with another collider.<br>
 * <br>
 * The given function should contain two parameters. The first parameter refers to the binded GameObject and the second parameter refers to the other GameObject that collides with the binded GameObject (both parameters are GameObject identifiers).<br>
 * For example: `const myFunction = (self, other) => {...};`
 * <br>
 * Note that for collision detaction to happen, for the two colliding GameObjects, at least one GameObject should have a Rigidbody / Rigidbody2D component (called `apply_rigidbody` on the GameObject).
 * <br>
 * <br>
 * For more information, see
 * <br>https://docs.unity3d.com/ScriptReference/Collider.OnCollisionEnter.html (For 3D Mode) or
 * <br>https://docs.unity3d.com/ScriptReference/MonoBehaviour.OnCollisionEnter2D.html (For 2D Mode)
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
 * Set the lifecycle event function that will be called per frame when the collider on this GameObject is colliding with another collider.<br>
 * <br>
 * The given function should contain two parameters. The first parameter refers to the binded GameObject and the second parameter refers to the other GameObject that collides with the binded GameObject (both parameters are GameObject identifiers).<br>
 * For example: `const myFunction = (self, other) => {...};`
 * <br>
 * Note that for collision detaction to happen, for the two colliding GameObjects, at least one GameObject should have a Rigidbody / Rigidbody2D component (called `apply_rigidbody` on the GameObject).
 * <br>
 * <br>
 * For more information, see
 * <br>https://docs.unity3d.com/ScriptReference/Collider.OnCollisionStay.html (For 3D Mode) or
 * <br>https://docs.unity3d.com/ScriptReference/MonoBehaviour.OnCollisionStay2D.html (For 2D Mode)
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
 * Set the lifecycle event function that will be called when the collider on this GameObject just stops colliding with another collider.<br>
 * <br>
 * The given function should contain two parameters. The first parameter refers to the binded GameObject and the second parameter refers to the other GameObject that collides with the binded GameObject (both parameters are GameObject identifiers).<br>
 * For example: `const myFunction = (self, other) => {...};`
 * <br>
 * Note that for collision detaction to happen, for the two colliding GameObjects, at least one GameObject should have a Rigidbody / Rigidbody2D component (called `apply_rigidbody` on the GameObject).
 * <br>
 * <br>
 * For more information, see
 * <br>https://docs.unity3d.com/ScriptReference/MonoBehaviour.OnCollisionExit.html (For 3D Mode) or
 * <br>https://docs.unity3d.com/ScriptReference/MonoBehaviour.OnCollisionExit2D.html (For 2D Mode)
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
 * Draw a text (string) on the screen with given screen position.<br>
 * The origin of screen space is upper-left corner and the positive Y axis is downward.<br>
 * You should put this under the `Update` function (or a function that is called by the `Update` function) to keep the text in every frame.
 *
 * @param content The string you want to display on screen.
 * @param x The x coordinate of the text (in screen position).
 * @param y The y coordinate of the text (in screen position).
 * @category Graphical User Interface
 */
export function gui_label(content : string, x : number, y : number) : void {
  checkUnityAcademyExistence();
  checkParameterType(x, 'number');
  checkParameterType(y, 'number');
  getInstance()
    .onGUI_Label(content, x, y);
}


/**
 * Make a button on the screen with given screen position. When user clicks the button, the `onClick` function will be called.<br>
 * The origin of screen space is upper-left corner and the positive Y axis is downward.<br>
 * You should put this under the `Update` function (or a function that is called by the `Update` function) to keep the button in every frame.
 *
 * @param text The text you want to display on the button.
 * @param x The x coordinate of the button (in screen position).
 * @param y The y coordinate of the button (in screen position).
 * @param onClick The function that will be called when user clicks the button on screen.
 * @category Graphical User Interface
 */
export function gui_button(text : string, x: number, y : number, onClick : Function) : void {
  checkUnityAcademyExistence();
  checkParameterType(x, 'number');
  checkParameterType(y, 'number');
  checkParameterType(onClick, 'function');
  getInstance()
    .onGUI_Button(text, x, y, onClick);
}

/**
 * Get the main camera following target GameObject (an invisible GameObject) to use it to control the position of the main camera with the default camera controller.<br><br>
 * <b>In 3D mode</b>, the default camera controller behaves as third-person camera controller, and the center to follow is the following target GameObject. Also, Unity Academy will automatically set the rotation of this "following target" to the same rotation as the current main camera's rotation to let you get the main camera's rotation.<br>
 * <b>In 2D mode</b>, the default camera controller will follow the target GameObject to move, along with a position delta value that you can adjust with the arrow keys on your keyboard.<br><br>
 * The main camera following target GameObject is a primitive GameObject. This means that you are not allowed to destroy it and/or instantiate it during runtime. Multiple calls to this function will return GameObject identifiers that refer to the same primitive GameObject.<br>
 * <br>
 * <br><b>If default main camera controllers are disabled (you have called `request_for_main_camera_control`), then the following target GameObject is useless.</b>
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
 * Request for main camera control and get a GameObject identifier that can directly be used to control the main camera's position and rotation.<br>
 * <br>
 * When you request for the direct control over main camera with this function, the default camera controllers will be disabled, thus the GameObject identifier returned by `get_main_camera_following_target` will become useless, as you can no longer use the default main camera controllers.<br>
 * <br>
 * This function is for totally customizing the position and rotation of the main camera. If you'd like to simplify the camera controlling with the help of the default camera controllers in Unity Academy, please consider use `get_main_camera_following_target` function.<br>
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
