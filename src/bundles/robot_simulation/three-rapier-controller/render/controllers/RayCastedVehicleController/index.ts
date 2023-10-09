import * as THREE from 'three';

import {
  addPhysics,
  type PhysicsObject,
  type UpdateFunction,
} from '../../physics/physics';
import { carSettings, type CarSettings } from './carTuning';
import { quat, vec3 } from '../../physics/helpers';
import { RAPIER } from '../../../init';
import { getSimulation } from '../../simulation';

const getWheelDisplacements = (settings: CarSettings) => {
  const rayDisplacements = [
    {
      x: settings.chassis.width / 2 + settings.wheel.buffer,
      y: 0,
      z: settings.chassis.length / 2,
    },
    {
      x: -(settings.chassis.width / 2 + settings.wheel.buffer),
      y: 0,
      z: settings.chassis.length / 2,
    },
    {
      x: settings.chassis.width / 2 + settings.wheel.buffer,
      y: 0,
      z: -settings.chassis.length / 2,
    },
    {
      x: -(settings.chassis.width / 2 + settings.wheel.buffer),
      y: 0,
      z: -settings.chassis.length / 2,
    },
  ];
  return rayDisplacements;
};

const createUpdateFunction = (settings: CarSettings): UpdateFunction => {
  const simulation = getSimulation();
  if (simulation.state !== 'ready') {
    throw new Error('Simulation not ready');
  }

  const world = simulation.physicsWorld;


  const wheelRelativePositionFromOrigin = getWheelDisplacements(settings);

  const globalOrigin = {
    x: 0,
    y: 0,
    z: 0,
  };
  const downDirection = {
    x: 0,
    y: -1,
    z: 0,
  };

  const ray1 = new RAPIER.Ray(globalOrigin, downDirection);
  const ray2 = new RAPIER.Ray(globalOrigin, downDirection);
  const ray3 = new RAPIER.Ray(globalOrigin, downDirection);
  const ray4 = new RAPIER.Ray(globalOrigin, downDirection);

  const suspensionRays = [ray1, ray2, ray3, ray4];


  const updateFunction: UpdateFunction = ({
    mesh,
    collider,
    rigidBody: chassis,
  }) => {
    chassis.resetForces(true);
    chassis.resetTorques(true);

    const chassisRotationQuat = quat(chassis.rotation());
    const velocity = chassis.linvel();

    const wheelOrigins = [0, 1, 2, 3].map((wheelIndex) => {
      const origin = chassis.translation();
      const rayDisplacement = vec3(
        wheelRelativePositionFromOrigin[wheelIndex],
      )
        .applyQuaternion(chassisRotationQuat);
      origin.x += rayDisplacement.x;
      origin.y += rayDisplacement.y;
      origin.z += rayDisplacement.z;
      return origin;
    });

    // Setting the suspension rays
    for (let wheelIndex = 0; wheelIndex < 4; wheelIndex++) {
      const ray = suspensionRays[wheelIndex];
      const rayDirection = vec3(downDirection)
        .applyQuaternion(chassisRotationQuat);
      ray.origin = wheelOrigins[wheelIndex];
      ray.dir = rayDirection;
    }

    // Suspension forces
    for (let wheelIndex = 0; wheelIndex < 4; wheelIndex++) {
      const ray = suspensionRays[wheelIndex];
      const toiResult = world.castRay(
        ray,
        carSettings.wheel.maxSuspensionLength,
        true,
        1,
      );

      if (toiResult === null) {
        continue;
      }

      const force
        = carSettings.wheel.suspension.stiffness
          * (carSettings.wheel.restHeight - toiResult.toi + (carSettings.chassis.height / 2))
        - carSettings.wheel.suspension.damping * velocity.y;

      const direction = vec3({
        x: 0,
        y: force,
        z: 0,
      })
        .applyQuaternion(
          chassisRotationQuat,
        );

      chassis.addForceAtPoint(direction, ray.origin, true);
    }


    // Siding force
    const horizonalVelocity = {
      x: velocity.x,
      y: 0,
      z: velocity.z,
    };
    const sideForceMagnitude = vec3(horizonalVelocity)
      .projectOnVector(
        vec3({
          x: 1,
          y: 0,
          z: 0,
        })
          .applyQuaternion(chassisRotationQuat),
      )
      .multiplyScalar(carSettings.wheel.sideForceMultiplier);

    chassis.addForce(sideForceMagnitude, true);
  };

  return updateFunction;
};

const createChassis = (setting: CarSettings) => {
  const {
    chassis: { height, width, length },
  } = setting;
  const geometry = new THREE.BoxGeometry(width, height, length);
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x000000),
    side: THREE.DoubleSide,
  });
  const chassis = new THREE.Mesh(geometry, material);

  const chassisPhysicsObject = addPhysics(
    chassis,
    'dynamic',
    true,
    createUpdateFunction(carSettings),
    'cuboid',
    {
      width: width / 2,
      height: height / 2,
      depth: length / 2,
    },
  );

  chassisPhysicsObject.collider.setMass(carSettings.chassis.weight);
  return chassisPhysicsObject;
};


export class RayCastedVehicleController {
  carSettings: CarSettings;
  chassisPhysicsObject: PhysicsObject;
  constructor(settings: CarSettings) {
    this.carSettings = settings;
    this.chassisPhysicsObject = createChassis(settings);
  }
}
