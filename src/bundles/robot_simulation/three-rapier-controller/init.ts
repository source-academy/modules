import * as THREE from 'three';

import type Rapier from '@dimforge/rapier3d-compat';

import initRapier from './render/physics/RAPIER';
import { physicsOptions, sceneOptions } from './options';
import { addPhysics, type PhysicsObject } from './render/physics/physics';
import TickManager from './render/controllers/tickManager';



const getGroundMesh = () => {
  // * Settings
  const planeWidth = 100;
  const planeHeight = 100;

  // * Mesh
  const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
  const material = new THREE.MeshPhysicalMaterial({
    color: '#333',
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(geometry, material);

  // * Physics
  const collider = addPhysics(
    plane,
    'fixed',
    true,
    () => {
      plane.rotation.x -= Math.PI / 2;
    },
    'cuboid',
    {
      width: planeWidth / 2,
      height: 0.001,
      depth: planeHeight / 2,
    },
  ).collider;

  return plane;
};

const getCubeMesh = (pos: THREE.Vector3) => {
  // * Settings
  const size = 1;

  // * Mesh
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color()
      .setHex(Math.min(Math.random() + 0.15, 1) * 0xffffff),
    side: THREE.DoubleSide,
  });
  const cube = new THREE.Mesh(geometry, material);

  cube.position.copy(pos);
  cube.position.y += 2;

  // * Physics
  const cubePhysics = addPhysics(cube, 'dynamic', true, () => {
    cube.position.add(new THREE.Vector3(0, -10, 0));
  }, 'cuboid', {
    width: size / 2,
    height: size / 2,
    depth: size / 2,
  });

  const rigidBody = cubePhysics.rigidBody;

  rigidBody.addForce(new RAPIER.Vector3(0, 12, 0), true);

  return cube;
};

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let renderWidth: number;
let renderHeight: number;
let renderAspectRatio: number;
let RAPIER: typeof Rapier;
let physicsWorld: Rapier.World;
let physicsObjects: Array<PhysicsObject>;

const renderTickManager = new TickManager();

export const initEngines = async () => {
  RAPIER = await initRapier();
  physicsWorld = new RAPIER.World(physicsOptions.GRAVITY);

  physicsObjects = [];

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  renderWidth = sceneOptions.width;
  renderHeight = sceneOptions.height;

  renderAspectRatio = renderWidth / renderHeight;

  camera = new THREE.PerspectiveCamera(75, renderAspectRatio, 0.01, 1000);
  camera.position.z = 7;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(renderWidth, renderHeight);
  renderer.setPixelRatio(window.devicePixelRatio * 1.5);

  // Testing
  const light = new THREE.PointLight(0xff0000, 1, 100);
  light.position.set(0, 0, 0);
  scene.add(light);

  const cube = getCubeMesh(new THREE.Vector3(0, 0, 0));
  scene.add(cube);

  // const ground = getGroundMesh();
  // scene.add(ground);


  renderTickManager.startLoop();
};

export const getRenderer = () => renderer;

export const getRenderSize = () => ({
  width: renderWidth,
  height: renderHeight,
});

export const getCanvasDom = () => renderer.domElement;

export const getScene = () => scene;
export const getCamera = () => camera;
export const getPhysicsWorld = () => physicsWorld;
export const getPhysicsObjects = () => physicsObjects;


export { RAPIER };
