import { useFrame, useThree } from '@react-three/fiber';
import {
  type ReactNode,
  createContext,
  createRef,
  useContext,
  useRef,
} from 'react';
import { type Mesh } from 'three';
import { getIntersection } from './RayCast';

type ContextType = {
  object: React.MutableRefObject<any>;
  setCallback: (
    callback: (prev: Mesh | undefined, current: Mesh | undefined) => void,
  ) => void;
};

const Context = createContext<ContextType>({
  object: createRef(),
  setCallback: () => undefined,
});

type Props = {
  children: ReactNode;
};

export function ControlsContext(props: Props) {
  const facingObject = useRef<Mesh | undefined>(undefined);
  const callback =
    useRef<(prev: Mesh | undefined, current: Mesh | undefined) => void>();

  const three = useThree();

  useFrame((_state, _delta) => {
    let item = getIntersection(three.camera, three.scene);
    if (item === undefined && facingObject.current !== undefined) {
      let prev = facingObject.current;
      facingObject.current = undefined;
      callback.current?.(prev, undefined);
    } else if (item !== undefined && facingObject.current?.uuid !== item.uuid) {
      let prev = facingObject.current;
      facingObject.current = item;
      callback.current?.(prev, item);
    }
  });

  return (
    <Context.Provider
      value={{
        object: facingObject,
        setCallback: (newCallback) => (callback.current = newCallback),
      }}
    >
      {props.children}
    </Context.Provider>
  );
}

export function useControls() {
  return useContext(Context);
}
