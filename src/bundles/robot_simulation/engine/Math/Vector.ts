export type SimpleVector = { x: number; y: number; z: number };
export type SimpleQuaternion = { x: number; y: number; z: number; w: number };

export type Orientation = {
  position: SimpleVector;
  rotation: SimpleQuaternion;
};

export type Dimension = {
  height: number;
  width: number;
  length: number;
};

// Vector3 and Quaternion already extends SimpleVector and SimpleQuaternion
// so we can just add the interface to the existing declaration
declare module 'three' {
  interface Vector3 extends SimpleVector {}
  interface Quaternion extends SimpleQuaternion {}
}
