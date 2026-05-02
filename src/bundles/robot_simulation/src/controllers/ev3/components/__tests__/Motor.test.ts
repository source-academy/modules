import * as THREE from 'three';
import { describe, expect, it as baseIt, vi } from 'vitest';
import { Physics, Renderer } from '../../../../engine';
import { loadGLTF } from '../../../../engine/Render/helpers/GLTF';
import { ev3Config } from '../../ev3/default/config';
import { ChassisWrapper } from '../Chassis';
import { Motor, type MotorConfig } from '../Motor';

vi.mock(import('../../../../engine/Render/helpers/GLTF'), () => ({
  loadGLTF: vi.fn().mockResolvedValue({
    scene: {
      position: {
        copy: vi.fn(),
      },
      quaternion: {
        copy: vi.fn(),
      },
      rotateX: vi.fn(),
      rotateZ: vi.fn()
    }
  }),
}));

vi.mock(import('../../../../engine'), () => ({
  Physics: vi.fn(),
  Renderer: vi.fn().mockImplementation(() => ({
    add: vi.fn(),
  })),
}) as any);

vi.mock(import('../Chassis'), () => ({
  ChassisWrapper: vi.fn(class {
    getEntity = vi.fn().mockReturnValue({
      transformDirection: vi.fn().mockImplementation((v) => v),
      worldVelocity: vi.fn().mockReturnValue(new THREE.Vector3()),
      worldTranslation: vi.fn().mockReturnValue(new THREE.Vector3()),
      applyImpulse: vi.fn(),
      getMass: vi.fn().mockReturnValue(1),
      getRotation: vi.fn(),
    });
  }),
} as any));

describe(Motor, () => {
  const it = baseIt
    .extend('mockPhysics', { applyImpulse: vi.fn() } as unknown as Physics)
    .extend('mockRenderer', { add: vi.fn() } as unknown as Renderer)
    .extend('mockConfig', {
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
    } as unknown as MotorConfig)
    // @ts-expect-error Ignore ev3config errors
    .extend('mockChassisWrapper', ({ mockPhysics, mockRenderer }) => new ChassisWrapper(mockPhysics, mockRenderer, ev3Config.motors[0]))
    .extend(
      'motor',
      ({ mockChassisWrapper, mockConfig, mockPhysics, mockRenderer }) => new Motor(mockChassisWrapper, mockPhysics, mockRenderer, mockConfig )
    );

  it('should initialize correctly and load the mesh', async ({ motor, mockConfig, mockRenderer }) => {
    await motor.start();
    expect(loadGLTF).toHaveBeenCalledWith(
      mockConfig.mesh.url,
      mockConfig.mesh.dimension
    );
    expect(mockRenderer.add).toHaveBeenCalled();
  });

  it('sets motor velocity and schedules stop with distance', ({ motor }) => {
    motor.setSpeedDistance(10, 100);
    expect(motor.motorVelocity).toBe(10);
  });

  it('updates the motor velocity and applies impulse', ({ motor, mockChassisWrapper }) => {
    motor.fixedUpdate({ deltaTime: 1 } as any);
    expect(mockChassisWrapper.getEntity().applyImpulse).toHaveBeenCalled();
  });

  it('updates mesh', async ({ motor }) => {
    await motor.start();
    motor.update({ frameDuration: 1 } as any);

    expect(motor.mesh!.scene.position.copy).toBeCalled();
    expect(motor.mesh!.scene.quaternion.copy).toBeCalled();
  });

  it('rotates the mesh if on the left side', async ({ motor }) => {
    motor.wheelSide = 'left';
    await motor.start();
    motor.update({ frameDuration: 1 } as any);

    expect(motor.mesh!.scene.rotateZ).toHaveBeenCalledOnce();
  });
});
