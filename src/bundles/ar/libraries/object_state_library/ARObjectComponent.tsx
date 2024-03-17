import { Interactive } from '@react-three/xr';
import { type ARObject } from './ARObject';
import { type MutableRefObject, type ReactNode, useRef, useState } from 'react';
import {
  AlwaysRender,
  FixRotation,
  GltfModel,
  ImageModel,
  InterfaceModel,
  LightModel,
  OrbitMovement,
  PathMovement,
  RenderWithinDistance,
  RotateAroundY,
  RotateToUser,
  ShapeModel,
  SpringMovement,
  TextModel,
} from './Behaviour';
import { type Mesh, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import ErrorBoundary from './ErrorBoundary';
import GltfComponent from './model_components/GltfComponent';
import ShapeComponent from './model_components/ShapeComponent';
import { useSpring, type SpringValue } from '@react-spring/three';
import LightComponent from './model_components/LightComponent';
import InterfaceComponent from './model_components/InterfaceComponent';

type Props = {
  arObject: ARObject;
  getUserPosition: () => Vector3;
  setUUID: (uuid: string) => void;
  onSelect?: (object: ARObject) => void;
  children?: ReactNode;
};

type SpringProps = {
  position: SpringValue<[number, number, number]>;
};

/**
 * Component for showing a single AR object.
 * Use translatePosition and translateRotation if callibration is required.
 */
export default function ARObjectComponent(props: Props) {
  const ref = useRef<Mesh>(null);
  const [showComponent, setShowComponent] = useState(false);
  const [targetPosition, setTargetPosition] = useState(props.arObject.position);
  const spring: SpringProps = useSpring({
    position: vector3ToArray(targetPosition),
  });
  const [isInFront, setInFront] = useState(false);

  useFrame((state, delta) => {
    let uuid = ref.current?.uuid;
    if (uuid) {
      props.setUUID(uuid);
    }
    if (isInFront !== props.arObject.isInFront) {
      setInFront(props.arObject.isInFront);
    }
    const currentPosition = updatePosition(
      props.arObject,
      ref,
      targetPosition,
      setTargetPosition,
    );
    const userPosition = props.getUserPosition();
    handleVisibility(
      props.arObject,
      currentPosition,
      userPosition,
      setShowComponent,
    );
    handleRotation(props.arObject, currentPosition, userPosition, ref, delta);
  });

  function vector3ToArray(vector: Vector3) {
    return [vector.x, vector.y, vector.z] as [number, number, number];
  }

  if (!showComponent) return null;

  return (
    <ErrorBoundary fallback={<></>}>
      <Interactive
        onSelect={() => {
          let onSelect = props.onSelect;
          if (onSelect) {
            onSelect(props.arObject);
          }
        }}
      >
        <ModelComponent
          arObject={props.arObject}
          meshRef={ref}
          children={props.children}
          springPosition={spring.position}
          isSelected={props.arObject.isSelected}
          isInFront={isInFront}
        />
      </Interactive>
    </ErrorBoundary>
  );
}

// Movement

/**
 * Translates relative position to world position.
 * @returns World position.
 */
function updatePosition(
  arObject: ARObject,
  ref: MutableRefObject<Mesh | null>,
  targetPosition: Vector3,
  setTargetPosition: React.Dispatch<React.SetStateAction<Vector3>>,
) {
  let position = arObject.position.clone();
  const movement = arObject.behaviours.movement;
  if (movement instanceof PathMovement) {
    position = movement.getOffsetPosition(position);
  } else if (movement instanceof OrbitMovement) {
    position = movement.getOffsetPosition(position);
  } else if (movement instanceof SpringMovement) {
    if (targetPosition !== arObject.position) {
      setTargetPosition(arObject.position);
    }
    return ref?.current?.position ?? arObject.position;
  }
  const mesh = ref.current;
  if (mesh) {
    mesh.position.x = position.x;
    mesh.position.y = position.y;
    mesh.position.z = position.z;
  }
  return position;
}

// Model

type ModelProps = {
  arObject: ARObject;
  meshRef: MutableRefObject<any>;
  children: ReactNode | undefined;
  springPosition: SpringValue<[number, number, number]>;
  isInFront: boolean;
  isSelected: boolean;
};

function ModelComponent(props: ModelProps) {
  let modelClass = props.arObject.behaviours.model;
  if (modelClass instanceof GltfModel) {
    return <GltfComponent gltfModel={modelClass} {...props} />;
  }
  if (modelClass instanceof ShapeModel) {
    return <ShapeComponent shapeModel={modelClass} {...props} />;
  }
  if (modelClass instanceof InterfaceModel) {
    return <InterfaceComponent interfaceModel={modelClass} {...props} />;
  }
  if (modelClass instanceof LightModel) {
    return <LightComponent lightModel={modelClass} {...props} />;
  }
  return <></>;
}

// Render

function handleVisibility(
  arObject: ARObject,
  position: Vector3,
  userPosition: Vector3,
  setShowComponent: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const behaviour = arObject.behaviours.render ?? new RenderWithinDistance(5);
  if (behaviour instanceof RenderWithinDistance) {
    const distanceVector = new Vector3(0, 0, 0);
    distanceVector.subVectors(position, userPosition);
    const distance = distanceVector.length();
    setShowComponent(distance <= behaviour.distance);
  } else if (behaviour instanceof AlwaysRender) {
    setShowComponent(true);
  }
}

// Rotation

function handleRotation(
  arObject: ARObject,
  position: Vector3,
  userPosition: Vector3,
  ref: MutableRefObject<Mesh | null>,
  delta: number,
) {
  const rotation = arObject.behaviours.rotation;
  const mesh = ref.current;
  if (!mesh) return;
  if (rotation instanceof RotateToUser) {
    mesh.rotation.y = Math.atan2(
      userPosition.x - position.x,
      userPosition.z - position.z,
    );
  } else if (rotation instanceof RotateAroundY) {
    mesh.rotation.y += delta;
  } else if (rotation instanceof FixRotation) {
    mesh.rotation.y = rotation.rotation;
  } else {
    mesh.rotation.y = 0;
  }
}
