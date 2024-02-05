import { type MutableRefObject, type ReactNode } from "react";
import { ARObject } from "../ARObject";
import { LightModel } from "../Behaviour";
import { SpringValue, animated } from "@react-spring/three";

type LightProps = {
  lightModel: LightModel;
  arObject: ARObject;
  meshRef: MutableRefObject<any>;
  springPosition: SpringValue<[number, number, number]>;
  children: ReactNode | undefined;
};

export default function LightComponent(props: LightProps) {
  return (
    <animated.mesh ref={props.meshRef} position={props.springPosition}>
      <pointLight intensity={props.lightModel.intensity} />
    </animated.mesh>
  );
}

