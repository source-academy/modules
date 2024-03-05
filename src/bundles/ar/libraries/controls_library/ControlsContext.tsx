import { useFrame, useThree } from '@react-three/fiber';
import {
  type ReactNode,
  createContext,
  createRef,
  useContext,
  useRef,
  useState,
} from 'react';
import { type Mesh, Quaternion, Vector3 } from 'three';
import { getIntersection } from './RayCast';
import { useHitTest } from '@react-three/xr';

type ContextType = {
  hitPointPosition: Vector3;
  facingObject: React.MutableRefObject<any>;
  setFacingObjectCallback: (
    callback: (prev: Mesh | undefined, current: Mesh | undefined) => void,
  ) => void;
};

const Context = createContext<ContextType>({
  hitPointPosition: new Vector3(),
  facingObject: createRef(),
  setFacingObjectCallback: () => {},
});

type Props = {
  children: ReactNode;
};

export function ControlsContext(props: Props) {
  const facingObject = useRef<Mesh | undefined>(undefined);
  const callback =
    useRef<(prev: Mesh | undefined, current: Mesh | undefined) => void>();
  const [hitPointPosition, setHitPointPosition] = useState<Vector3>(
    new Vector3(),
  );
  const three = useThree();

  useFrame((_state, _delta) => {
    const item = getIntersection(three.camera, three.scene);
    if (item === undefined && facingObject.current !== undefined) {
      const prev = facingObject.current;
      facingObject.current = undefined;
      callback.current?.(prev, undefined);
    } else if (item !== undefined && facingObject.current?.uuid !== item.uuid) {
      const prev = facingObject.current;
      facingObject.current = item;
      callback.current?.(prev, item);
    }
  });

  useHitTest((hitMatrix, hit) => {
    const newPosition = new Vector3();
    const newRotation = new Quaternion();
    const newScale = new Vector3();
    hitMatrix.decompose(newPosition, newRotation, newScale);
    setHitPointPosition(newPosition);
  });

  return (
    <Context.Provider
      value={{
        hitPointPosition: hitPointPosition,
        facingObject: facingObject,
        setFacingObjectCallback: (newCallback) => {
          callback.current = newCallback;
        },
      }}
    >
      {props.children}
    </Context.Provider>
  );
}

export function useControls() {
  return useContext(Context);
}
