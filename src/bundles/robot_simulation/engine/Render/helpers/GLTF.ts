import * as THREE from 'three';
// eslint-disable-next-line import/extensions
import { type GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { SimpleVector } from '../../Math/Vector';

type GLTFLoaderOptions = SimpleVector;

export function loadGLTF(url: string, targetSize: GLTFLoaderOptions): Promise<GLTF> {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (data) => {
        const box = new THREE.Box3()
          .setFromObject(data.scene);
        const meshSize = new THREE.Vector3();
        box.getSize(meshSize);

        const scaleX = targetSize.x / meshSize.x;
        const scaleY = targetSize.y / meshSize.y;
        const scaleZ = targetSize.z / meshSize.z;

        data.scene.scale.set(scaleX, scaleY, scaleZ);

        resolve(data);
      },
      undefined,
      (error) => reject(error),
    );
  });
}
