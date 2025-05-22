import type Rapier from '@dimforge/rapier3d-compat';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Entity } from '../../Entity/Entity';
import { vec3 } from '../../Math/Convert';
import { SimpleQuaternion, SimpleVector } from '../../Math/Vector';

const createRigidBodyMock = (
  translation: SimpleVector,
  rotation: SimpleQuaternion
) => {
  const rigidBodyMock = {
    translation: vi.fn().mockReturnValue(translation),
    rotation: vi.fn().mockReturnValue(rotation),
    setTranslation: vi.fn(),
    setRotation: vi.fn(),
    applyImpulseAtPoint: vi.fn(),
    linvel: vi.fn().mockReturnValue({ x: 0, y: 0, z: 0 }),
    angvel: vi.fn().mockReturnValue({ x: 0, y: 0, z: 0 }),
  };
  return rigidBodyMock as unknown as Rapier.RigidBody;
};

const createCollider = (mass: number) => {
  const colliderMock = {
    mass: vi.fn().mockReturnValue(mass),
    setMass: vi.fn(),
  };
  return colliderMock as unknown as Rapier.Collider;
};

describe('Entity', () => {
  let entity: Entity;

  describe('unit tests', () => {
    let rigidBody: Rapier.RigidBody;
    let collider: Rapier.Collider;
    let position: SimpleVector;
    let rotation: SimpleQuaternion;
    beforeEach(() => {
      position = { x: 12, y: 0, z: 3 };
      rotation = { x: 0, y: 0, z: 0, w: 1 };
      rigidBody = createRigidBodyMock(position, rotation);
      collider = createCollider(1);
      entity = new Entity({
        rapierRigidBody: rigidBody,
        rapierCollider: collider,
      });
    });

    test('getCollider', () => {
      expect(entity.getCollider()).toBeDefined();
      expect(entity.getCollider()).toBe(collider);
    });

    test('getRigidBody', () => {
      expect(entity.getRigidBody()).toBeDefined();
      expect(entity.getRigidBody()).toBe(rigidBody);
    });

    test('getTranslation', () => {
      expect(entity.getTranslation()).toEqual(position);
    });

    test('getRotation', () => {
      expect(entity.getRotation()).toEqual(rotation);
    });

    test('setOrientation', () => {
      const orientation = {
        position: { x: 1, y: 2, z: 3 },
        rotation: { x: 0, y: 0, z: 0, w: 1 },
      };
      entity.setOrientation(orientation);
      expect(rigidBody.setTranslation).toHaveBeenCalledWith(
        orientation.position,
        true
      );
      expect(rigidBody.setRotation).toHaveBeenCalledWith(
        orientation.rotation,
        true
      );
    });

    test('setMass', () => {
      const mass = 2;
      entity.setMass(mass);
      expect(collider.setMass).toHaveBeenCalledWith(mass);
    });

    test('getMass', () => {
      expect(entity.getMass()).toBe(1);
    });

    test('getVelocity', () => {
      entity.getVelocity();
      expect(rigidBody.linvel).toHaveBeenCalled();
    });

    test('getAngularVelocity', () => {
      entity.getAngularVelocity();
      expect(rigidBody.angvel).toHaveBeenCalled();
    });

    test('applyImpulse', () => {
      const impulse = { x: 1, y: 2, z: 3 };
      const point = { x: 0, y: 0, z: 0 };
      entity.applyImpulse(impulse, point);
      expect(rigidBody.applyImpulseAtPoint).toHaveBeenCalledWith(
        impulse,
        point,
        true
      );
    });

    test('worldTranslation', () => {
      const localTranslation = vec3({ x: 1, y: 2, z: 3 });
      entity.worldTranslation(localTranslation);
      expect(rigidBody.rotation).toHaveBeenCalled();
      expect(rigidBody.translation).toHaveBeenCalled();
    });

    test('transformDirection', () => {
      const localDirection = vec3({ x: 1, y: 2, z: 3 });
      entity.transformDirection(localDirection);
      expect(rigidBody.rotation).toHaveBeenCalled();
    });

    test('distanceVectorOfPointToRotationalAxis', () => {
      const localPoint = vec3({ x: 1, y: 2, z: 3 });
      entity.distanceVectorOfPointToRotationalAxis(localPoint);
      expect(rigidBody.angvel).toHaveBeenCalled();
    });

    test('tangentialVelocityOfPoint', () => {
      const localPoint = vec3({ x: 1, y: 2, z: 3 });
      entity.tangentialVelocityOfPoint(localPoint);
      expect(rigidBody.angvel).toHaveBeenCalled();
    });

    test('worldVelocity', () => {
      const localPoint = vec3({ x: 1, y: 2, z: 3 });
      entity.worldVelocity(localPoint);
      expect(rigidBody.linvel).toHaveBeenCalled();
      expect(rigidBody.angvel).toHaveBeenCalled();
    });
  });

  describe('end-to-end tests', () => {
    describe('worldTranslation', () => {
      test('no rotation', () => {
        const rigidBodyTranslation = { x: 1, y: 1, z: 1 };

        const rigidBody = createRigidBodyMock(rigidBodyTranslation, {x:0, y:0, z:0, w:1});
        const collider = createCollider(1);
        const entity = new Entity({
          rapierRigidBody: rigidBody,
          rapierCollider: collider,
        });

        const localTranslation = vec3({ x: 1, y: 2, z: 3 });
        const worldTranslation = entity.worldTranslation(localTranslation.clone());
        expect(worldTranslation).toEqual({
          x: rigidBodyTranslation.x + localTranslation.x,
          y: rigidBodyTranslation.y + localTranslation.y,
          z: rigidBodyTranslation.z + localTranslation.z,
        });
      });

      test('no local translation', () => {
        const rigidBodyTranslation = { x: 1, y: 1, z: 1 };

        const rigidBody = createRigidBodyMock(rigidBodyTranslation, {x:1, y:0, z:0, w:1});
        const collider = createCollider(1);
        const entity = new Entity({
          rapierRigidBody: rigidBody,
          rapierCollider: collider,
        });

        const localTranslation = vec3({ x: 0, y: 0, z: 0 });
        const worldTranslation = entity.worldTranslation(localTranslation.clone());
        expect(worldTranslation).toEqual(rigidBodyTranslation);
      });

      test('with rotation and local translation', () => {
        const rigidBodyTranslation = { x: 12, y: 0, z: 0 };

        // 180 degree rotation around the x axis
        const rigidBody = createRigidBodyMock(rigidBodyTranslation, {x:0, y:1, z:0, w:0});
        const collider = createCollider(1);
        const entity = new Entity({
          rapierRigidBody: rigidBody,
          rapierCollider: collider,
        });

        const localTranslation = vec3({ x: 1, y: 0, z: 0 });
        const worldTranslation = entity.worldTranslation(localTranslation.clone());
        expect(worldTranslation).toEqual({
          x: 11,
          y: 0,
          z: 0,
        });
      });
    });

    describe('transformDirection', () => {
      test('no rotation', () => {
        const rigidBody = createRigidBodyMock({ x: 1, y: 1, z: 1 }, {x:0, y:0, z:0, w:1});
        const collider = createCollider(1);
        const entity = new Entity({
          rapierRigidBody: rigidBody,
          rapierCollider: collider,
        });

        const localDirection = vec3({ x: 1, y: 2, z: 3 });
        const worldDirection = entity.transformDirection(localDirection.clone());
        expect(worldDirection).toEqual(localDirection);
      });

      test('with rotation and local translation', () => {
        const rigidBody = createRigidBodyMock({ x: 1, y: 1, z: 1 }, {x:0, y:1, z:0, w:0});
        const collider = createCollider(1);
        const entity = new Entity({
          rapierRigidBody: rigidBody,
          rapierCollider: collider,
        });

        const localDirection = vec3({ x: 1, y: 2, z: 3 });
        const worldDirection = entity.transformDirection(localDirection.clone());
        expect(worldDirection).toEqual(
          {
            x:-localDirection.x,
            y:localDirection.y,
            z:-localDirection.z,
          }
        );
      });
    });

  });
});
