import * as THREE from 'three';

import { CameraOptions, getCamera } from '../../Render/helpers/Camera';


describe('getCamera', () => {
  test('returns a PerspectiveCamera when type is "perspective"', () => {
    const cameraOptions: CameraOptions = {
      type: 'perspective',
      fov: 45,
      aspect: 16 / 9,
      near: 0.1,
      far: 1000,
    };


    const camera = getCamera(cameraOptions);
    expect(camera).toBeInstanceOf(THREE.PerspectiveCamera);
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    expect(perspectiveCamera.fov).toBe(cameraOptions.fov);
    expect(perspectiveCamera.aspect).toBe(cameraOptions.aspect);
    expect(perspectiveCamera.near).toBe(cameraOptions.near);
    expect(perspectiveCamera.far).toBe(cameraOptions.far);
  });

  test('returns an OrthographicCamera when type is "orthographic"', () => {
    const cameraOptions: CameraOptions = {
      type: 'orthographic',
    };
    const camera = getCamera(cameraOptions);
    expect(camera).toBeInstanceOf(THREE.OrthographicCamera);
  });

  test('throws an error when type is unknown', () => {
    const cameraOptions: CameraOptions = {
      // @ts-expect-error
      type: 'unknown',
    };
    expect(() => getCamera(cameraOptions)).toThrowError('Unknown camera type');
  });
});