import { type MutableRefObject, type ReactNode } from 'react';
import { type ShapeModel } from '../Behaviour';
import { type SpringValue, animated } from '@react-spring/three';
import { Outline } from '../Outline';

type ShapeProps = {
  shapeModel: ShapeModel;
  meshRef: MutableRefObject<any>;
  springPosition: SpringValue<[number, number, number]>;
  isSelected: boolean;
  isInFront: boolean;
  children: ReactNode | undefined;
};

/**
 * Component for showing a Three.js shape.
 */
export default function ShapeComponent(props: ShapeProps) {
  return (
    <animated.mesh ref={props.meshRef} position={props.springPosition}>
      <mesh
        geometry={props.shapeModel.geometry}
        material={props.shapeModel.material}
      >
        <Outline isSelected={props.isSelected} isInFront={props.isInFront} />
      </mesh>
    </animated.mesh>
  );
}
