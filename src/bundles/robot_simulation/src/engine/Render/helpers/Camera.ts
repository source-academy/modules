import { EvaluatorRuntimeError } from '@sourceacademy/conductor/common';
import * as THREE from 'three';

type OrthographicCameraOptions = {
  type: 'orthographic';
};

type PerspectiveCameraOptions = {
  type: 'perspective';
  fov: number;
  aspect: number;
  near: number;
  far: number;
};

export type CameraOptions =
  | OrthographicCameraOptions
  | PerspectiveCameraOptions;

/**
 * Roughly where the EV3 spawns (see `chassisConfig.orientation.position` in
 * controllers/ev3/ev3/default/config.ts) - the camera should default to looking here, not at the
 * world origin, since the two aren't quite the same point and the gap matters at this scale.
 */
export const DEFAULT_LOOK_AT = new THREE.Vector3(0, 0.08, 0);

const setCameraPosition = (camera: THREE.Camera, position: THREE.Vector3, lookAt: THREE.Vector3 = DEFAULT_LOOK_AT) => {
  camera.position.copy(position);
  camera.lookAt(lookAt);
};

export function getCamera(cameraOptions: CameraOptions): THREE.Camera {
  // The EV3's chassis alone is ~0.145 x 0.18 x 0.095m (diagonal ~0.25m), and the full robot with
  // wheels/motors attached is only a little larger than that - so a camera sitting 2.8m away (the
  // old (0, 2, -2) default) rendered it as a barely-visible speck. ~0.33m out (under 1.5x the
  // chassis diagonal) and mostly overhead (a steep ~73 degree elevation) gives a close-in bird's
  // eye default view - the robot fills a large, comfortable fraction of the frame and its heading
  // reads clearly, while the slight tilt (vs. a dead-straight-down 90 degrees) keeps it looking
  // like a 3D object instead of a flat silhouette.
  const defaultPosition = new THREE.Vector3(0, 0.32, -0.1);
  switch (cameraOptions.type) {
    case 'perspective': {
      const camera = new THREE.PerspectiveCamera(
        cameraOptions.fov,
        cameraOptions.aspect,
        cameraOptions.near,
        cameraOptions.far,
      );
      setCameraPosition(camera, defaultPosition);
      return camera;
    }
    case 'orthographic': {
      const camera = new THREE.OrthographicCamera();
      setCameraPosition(camera, defaultPosition);
      return camera;
    }
    default: {
      // @ts-expect-error Ignore the never
      throw new EvaluatorRuntimeError(`Unknown camera type: ${cameraOptions.type}`);
    }
  }
}
