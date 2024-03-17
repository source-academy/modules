import { useThree } from '@react-three/fiber';
import { type ReactNode, createContext, useContext, useState } from 'react';
import { Vector3, Euler } from 'three';

type ContextType = {
  setCameraAsOrigin: () => void;
  setPositionAsOrigin: (origin: Vector3, cameraRotation: Euler) => void;
  getCameraPosition: () => Vector3;
  getCameraRotation: () => Euler;
};

const Context = createContext<ContextType>({
  setCameraAsOrigin() {},
  setPositionAsOrigin() {},
  getCameraPosition: () => new Vector3(),
  getCameraRotation: () => new Euler(),
});

type Props = {
  children: ReactNode;
};

/**
 * Parent component with play area context.
 * Allows for resetting the point and angle of origin.
 * Also provides translated camera position and rotation.
 *
 * Steps to use:
 * 1a. Call 'setCameraAsOrigin' to set current position as new origin position and angle.
 * 1b. Alternatively, call 'setPlayArea' with the position + rotation to set as new origin position and angle.
 *
 * Components within it can call 'usePlayArea' to obtain this context.
 */
export function PlayAreaContext(props: Props) {
  const [origin, setOrigin] = useState<Vector3>(new Vector3(0, 0, 0));
  const [angle, setAngle] = useState<number>(0);
  const three = useThree();
  const DEFAULT_HEIGHT = 1;

  // Three

  /**
   * Sets the current position as origin.
   */
  function setCameraAsOrigin() {
    const cameraPosition = three.camera.position;
    setPositionAsOrigin(
      new Vector3(
        cameraPosition.x,
        cameraPosition.y - DEFAULT_HEIGHT,
        cameraPosition.z,
      ),
      three.camera.rotation,
    );
  }

  /**
   * Sets the origin position and angle for calibration.
   * Relative to actual world origin.
   * Converts camera rotation to angle around vertical axis.
   * Angle measured counterclockwise, starting from 12 o'clock.
   *
   * @param position Position of user in world coordinates
   * @param rotation Camera rotation of user
   */
  function setPositionAsOrigin(position: Vector3, rotation: Euler) {
    setOrigin(position);
    setAngle(eulerToAngle(rotation));
  }

  /**
   * Returns the current camera position relative to the origin.
   */
  function getCameraPosition() {
    return getRelativePosition(three.camera.position);
  }

  /**
   * Returns the current camera rotation relative to the origin.
   */
  function getCameraRotation() {
    return getRelativeRotation(three.camera.rotation);
  }

  // Logic

  /**
   * Converts euler to y-axis rotation angle.
   *
   * @param euler Euler to convert
   * @returns Angle in radians
   */
  function eulerToAngle(euler: Euler) {
    const x = Math.sin(euler.y);
    const z = Math.cos(euler.y) * Math.cos(euler.x);
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

  /**
   * Converts actual position to position relative to the custom origin position.
   *
   * @param position Actual position tracked by camera
   * @returns Position relative to the custom origin
   */
  function getRelativePosition(position: Vector3) {
    const x = position.x - origin.x;
    const y = position.y - origin.y;
    const z = position.z - origin.z;
    const relativePosition = new Vector3(x, y, z);
    relativePosition.applyAxisAngle(new Vector3(0, 1, 0), -angle); // Rotation fixed around vertical axis
    return relativePosition;
  }

  /**
   * Converts actual rotation to rotation relative to the custom origin angle.
   *
   * @param rotation Actual rotation tracked by camera
   * @returns Rotation relative to the custom origin
   */
  function getRelativeRotation(rotation: Euler) {
    const vector3 = new Vector3();
    vector3.setFromEuler(rotation);
    vector3.applyAxisAngle(new Vector3(0, 1, 0), -angle);
    const euler = new Euler();
    euler.setFromVector3(vector3);
    return euler;
  }

  return (
    <Context.Provider
      value={{
        setCameraAsOrigin,
        setPositionAsOrigin,
        getCameraPosition,
        getCameraRotation,
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
