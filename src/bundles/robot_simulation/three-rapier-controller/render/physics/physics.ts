import type Rapier from '@dimforge/rapier3d-compat';

import { RAPIER } from '../../init';
import { getSimulation } from '../simulation';

export type UpdateFunction = ({
  mesh,
  collider,
  rigidBody,
}: {
  mesh: THREE.Mesh;
  collider: Rapier.Collider;
  rigidBody: Rapier.RigidBody;
}) => void;

export type PhysicsObject = {
  mesh: THREE.Mesh;
  collider: Rapier.Collider;
  rigidBody: Rapier.RigidBody;
  fn?: UpdateFunction;
  autoAnimate: boolean;
};

export const addPhysics = (
  mesh: THREE.Mesh,
  rigidBodyType: string,
  autoAnimate: boolean = true, // update the mesh's position and quaternion based on the physics world every frame
  postPhysicsFn?: UpdateFunction,
  colliderType?: string,
  colliderSettings?: any,
) => {
  const simulation = getSimulation();
  if (simulation.state !== 'ready') {
    throw new Error(
      'Tried to add a physic object before initializing the simulation.',
    );
  }

  const physics = simulation.physicsWorld;
  const physicsObjects = simulation.physicsObjects;
  const scene = simulation.scene;

  const rigidBodyDesc = (RAPIER.RigidBodyDesc as any)[rigidBodyType]();
  rigidBodyDesc.setTranslation(
    mesh.position.x,
    mesh.position.y,
    mesh.position.z,
  );

  // * Responsible for collision response
  const rigidBody = physics.createRigidBody(rigidBodyDesc);

  let colliderDesc;

  switch (colliderType) {
    case 'cuboid':
      {
        const { width, height, depth } = colliderSettings;
        colliderDesc = RAPIER.ColliderDesc.cuboid(width, height, depth);
      }
      break;

    case 'ball':
      {
        const { radius } = colliderSettings;
        colliderDesc = RAPIER.ColliderDesc.ball(radius);
      }
      break;

    case 'capsule':
      {
        const { halfHeight, radius } = colliderSettings;
        colliderDesc = RAPIER.ColliderDesc.capsule(halfHeight, radius);
      }
      break;

    default:
      colliderDesc = RAPIER.ColliderDesc.trimesh(
        mesh.geometry.attributes.position.array as Float32Array,
        mesh.geometry.index?.array as Uint32Array,
      );
      break;
  }

  if (!colliderDesc) {
    console.error('Collider Mesh Error: convex mesh creation failed.');
  }

  // * Responsible for collision detection
  const collider = physics.createCollider(colliderDesc, rigidBody);

  const physicsObject: PhysicsObject = {
    mesh,
    collider,
    rigidBody,
    fn: postPhysicsFn,
    autoAnimate,
  };

  physicsObjects.push(physicsObject);
  scene.add(mesh);

  return physicsObject;
};
