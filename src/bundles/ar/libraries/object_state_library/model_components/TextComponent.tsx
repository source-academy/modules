import { type MutableRefObject, type ReactNode, useRef, useState } from 'react';
import { type TextModel } from '../Behaviour';
import { type Mesh } from 'three';
import { Text } from '@react-three/drei';
import { type SpringValue, animated } from '@react-spring/three';

type TextProps = {
  textModel: TextModel;
  meshRef: MutableRefObject<any>;
  springPosition: SpringValue<[number, number, number]>;
  children: ReactNode | undefined;
};

export default function TextComponent(props: TextProps) {
  const textRef = useRef<Mesh>(null);
  const [height, setHeight] = useState(0);

  function getBoxHeight() {
    if (height > 0) return;
    if (textRef.current) {
      const geometry = textRef.current.geometry;
      geometry.computeBoundingBox();
      if (geometry.boundingBox) {
        const minY = geometry.boundingBox.min.y;
        const maxY = geometry.boundingBox.max.y;
        const newHeight = maxY - minY + 0.05;
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
