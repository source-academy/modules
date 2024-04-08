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

const setCameraPosition = (camera: THREE.Camera, position: THREE.Vector3) => {
  camera.position.copy(position);
  camera.lookAt(0, 0, 0);
};

export function getCamera(cameraOptions: CameraOptions): THREE.Camera {
  const defaultPosition = new THREE.Vector3(0, 2, -2);
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
      // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
      const _: never = cameraOptions;
      throw new Error('Unknown camera type');
    }
  }
}
