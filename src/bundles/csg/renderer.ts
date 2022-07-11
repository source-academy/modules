// function adjustCameraAngle(
//   perspectiveCameraState: PerspectiveCameraState,
//   controlsState: ControlsState | null = null
// ): void {
//   if (controlsState === null) {
//     // Modify the position & view of the passed camera state,
//     // based on its existing position of the viewer (eye),
//     // target point the viewer is looking at (centre) & up axis
//     perspectiveCamera.update(perspectiveCameraState);
//     return;
//   }

//   let output: ControlsUpdate.Output = controls.update({
//     controls: controlsState,
//     camera: perspectiveCameraState,
//   });

//   // Manually apply unlike perspectiveCamera.update()
//   controlsState.thetaDelta = output.controls.thetaDelta;
//   controlsState.phiDelta = output.controls.phiDelta;
//   controlsState.scale = output.controls.scale;

//   perspectiveCameraState.position = output.camera.position;
//   perspectiveCameraState.view = output.camera.view;
// }

// function doDynamicResize(
//   canvas: HTMLCanvasElement,
//   perspectiveCameraState: PerspectiveCameraState
// ): void {
//   let canvasBounds: DOMRect = canvas.getBoundingClientRect();
//   let { devicePixelRatio } = window;

//   // Account for display scaling
//   let width: number = canvasBounds.width * devicePixelRatio;
//   let height: number = canvasBounds.height * devicePixelRatio;

//   canvas.width = width;
//   canvas.height = height;

//   // Modify the projection, aspect ratio & viewport
//   perspectiveCamera.setProjection(
//     perspectiveCameraState,
//     perspectiveCameraState,
//     new CameraViewportDimensions(width, height)
//   );
// }

// function doZoom(
//   zoomTicks: number,
//   perspectiveCameraState: PerspectiveCameraState,
//   controlsState: ControlsState
// ): void {
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

// function doZoomToFit(
//   geometryEntities: GeometryEntity[],
//   perspectiveCameraState: PerspectiveCameraState,
//   controlsState: ControlsState
// ): void {
//   let options: ControlsZoomToFit.Options = {
//     controls: controlsState,
//     camera: perspectiveCameraState,
//     entities: geometryEntities,
//   };
//   let output: ControlsZoomToFit.Output = controls.zoomToFit(options);

//   perspectiveCameraState.target = output.camera.target;
//   controlsState.scale = output.controls.scale;

//   adjustCameraAngle(perspectiveCameraState, controlsState);
// }

// function doRotate(
//   rotateX: number,
//   rotateY: number,
//   perspectiveCameraState: PerspectiveCameraState,
//   controlsState: ControlsState
// ): void {
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
// ): void {
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

// function addControlListeners(
//   canvas: HTMLCanvasElement,
//   frameTracker: FrameTracker
// ): void {
//   canvas.addEventListener(
//     'wheel',
//     (wheelEvent: WheelEvent): void => {
//       frameTracker.changeZoomTicks(wheelEvent.deltaY);

//       // Prevent scrolling the side panel when there is overflow
//       wheelEvent.preventDefault();
//     },
//     { passive: false }
//   );

//   canvas.addEventListener('dblclick', (_mouseEvent: MouseEvent): void => {
//     frameTracker.setZoomToFit();
//   });

//   canvas.addEventListener(
//     'pointerdown',
//     (pointerEvent: PointerEvent): void => {
//       frameTracker.setHeldPointer(pointerEvent.button);
//       frameTracker.lastX = pointerEvent.pageX;
//       frameTracker.lastY = pointerEvent.pageY;

//       // Detect drags even outside the canvas element's borders
//       canvas.setPointerCapture(pointerEvent.pointerId);

//       // Prevent middle-click from activating auto-scrolling
//       pointerEvent.preventDefault();
//     },
//     { passive: false }
//   );
//   canvas.addEventListener('pointerup', (pointerEvent: PointerEvent): void => {
//     frameTracker.unsetHeldPointer();
//     frameTracker.unsetLastCoordinates();

//     canvas.releasePointerCapture(pointerEvent.pointerId);
//   });

//   canvas.addEventListener('pointermove', (pointerEvent: PointerEvent): void => {
//     let currentX = pointerEvent.pageX;
//     let currentY = pointerEvent.pageY;
//     if (frameTracker.lastX < 0 || frameTracker.lastY < 0) {
//       // If never tracked before, let differences result in 0
//       frameTracker.lastX = currentX;
//       frameTracker.lastY = currentY;
//     }

//     if (!frameTracker.shouldIgnorePointerMove()) {
//       let differenceX = frameTracker.lastX - currentX;
//       let differenceY = frameTracker.lastY - currentY;

//       if (frameTracker.isPointerPan(pointerEvent.shiftKey)) {
//         frameTracker.panX += differenceX;
//         frameTracker.panY -= differenceY;
//       } else {
//         // Else default to rotate
//         frameTracker.rotateX -= differenceX;
//         frameTracker.rotateY += differenceY;
//       }
//     }

//     frameTracker.lastX = currentX;
//     frameTracker.lastY = currentY;
//   });
// }

























// addControlListeners(canvas, frameTracker);
