import type { Dimension, Orientation } from '../Math/Vector';
import { type Physics } from '../Physics';
import { Entity } from './Entity';

export const rigidBodyTypes = ['fixed', 'dynamic'] as const;

export type RigidBodyType = typeof rigidBodyTypes[number];

export type EntityCuboidOptions = {
  orientation: Orientation;
  dimension: Dimension;
  mass: number;
  type: RigidBodyType;
};

export function isRigidBodyType(bodyType: string): bodyType is RigidBodyType {
  return rigidBodyTypes.includes(bodyType as RigidBodyType);
}

export function addCuboid(
  physics: Physics,
  options: EntityCuboidOptions,
): Entity {
  const { orientation, dimension: { width, height, length }, type, mass } = options;

  const rigidBodyDesc = physics.RAPIER.RigidBodyDesc[type]();
  const colliderDesc = physics.RAPIER.ColliderDesc.cuboid(
    width / 2,
    height / 2,
    length / 2,
  );

  colliderDesc.mass = mass;

  const rigidBody = physics.createRigidBody(rigidBodyDesc);
  const collider = physics.createCollider(colliderDesc, rigidBody);

  const entity = new Entity({
    rapierRigidBody: rigidBody,
    rapierCollider: collider,
  });

  entity.setOrientation(orientation);

  return entity;
}
