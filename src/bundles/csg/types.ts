// let controls = _controls.orbit;
















/* [Exports] */

// @jscad\regl-renderer\src\controls\orbitControls.js
// export type Controls = Omit<
//   typeof controls,
//   'update' | 'zoomToFit' | 'rotate' | 'pan'
// > & {
//   update: ControlsUpdate.Function;
//   zoomToFit: ControlsZoomToFit.Function;
//   rotate: ControlsRotate;
//   pan: ControlsPan;
// };
// export namespace ControlsUpdate {
//   export type Function = (options: Options) => Output;

//   export type Options = {
//     controls: ControlsState;
//     camera: CameraState;
//   };

//   export type Output = {
//     controls: {
//       thetaDelta: number;
//       phiDelta: number;
//       scale: number;
//       changed: boolean;
//     };
//     camera: {
//       position: CoordinatesXYZ;
//       view: Mat4;
//     };
//   };
// }
// export namespace ControlsZoomToFit {
//   export type Function = (options: Options) => Output;

//   export type Options = {
//     controls: ControlsState;
//     camera: CameraState;
//     entities: GeometryEntity[];
//   };

//   export type Output = {
//     camera: {
//       target: VectorXYZ;
//     };
//     controls: {
//       scale: number;
//     };
//   };
// }
// export type ControlsRotate = (
//   options: {
//     controls: ControlsState;
//     camera: CameraState;
//     speed?: number;
//   },
//   rotateAngles: Numbers2
// ) => {
//   controls: {
//     thetaDelta: number;
//     phiDelta: number;
//   };
//   camera: CameraState;
// };
// export type ControlsPan = (
//   options: {
//     controls: ControlsState;
//     camera: CameraState;
//     speed?: number;
//   },
//   rotateAngles: Numbers2
// ) => {
//   controls: ControlsState;
//   camera: {
//     position: CoordinatesXYZ;
//     target: VectorXYZ;
//   };
// };
