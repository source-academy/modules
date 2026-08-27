// physics.test.js
import rapier from '@dimforge/rapier3d-compat';
import { assert, describe, expect, test as baseTest, vi } from 'vitest';
import { Physics } from '../Physics';

// Mock rapier
vi.mock(import('@dimforge/rapier3d-compat'), () => {
  const mocked: typeof rapier = {
    init: vi.fn(),
    World: class {
      timestep = vi.fn();
      createRigidBody = vi.fn();
      createCollider = vi.fn();
      castRayAndGetNormal = vi.fn();
      step = vi.fn();
      castRay = vi.fn();
    },
    Ray: vi.fn(),
    RigidBodyDesc: vi.fn(),
    ColliderDesc: vi.fn(),
  } as any;

  return { default: mocked };
});

describe(Physics, () => {
  const test = baseTest
    .extend('config', { gravity: { x: 0, y: -9.81, z: 0 }, timestep: 1 / 60 })
    .extend('physics', ({ config }) => new Physics(config));

  test('constructor initializes configuration', ({ physics, config }) => {
    expect(physics.configuration).toEqual(config);
  });

  test('start initializes the physics world', async ({ physics }) => {
    await physics.start();
    expect(rapier.init).toHaveBeenCalled();
    expect(physics.internals).toHaveProperty('initialized', true);
    expect(physics.internals).toHaveProperty('world');
    expect(physics.internals).toHaveProperty('accumulator', physics.configuration.timestep);
  });

  test('createRigidBody throws if not initialized', ({ physics }) => {
    expect(() => physics.createRigidBody({} as any)).toThrow("Physics engine hasn't been initialized yet");
  });

  test('createRigidBody creates a rigid body when initialized', async ({ physics }) => {
    await physics.start(); // Initialize
    const rigidBodyDesc = {}; // Mocked rigid body descriptor
    physics.createRigidBody(rigidBodyDesc as any);

    assert(physics.internals.initialized);
    expect(physics.internals.world.createRigidBody).toHaveBeenCalledWith(rigidBodyDesc);
  });

  test('createCollider creates a collider when initialized', async ({ physics }) => {
    await physics.start(); // Initialize
    const colliderDesc: any = {}; // Mocked collider descriptor
    const rigidBody: any = {}; // Mocked rigid body
    physics.createCollider(colliderDesc, rigidBody);

    assert(physics.internals.initialized);
    expect(physics.internals.world.createCollider).toHaveBeenCalledWith(colliderDesc, rigidBody);
  });

  test('castRay returns correct result when initialized', async ({ physics }) => {
    await physics.start(); // Initialize
    const globalPosition: any = {}; // Mocked global position
    const globalDirection: any = {}; // Mocked global direction
    const maxDistance = 100;

    // Mock the return value of castRayAndGetNormal
    const expectedResult: any = { toi: 10, normal: { x: 0, y: 1, z: 0 } };
    assert(physics.internals.initialized);
    vi.mocked(physics.internals.world.castRayAndGetNormal).mockReturnValue(expectedResult);

    const result = physics.castRay(globalPosition, globalDirection, maxDistance);
    expect(result).toEqual({
      distance: expectedResult.toi,
      normal: expectedResult.normal,
    });
    expect(physics.internals.world.castRayAndGetNormal).toHaveBeenCalledWith(expect.anything(), maxDistance, true, undefined, undefined, undefined);
  });

  test('castRay returns null result castRayAndGetNormal returns null', async ({ physics }) => {
    await physics.start(); // Initialize
    const globalPosition: any = {}; // Mocked global position
    const globalDirection: any = {}; // Mocked global direction
    const maxDistance = 100;

    // Mock the return value of castRayAndGetNormal
    const expectedResult = null;
    assert(physics.internals.initialized);
    vi.mocked(physics.internals.world.castRayAndGetNormal).mockReturnValue(expectedResult);

    const result = physics.castRay(globalPosition, globalDirection, maxDistance);
    expect(result).toEqual(null);
  });

  test('step advances physics world by correct timestep', async ({ physics }) => {
    await physics.start(); // Initialize
    const frameTimingInfo: any = { frameDuration: 1000 / 60 }; // 60 FPS
    physics.step(frameTimingInfo);
    assert(physics.internals.initialized);
    expect(physics.internals.world.step).toHaveBeenCalledTimes(2);
  });

  test('castRay throws if not initialized', ({ physics }) => {
    expect(() => {
      physics.castRay({} as any, {} as any, 100);
    }).toThrow("Physics engine hasn't been initialized yet");
  });

  test('createCollider throws if not initialized', ({ physics }) => {
    expect(() => {
      physics.createCollider({} as any, {} as any);
    }).toThrow("Physics engine hasn't been initialized yet");
  });

  test('step throws if not initialized', ({ physics }) => {
    expect(() => {
      physics.step({ frameDuration: 1000 / 60 } as any);
    }).toThrow("Physics engine hasn't been initialized yet");
  });
});
