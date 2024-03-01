// physics.test.js
import { Physics } from '../Physics';
import rapier from '@dimforge/rapier3d-compat';

// Mock rapier
jest.mock('@dimforge/rapier3d-compat', () => {
  return {
    init: jest.fn(),
    World: jest.fn().mockImplementation(() => ({
      timestep: jest.fn(),
      createRigidBody: jest.fn(),
      createCollider: jest.fn(),
      castRayAndGetNormal: jest.fn(),
      step: jest.fn(),
      castRay: jest.fn(),
    })),
    Ray: jest.fn(),
    RigidBodyDesc: jest.fn(),
    ColliderDesc: jest.fn(),
  };
});

describe('Physics', () => {
  let physics;
  const config = { gravity: { x: 0, y: -9.81, z: 0 }, timestep: 1 / 60 };

  beforeEach(() => {
    physics = new Physics(config);
  });

  test('constructor initializes configuration', () => {
    expect(physics.configuration).toEqual(config);
  });

  test('start initializes the physics world', async () => {
    await physics.start();
    expect(rapier.init).toHaveBeenCalled();
    expect(physics.internals).toHaveProperty('initialized', true);
    expect(physics.internals).toHaveProperty('world');
    expect(physics.internals).toHaveProperty('accumulator', 0);
  });


  test('createRigidBody throws if not initialized', () => {
    expect(() => physics.createRigidBody({})).toThrow("Physics engine hasn't been initialized yet");
  });

  test('createRigidBody creates a rigid body when initialized', async () => {
    await physics.start(); // Initialize
    const rigidBodyDesc = {}; // Mocked rigid body descriptor
    physics.createRigidBody(rigidBodyDesc);
    expect(physics.internals.world.createRigidBody).toHaveBeenCalledWith(rigidBodyDesc);
  });

  test('createCollider creates a collider when initialized', async () => {
    await physics.start(); // Initialize
    const colliderDesc = {}; // Mocked collider descriptor
    const rigidBody = {}; // Mocked rigid body
    physics.createCollider(colliderDesc, rigidBody);
    expect(physics.internals.world.createCollider).toHaveBeenCalledWith(colliderDesc, rigidBody);
  });

  test('castRay returns correct result when initialized', async () => {
    await physics.start(); // Initialize
    const globalPosition = {}; // Mocked global position
    const globalDirection = {}; // Mocked global direction
    const maxDistance = 100;
  
    // Mock the return value of castRayAndGetNormal
    const expectedResult = { toi: 10, normal: { x: 0, y: 1, z: 0 } };
    physics.internals.world.castRayAndGetNormal.mockReturnValue(expectedResult);
  
    const result = physics.castRay(globalPosition, globalDirection, maxDistance);
    expect(result).toEqual({
      distance: expectedResult.toi,
      normal: expectedResult.normal,
    });
    expect(physics.internals.world.castRayAndGetNormal).toHaveBeenCalledWith(expect.anything(), maxDistance, true, undefined, undefined, undefined);
  });

  test('castRay returns null result castRayAndGetNormal returns null', async () => {
    await physics.start(); // Initialize
    const globalPosition = {}; // Mocked global position
    const globalDirection = {}; // Mocked global direction
    const maxDistance = 100;
  
    // Mock the return value of castRayAndGetNormal
    const expectedResult = null;
    physics.internals.world.castRayAndGetNormal.mockReturnValue(expectedResult);
  
    const result = physics.castRay(globalPosition, globalDirection, maxDistance);
    expect(result).toEqual(null);
  });

  test('step advances physics world by correct timestep', async () => {
    await physics.start(); // Initialize
    const frameTimingInfo = { frameDuration: 1000 / 60 }; // 60 FPS
    physics.step(frameTimingInfo);
    expect(physics.internals.world.step).toHaveBeenCalledTimes(2);
  });

  test('castRay throws if not initialized', () => {
    expect(() => {
      physics.castRay({}, {}, 100);
    }).toThrow("Physics engine hasn't been initialized yet");
  });

  test('createCollider throws if not initialized', () => {
    expect(() => {
      physics.createCollider({}, {}, 100);
    }).toThrow("Physics engine hasn't been initialized yet");
  });
  
  test('step throws if not initialized', () => {
    expect(() => {
      physics.step({ frameDuration: 1000 / 60 });
    }).toThrow("Physics engine hasn't been initialized yet");
  });
});

