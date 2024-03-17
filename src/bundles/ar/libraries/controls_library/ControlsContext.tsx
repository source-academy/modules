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
  objectInSight: React.MutableRefObject<any>;
  setObjectInSightCallback: (
    callback: (prev: Mesh | undefined, current: Mesh | undefined) => void,
  ) => void;
};

const Context = createContext<ContextType>({
  hitPointPosition: new Vector3(),
  objectInSight: createRef(),
  setObjectInSightCallback() {},
});

type Props = {
  children: ReactNode;
};

/**
 * Parent component with controls context.
 * Allows for more ways of interacting with objects.
 *
 * --- Hit Test ---
 * This feature can detect a surface shown on the screen and provide its coordinates.
 *
 * Steps to use:
 * 1. Replace the normal ARButton with the SimplifiedARButton.
 * 2. Add HitPointIndicator as a component in your virtual world to show the indicator on screen.
 * 3. Read `hitPointPosition` for the position of the latest surface detected.
 *
 * --- Ray Cast ---
 * This feature allows for identifying the first object in the middle of the screen.
 *
 * Steps to use:
 * 1. Provide a callback for receiving updates using 'setObjectInSightCallback'.
 * 2. In the callback, use the previous and current object to do something.
 *
 * Components within it can call 'useControls' to obtain this context.
 */
export function ControlsContext(props: Props) {
  const three = useThree();

  // Hit Test

  const [hitPointPosition, setHitPointPosition] = useState<Vector3>(
    new Vector3(),
  );

  useHitTest((hitMatrix, _) => {
    const newPosition = new Vector3();
    const newRotation = new Quaternion();
    const newScale = new Vector3();
    hitMatrix.decompose(newPosition, newRotation, newScale);
    setHitPointPosition(newPosition);
  });

  // Ray Cast

  const objectInSight = useRef<Mesh | undefined>(undefined);
  const objectInSightCallback =
    useRef<(prev: Mesh | undefined, current: Mesh | undefined) => void>();

  useFrame((_state, _delta) => {
    const item = getIntersection(three.camera, three.scene);
    if (item === undefined && objectInSight.current !== undefined) {
      // Object -> Null
      const prev = objectInSight.current;
      objectInSight.current = undefined;
      objectInSightCallback.current?.(prev, undefined);
    } else if (
      item !== undefined &&
      objectInSight.current?.uuid !== item.uuid
    ) {
      // Null -> Object or Old Object -> New Object
      const prev = objectInSight.current;
      objectInSight.current = item;
      objectInSightCallback.current?.(prev, item);
    }
  });

  return (
    <Context.Provider
      value={{
        hitPointPosition,
        objectInSight,
        setObjectInSightCallback(newCallback) {
          objectInSightCallback.current = newCallback;
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
