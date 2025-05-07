import * as THREE from 'three';
import { Renderer, Physics } from '../../../../engine';
import { loadGLTF } from '../../../../engine/Render/helpers/GLTF';
import { ChassisWrapper } from '../../../ev3/components/Chassis';
import { Motor } from '../../../ev3/components/Motor';
import { ev3Config } from '../../../ev3/ev3/default/config';

jest.mock('three', () => {
  const originalModule = jest.requireActual('three');
  return {
    ...originalModule,
  };
});

jest.mock('../../../../engine/Render/helpers/GLTF', () => ({
  loadGLTF: jest.fn().mockResolvedValue({
    scene: {
      position: {
        copy: jest.fn(),
      },
      quaternion: {
        copy: jest.fn(),
      },
      rotateX: jest.fn(),
      rotateZ: jest.fn()
    }
  }),
}));

jest.mock('../../../../engine', () => ({
  Physics: jest.fn(),
  Renderer: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
  })),
}));

jest.mock('../../../ev3/components/Chassis', () => ({
  ChassisWrapper: jest.fn().mockImplementation(() => ({
    getEntity: jest.fn().mockReturnValue({
      transformDirection: jest.fn().mockImplementation((v) => v),
      worldVelocity: jest.fn().mockReturnValue(new THREE.Vector3()),
      worldTranslation: jest.fn().mockReturnValue(new THREE.Vector3()),
      applyImpulse: jest.fn(),
      getMass: jest.fn().mockReturnValue(1),
      getRotation: jest.fn(),
    }),
  })),
}));

describe('Motor', () => {
  let motor;
  let mockChassisWrapper;
  let mockPhysics;
  let mockRenderer;
  let mockConfig;

  beforeEach(() => {
    mockPhysics = {
      applyImpulse: jest.fn(),
    } as unknown as Physics;
    mockRenderer = { add: jest.fn() } as unknown as Renderer;
    mockConfig = {
      displacement: { x: 1, y: 0, z: 0 },
      pid: {
        proportionalGain: 1,
        integralGain: 0.1,
        derivativeGain: 0.01,
      },
      mesh: {
        url: 'path/to/mesh',
        dimension: { height: 1, width: 1, depth: 1 },
      },
    };
    const config = ev3Config.motors[0];
    mockChassisWrapper = new ChassisWrapper(mockPhysics, mockRenderer, config);
    motor = new Motor(
      mockChassisWrapper,
      mockPhysics,
      mockRenderer,
      mockConfig
    );
  });

  it('should initialize correctly and load the mesh', async () => {
    await motor.start();
    expect(loadGLTF).toHaveBeenCalledWith(
      mockConfig.mesh.url,
      mockConfig.mesh.dimension
    );
    expect(mockRenderer.add).toHaveBeenCalled();
  });

  it('sets motor velocity and schedules stop with distance', () => {
    motor.setSpeedDistance(10, 100);
    expect(motor.motorVelocity).toBe(10);
  });

  it('updates the motor velocity and applies impulse', () => {
    motor.fixedUpdate({ deltaTime: 1 });
    expect(mockChassisWrapper.getEntity().applyImpulse).toHaveBeenCalled();
  });

  it('updates mesh', async () => {
    await motor.start();
    motor.update({frameDuration: 1});

    expect(motor.mesh.scene.position.copy).toBeCalled();
    expect(motor.mesh.scene.quaternion.copy).toBeCalled();
  });

  it('rotates the mesh if on the left side', async () => {
    motor.wheelSide = 'left';
    await motor.start();
    motor.update({frameDuration: 1});

    expect(motor.mesh.scene.rotateZ).toBeCalled();
  });
});
