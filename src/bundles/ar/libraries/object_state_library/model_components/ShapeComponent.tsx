import { type MutableRefObject, type ReactNode } from "react";
import { ShapeModel } from "../Behaviour";
import { SpringValue, animated } from "@react-spring/three";
import { Outlines } from "@react-three/drei";
import { Color } from "three";

type ShapeProps = {
  shapeModel: ShapeModel;
  meshRef: MutableRefObject<any>;
  springPosition: SpringValue<[number, number, number]>;
  isHighlighted: boolean;
  children: ReactNode | undefined;
};

export default function ShapeComponent(props: ShapeProps) {
  return (
    <animated.mesh ref={props.meshRef} position={props.springPosition}>
      <mesh
        geometry={props.shapeModel.geometry}
        material={props.shapeModel.material}
      >
        <Outlines
          visible={props.isHighlighted}
          thickness={10}
          color={new Color(0xffa500)}
          screenspace={true}
          opacity={1}
          transparent={false}
          angle={0}
        />
      </mesh>
    </animated.mesh>
  );
}

