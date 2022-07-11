// function doRotate(
//   rotateX: number,
//   rotateY: number,
//   perspectiveCameraState: PerspectiveCameraState,
//   controlsState: ControlsState
// ) {
//   let output = controls.rotate(
//     {
//       controls: controlsState,
//       camera: perspectiveCameraState,
//       speed: 0.0015,
//     },
//     [rotateX, rotateY]
//   );

//   let newControlsState = output.controls;
//   controlsState.thetaDelta = newControlsState.thetaDelta;
//   controlsState.phiDelta = newControlsState.phiDelta;

//   adjustCameraAngle(perspectiveCameraState, controlsState);
// }

// function doPan(
//   panX: number,
//   panY: number,
//   perspectiveCameraState: PerspectiveCameraState,
//   controlsState: ControlsState
// ) {
//   let output = controls.pan(
//     {
//       controls: controlsState,
//       camera: perspectiveCameraState,
//     },
//     [panX, panY * 0.75]
//   );

//   let newCameraState = output.camera;
//   perspectiveCameraState.position = newCameraState.position;
//   perspectiveCameraState.target = newCameraState.target;

//   adjustCameraAngle(perspectiveCameraState, controlsState);
// }
