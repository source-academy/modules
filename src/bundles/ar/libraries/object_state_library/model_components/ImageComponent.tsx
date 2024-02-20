import { type MutableRefObject } from 'react';
import { ImageModel } from '../Behaviour';
import { Image } from '@react-three/drei';
import { SpringValue, animated } from '@react-spring/three';

type ImageProps = {
  imageModel: ImageModel;
  meshRef: MutableRefObject<any>;
  springPosition: SpringValue<[number, number, number]>;
};

export default function ImageComponent(props: ImageProps) {
  return (
    <animated.mesh ref={props.meshRef} position={props.springPosition}>
      <Image
        url={props.imageModel.src}
        scale={[props.imageModel.width, props.imageModel.height]}
      />
    </animated.mesh>
  );
}
