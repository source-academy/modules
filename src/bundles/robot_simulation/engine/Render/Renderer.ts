/* eslint-disable import/extensions */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { type FrameTimingInfo } from '../Core/Timer';
import {
  type GLTF,
  GLTFLoader,
} from 'three/examples/jsm/loaders/GLTFLoader.js';

type ControlType = 'none' | 'orbit';

export type RenderConfig = {
  width: number;
  height: number;
  control: ControlType
};

export class Renderer {
  element?: HTMLElement;

  #scene: THREE.Scene;
  #camera: THREE.Camera;
  #renderer: THREE.WebGLRenderer;
  #controls: OrbitControls;

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    configuration: RenderConfig,
  ) {
    this.#camera = camera;
    this.#scene = scene;
    this.#renderer = new THREE.WebGLRenderer({ antialias: true });

    this.#controls = new OrbitControls(this.#camera, this.#renderer.domElement);

    this.#renderer.setSize(configuration.width, configuration.height);
    this.#renderer.setPixelRatio(window.devicePixelRatio * 1.5);

    const light = new THREE.AmbientLight(0xffffff);
    this.#scene.add(light);
    this.#scene.background = new THREE.Color(0xffffff);
  }

  static loadGTLF(url: string): Promise<GLTF> {
    const loader = new GLTFLoader();
    return new Promise<GLTF>((resolve, reject) => {
      loader.load(url, resolve, () => {}, reject);
    });
  }

  scene(): THREE.Scene {
    return this.#scene;
  }

  render() {
    return this.#renderer.render(this.#scene, this.#camera);
  }

  getElement(): HTMLCanvasElement {
    return this.#renderer.domElement;
  }

  add(
    ...input: Parameters<typeof THREE.Scene.prototype.add>
  ): ReturnType<typeof THREE.Scene.prototype.add> {
    return this.#scene.add(...input);
  }

  step(_: FrameTimingInfo) {
    this.render();
    this.#controls.update();
  }
}
