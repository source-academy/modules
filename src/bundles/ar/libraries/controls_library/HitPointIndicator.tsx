import { Interactive } from '@react-three/xr';
import { useEffect, useRef } from 'react';
import { useControls } from './ControlsContext';
import { type Mesh } from 'three';

type Props = {
  isVisible: boolean;
};

/**
 * Basic indicator component for hit-test detected position.
 */
export function HitPointIndicator(props: Props) {
  const hitPointerRef = useRef<Mesh>(null);
  const controls = useControls();

  useEffect(() => {
    if (hitPointerRef.current) {
      hitPointerRef.current.visible = props.isVisible;
      hitPointerRef.current.rotation.set(-Math.PI / 2, 0, 0); // Ensure that the ring is in right orientation
    }
  }, [hitPointerRef, props.isVisible]);

  return (
    <Interactive>
      <mesh
        ref={hitPointerRef}
        rotation-x={-Math.PI / 2}
        position={controls.hitPointPosition}
      >
        <ringGeometry args={[0, 0.05, 32]} />
        <meshStandardMaterial color={'white'} />
      </mesh>
    </Interactive>
  );
}
