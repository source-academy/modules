import { type MutableRefObject, type ReactNode, useRef, useState } from 'react';
import { TextModel } from '../Behaviour';
import { Mesh } from 'three';
import { Text } from '@react-three/drei';
import { SpringValue, animated } from '@react-spring/three';

type TextProps = {
  textModel: TextModel;
  meshRef: MutableRefObject<any>;
  springPosition: SpringValue<[number, number, number]>;
  children: ReactNode | undefined;
};

export default function TextComponent(props: TextProps) {
  let textRef = useRef<Mesh>(null);
  let [height, setHeight] = useState(0);

  function getBoxHeight() {
    if (height > 0) return;
    if (textRef.current) {
      let geometry = textRef.current.geometry;
      geometry.computeBoundingBox();
      if (geometry.boundingBox) {
        let minY = geometry.boundingBox.min.y;
        let maxY = geometry.boundingBox.max.y;
        let newHeight = maxY - minY + 0.05;
        if (newHeight === Infinity) return;
        setHeight(newHeight);
      }
    }
  }

  return (
    <animated.mesh ref={props.meshRef} position={props.springPosition}>
      <boxGeometry args={[props.textModel.width, height, 0]} />
      <meshStandardMaterial color="white" />
      <Text
        ref={textRef}
        color="black"
        anchorX="center"
        anchorY="middle"
        maxWidth={props.textModel.width - 0.05}
        depthOffset={-1}
        fontSize={0.02}
        onAfterRender={getBoxHeight}
      >
        {props.textModel.text}
      </Text>
    </animated.mesh>
  );
}
