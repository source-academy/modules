import * as THREE from 'three';
// eslint-disable-next-line import/extensions
import { type GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { Dimension } from '../../Math/Vector';

type GLTFLoaderOptions = Dimension;

export function loadGLTF(url: string, dimension: GLTFLoaderOptions): Promise<GLTF> {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (data) => {
        const box = new THREE.Box3()
          .setFromObject(data.scene);
        const meshSize = new THREE.Vector3();
        box.getSize(meshSize);

        const scaleX = dimension.width / meshSize.x;
        const scaleY = dimension.height / meshSize.y;
        const scaleZ = dimension.length / meshSize.z;

        data.scene.scale.set(scaleX, scaleY, scaleZ);

        resolve(data);
      },
      undefined,
      (error) => reject(error),
    );
  });
}
