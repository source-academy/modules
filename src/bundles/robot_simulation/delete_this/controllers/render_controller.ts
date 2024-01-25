/* eslint-disable import/extensions */
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  type GLTF,
  GLTFLoader,
} from 'three/examples/jsm/loaders/GLTFLoader.js';

import { type Steppable } from '../types';

export const sceneOptions = {
  height: 600,
  width: 800,
} as const;

export class RenderController implements Steppable {
  #scene: THREE.Scene;
  #camera: THREE.Camera;
  #renderer: THREE.WebGLRenderer;
  #controls: OrbitControls;

  constructor() {
    this.#scene = new THREE.Scene();

    const renderAspectRatio = sceneOptions.width / sceneOptions.height;
    this.#camera = new THREE.PerspectiveCamera(
      75,
      renderAspectRatio,
      0.01,
      1000,
    );

    this.#renderer = new THREE.WebGLRenderer({ antialias: true });
    this.#controls = new OrbitControls(this.#camera, this.#renderer.domElement);
  }

  init(): void {
    this.#scene.background = new THREE.Color(0xffffff);
    const light = new THREE.AmbientLight(0xffffff);
    this.#scene.add(light);

    this.#camera.translateY(2);
    this.#camera.lookAt(new THREE.Vector3(0, -1.5, 0));

    this.#renderer.setSize(sceneOptions.width, sceneOptions.height);
    this.#renderer.setPixelRatio(window.devicePixelRatio * 1.5);
  }

  loadGTLF(url: string): Promise<GLTF> {
    const loader = new GLTFLoader();
    return new Promise<GLTF>((resolve, reject) => {
      loader.load(url, resolve, () => {}, reject);
    });
  }

  setRendererOutput(domElement: HTMLDivElement): void {
    domElement.replaceChildren(this.#renderer.domElement);
  }

  addMesh(mesh: THREE.Mesh): void {
    this.#scene.add(mesh);
  }

  step(_: number): void {
    this.#renderer.render(this.#scene, this.#camera);
    this.#controls.update();
  }
}

export { THREE };
