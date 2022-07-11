// function doZoom(
//   zoomTicks: number,
//   perspectiveCameraState: PerspectiveCameraState,
//   controlsState: ControlsState
// ) {
//   while (zoomTicks !== 0) {
//     let currentTick: number = Math.sign(zoomTicks);
//     zoomTicks -= currentTick;

//     let scaleChange: number = currentTick * 0.1;
//     let potentialNewScale: number = controlsState.scale + scaleChange;
//     let potentialNewDistance: number =
//       vec3.distance(
//         perspectiveCameraState.position,
//         perspectiveCameraState.target
//       ) * potentialNewScale;

//     if (
//       potentialNewDistance > controlsState.limits.minDistance &&
//       potentialNewDistance < controlsState.limits.maxDistance
//     ) {
//       controlsState.scale = potentialNewScale;
//     } else break;
//   }

//   adjustCameraAngle(perspectiveCameraState, controlsState);
// }

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
