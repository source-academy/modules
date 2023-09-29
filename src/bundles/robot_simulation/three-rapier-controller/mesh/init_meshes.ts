import * as THREE from 'three';
import { addPhysics } from '../render/physics/physics';
import { getSimulation } from '../init';

const getCubeMesh = (pos: THREE.Vector3) => {
  // * Settings
  const size = 1;

  // * Mesh
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x000000),
    side: THREE.DoubleSide,
  });
  const cube = new THREE.Mesh(geometry, material);

  cube.position.copy(pos);
  cube.position.z -= 7;

  // * Physics
  addPhysics(cube, 'dynamic', true, undefined, 'cuboid', {
    width: size / 2,
    height: size / 2,
    depth: size / 2,
  });


  return cube;
};


const getFloor = () => {
  const size = 100;
  const height = 1;

  const geometry = new THREE.BoxGeometry(size, height, size);
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xFFC0CB),
    side: THREE.DoubleSide,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, -2, 0);

  addPhysics(cube, 'fixed', true, undefined, 'cuboid', {
    width: size,
    height,
    depth: size,
  });

  return cube;
};

export const init_meshes = () => {
  const simulation = getSimulation();
  if (simulation.state !== 'ready') {
    throw new Error('Cannot initialized mesh before simulation is ready');
  }

  const scene = simulation.scene;

  const cube = getCubeMesh(new THREE.Vector3(0, 0, 0));
  scene.add(cube);

  const floor = getFloor();
  scene.add(floor);
};
