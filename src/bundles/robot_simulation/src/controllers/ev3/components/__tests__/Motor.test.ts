import * as THREE from 'three';
import { describe, expect, it as baseIt, vi } from 'vitest';
import type { Physics } from '../../../../engine';
import type { SceneRegistry } from '../../../../engine/Render/SceneRegistry';
import { ev3Config } from '../../ev3/default/config';
import { ChassisWrapper } from '../Chassis';
import { Motor, type MotorConfig } from '../Motor';

vi.mock(import('../../../../engine/Entity/EntityFactory'));

vi.mock(import('../Chassis'), () => ({
  ChassisWrapper: vi.fn(class {
    getEntity = vi.fn().mockReturnValue({
      transformDirection: vi.fn().mockImplementation((v) => v),
      worldVelocity: vi.fn().mockReturnValue(new THREE.Vector3()),
      worldTranslation: vi.fn().mockReturnValue(new THREE.Vector3()),
      applyImpulse: vi.fn(),
      getMass: vi.fn().mockReturnValue(1),
      getRotation: vi.fn().mockReturnValue(new THREE.Quaternion()),
    });
  }),
} as any));

describe(Motor, () => {
  const it = baseIt
    .extend('mockPhysics', { applyImpulse: vi.fn() } as unknown as Physics)
    .extend('mockRegistry', { add: vi.fn().mockReturnValue(new THREE.Object3D()) } as unknown as SceneRegistry)
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
    .extend('mockChassisWrapper', ({ mockPhysics }) => new ChassisWrapper(mockPhysics, ev3Config.chassis))
    .extend(
      'motor',
      ({ mockChassisWrapper, mockConfig, mockPhysics, mockRegistry }) => new Motor(mockChassisWrapper, mockPhysics, mockRegistry, mockConfig)
    );

  it('should register a transform handle and load the mesh', ({ motor, mockConfig, mockRegistry }) => {
    motor.start();
    expect(mockRegistry.add).toHaveBeenCalledWith({
      kind: 'gltf',
      url: mockConfig.mesh.url,
      dimension: mockConfig.mesh.dimension,
      offsetY: 0,
    });
    expect(motor.mesh).toBeInstanceOf(THREE.Object3D);
  });

  it('sets motor velocity and schedules stop with distance', ({ motor }) => {
    motor.setSpeedDistance(10, 100);
    expect(motor.motorVelocity).toBe(10);
  });

  it('updates the motor velocity and applies impulse', ({ motor, mockChassisWrapper }) => {
    motor.fixedUpdate({ deltaTime: 1 } as any);
    expect(mockChassisWrapper.getEntity().applyImpulse).toHaveBeenCalled();
  });

  it('updates mesh', ({ motor }) => {
    motor.start();
    const positionCopy = vi.spyOn(motor.mesh!.position, 'copy');
    const quaternionCopy = vi.spyOn(motor.mesh!.quaternion, 'copy');
    motor.update({ frameDuration: 1 } as any);

    expect(positionCopy).toBeCalled();
    expect(quaternionCopy).toBeCalled();
  });

  it('rotates the mesh if on the left side', ({ motor }) => {
    motor.wheelSide = 'left';
    motor.start();
    const rotateZ = vi.spyOn(motor.mesh!, 'rotateZ');
    motor.update({ frameDuration: 1 } as any);

    expect(rotateZ).toHaveBeenCalledOnce();
  });
});
