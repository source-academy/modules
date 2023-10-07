import * as THREE from 'three';
import { addPhysics } from '../render/physics/physics';
import { getSimulation } from '../render/simulation';

const addFloor = () => {
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

  addFloor();
};
