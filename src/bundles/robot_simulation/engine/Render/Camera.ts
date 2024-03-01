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

export function getCamera(cameraOptions: CameraOptions): THREE.Camera {
  switch (cameraOptions.type) {
    case 'perspective':
      return new THREE.PerspectiveCamera(
        cameraOptions.fov,
        cameraOptions.aspect,
        cameraOptions.near,
        cameraOptions.far,
      );
    case 'orthographic':
      return new THREE.OrthographicCamera();
    default: {
      // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
      const _: never = cameraOptions;
      throw new Error('Unknown camera type');
    }
  }
}
