import { type MutableRefObject, type ReactNode } from 'react';
import { type ARObject } from '../ARObject';
import { type LightModel } from '../Behaviour';
import { type SpringValue, animated } from '@react-spring/three';

type LightProps = {
  lightModel: LightModel;
  arObject: ARObject;
  meshRef: MutableRefObject<any>;
  springPosition: SpringValue<[number, number, number]>;
  children: ReactNode | undefined;
};

/**
 * Component for a light source shining from a particular positon.
 */
export default function LightComponent(props: LightProps) {
  return (
    <animated.mesh ref={props.meshRef} position={props.springPosition}>
      <pointLight intensity={props.lightModel.intensity} />
    </animated.mesh>
  );
}
