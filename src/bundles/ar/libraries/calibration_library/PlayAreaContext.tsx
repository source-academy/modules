import { useThree } from '@react-three/fiber';
import { type ReactNode, createContext, useContext, useState } from 'react';
import { Vector3, Euler } from 'three';

type ContextType = {
  setCameraAsOrigin: () => void;
  getCameraRelativePosition: () => Vector3;
  getCameraRelativeRotation: () => Euler;
  setPlayArea: (origin: Vector3, cameraRotation: Euler) => void;
};

const Context = createContext<ContextType>({
  setCameraAsOrigin: () => {},
  getCameraRelativePosition: () => new Vector3(),
  getCameraRelativeRotation: () => new Euler(),
  setPlayArea: () => {},
});

type Props = {
  children: ReactNode;
};

/**
 * Parent component with play area context.
 * Allows for translation between world position and relative position.
 *
 * Steps to use:
 * 1. Call 'setPlayArea' to callibrate origin position and angle.
 * 2. To convert from relative position to world position, call 'getPosition'.
 * 3. To convert back to relative position, call 'getRelativePosition'.
 *
 * Components within it can call 'usePlayArea' to obtain this context.
 */
export function PlayAreaContext(props: Props) {
  const [origin, setOrigin] = useState<Vector3>(new Vector3(0, 0, 0));
  const [angle, setAngle] = useState<number>(0);
  const three = useThree();
  const DEFAULT_HEIGHT = 1;

  // Three

  function setCameraAsOrigin() {
    let cameraPosition = three.camera.position;
    setPlayArea(
      new Vector3(
        cameraPosition.x,
        cameraPosition.y - DEFAULT_HEIGHT,
        cameraPosition.z,
      ),
      three.camera.rotation,
    );
  }

  function getCameraRelativePosition() {
    return getRelativePosition(three.camera.position);
  }

  function getCameraRelativeRotation() {
    return getRelativeRotation(three.camera.rotation);
  }

  // Logic

  /**
   * Sets the origin position and angle for calibration.
   * Relative to actual world origin.
   * Converts camera rotation to angle around vertical axis.
   * Angle measured counterclockwise, starting from 12 o'clock.
   *
   * @param cameraPosition Position of user in world coordinates
   * @param cameraRotation Camera rotation of user
   */
  function setPlayArea(cameraPosition: Vector3, cameraRotation: Euler) {
    setOrigin(cameraPosition);
    setAngle(eulerToAngle(cameraRotation));
  }

  /**
   * Converts euler to y-axis rotation angle.
   * @param euler Euler to convert
   * @returns Angle in radians
   */
  function eulerToAngle(euler: Euler) {
    let x = Math.sin(euler.y);
    let z = Math.cos(euler.y) * Math.cos(euler.x);
    let selectedAngle = 0;
    if (z !== 0) {
      selectedAngle = Math.atan(x / z);
      if (z < 0) {
        selectedAngle += Math.PI;
      } else if (x < 0) {
        selectedAngle += Math.PI * 2;
      }
    } else if (x > 0) {
      selectedAngle = Math.PI / 2;
    } else if (x < 0) {
      selectedAngle = (Math.PI * 3) / 2;
    }
    return selectedAngle;
  }

  // /**
  //  * Converts relative position to world position.
  //  * Used for placing object into world.
  //  *
  //  * @param relativePosition Relative position of the object
  //  * @returns Actual position of the object
  //  */
  // function getPosition(relativePosition: Vector3) {
  //     var clonedPosition = relativePosition.clone();
  //     clonedPosition.applyAxisAngle(new Vector3(0, 1, 0), rotation);
  //     let x = clonedPosition.x + origin.x;
  //     let y = clonedPosition.y + origin.y;
  //     let z = clonedPosition.z + origin.z;
  //     return new Vector3(x, y, z);
  // }

  /**
   * Converts world position to relative position.
   * Used for saving object's current position in world.
   *
   * @param position Actual position of the object
   * @returns Relative position of the object
   */
  function getRelativePosition(position: Vector3) {
    let x = position.x - origin.x;
    let y = position.y - origin.y;
    let z = position.z - origin.z;
    let relativePosition = new Vector3(x, y, z);
    relativePosition.applyAxisAngle(new Vector3(0, 1, 0), -angle);
    return relativePosition;
  }

  function getRelativeRotation(rotation: Euler) {
    let vector3 = new Vector3();
    vector3.setFromEuler(rotation);
    vector3.applyAxisAngle(new Vector3(0, 1, 0), -angle);
    let euler = new Euler();
    euler.setFromVector3(vector3);
    return euler;
  }

  return (
    <Context.Provider
      value={{
        setCameraAsOrigin,
        setPlayArea,
        getCameraRelativePosition,
        getCameraRelativeRotation,
      }}
    >
      <group position={origin} rotation={new Euler(0, angle, 0)}>
        {props.children}
      </group>
    </Context.Provider>
  );
}

export function usePlayArea() {
  return useContext(Context);
}
