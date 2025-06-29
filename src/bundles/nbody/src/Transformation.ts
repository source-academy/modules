import { BodyCenterTransformation, CoMTransformation, LambdaTransformation, PinTransformation, RotateTransformation, TimedRotateTransformation, type State, type Transformation, type Vector3 } from 'nbody';

/**
 * Create a frame of reference transformation that moves the origin to the center of ith both.
 * @param i The index of the body to center on.
 * @returns A new body center transformation.
 * @category Transformations
 */
export function createBodyCenterTransformation(i?: number): BodyCenterTransformation {
  return new BodyCenterTransformation(i);
}

/**
 * Create a frame of reference transformation that moves the origin to the center of mass of the system.
 * @returns A new center of mass transformation.
 * @category Transformations
 */
export function createCoMTransformation(): CoMTransformation {
  return new CoMTransformation();
}

/**
 * Create a frame of reference transformation that rotates the system around an axis by an angle.
 * @param axis The axis to rotate around.
 * @param angle The angle to rotate by.
 * @returns A new rotate transformation.
 * @category Transformations
 */
export function createRotateTransformation(axis: Vector3, angle: number): RotateTransformation {
  return new RotateTransformation(axis, angle);
}

/**
 * Create a frame of reference transformation using a higher order/lambda/arrow/anonymous function.
 * @param fn A function that takes a state and returns a new transformed state.
 * @returns A new lambda transformation.
 * @category Transformations
 */
export function createLambdaTransformation(fn: (state: State) => State): LambdaTransformation {
  return new LambdaTransformation(fn);
}

/**
 * Create a frame of reference transformation that pins the ith body to a specific axis.
 * @param axis The axis to pin the body to.
 * @param i The index of the body to pin.
 * @returns A new pin transformation.
 * @category Transformations
 */
export function createPinTransformation(axis: Vector3, i?: number): PinTransformation {
  return new PinTransformation(axis, i);
}

/**
 * Create a frame of reference transformation that rotates the system by 360 deg around an axis over a period of time.
 * @param axis axis to rotate around.
 * @param revolutionTime time taken to complete one revolution.
 * @returns A new timed rotate transformation.
 * @category Transformations
 */
export function createTimedRotateTransformation(axis: Vector3, revolutionTime: number): TimedRotateTransformation {
  return new TimedRotateTransformation(axis, revolutionTime);
}

/**
 * Transform a state using a transformation.
 * @param s The state to transform.
 * @param t The transformation to apply.
 * @returns The transformed state.
 * @category Transformations
 */
export function transformState(s: State, t: Transformation): State {
  return t.transform(s, 0);
}
