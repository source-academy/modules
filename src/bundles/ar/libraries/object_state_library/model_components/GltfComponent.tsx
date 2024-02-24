import { useFrame } from '@react-three/fiber';
import {
  type MutableRefObject,
  type ReactNode,
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { type Object3D, type Object3DEventMap, AnimationMixer } from 'three';
import { type GltfModel } from '../Behaviour';
import { type ARObject } from '../ARObject';
import { type SpringValue, animated } from '@react-spring/three';
import { useGLTF } from '@react-three/drei';

type GltfProps = {
  gltfModel: GltfModel;
  arObject: ARObject;
  meshRef: MutableRefObject<any>;
  springPosition: SpringValue<[number, number, number]>;
  children: ReactNode | undefined;
};

export default function GltfComponent(props: GltfProps) {
  const model = useGLTF(props.gltfModel.resource);
  const [scene, setScene] = useState<Object3D<Object3DEventMap>>();
  const mixer = useRef<AnimationMixer>();

  useEffect(() => {
    let clonedScene = SkeletonUtils.clone(model.scene);
    setScene(clonedScene);
    mixer.current = new AnimationMixer(clonedScene);
  }, [model.scene]);

  useEffect(() => {
    if (model.animations.length > 0) {
      props.gltfModel.callAnimation = (actionName: string) => {
        let selectedAction = model.animations.find(
          (item) => item.name === actionName,
        );
        if (!selectedAction) return;
        mixer.current?.stopAllAction();
        let action = mixer.current?.clipAction(selectedAction);
        action?.play();
      };
    }
  }, [props.gltfModel, model.animations, model.animations.length]);

  useFrame((state, delta) => {
    mixer.current?.update(delta);
  });

  // Issue with excessively deep animated mesh https://github.com/pmndrs/react-spring/issues/1515
  return (
    <animated.mesh
      position={props.springPosition}
      scale={props.gltfModel.scale}
      ref={props.meshRef}
    >
      <Suspense fallback={null}>
        {scene ? <primitive object={scene} /> : null}
      </Suspense>
      {props.children}
    </animated.mesh>
  );
}
