/* eslint-disable import/extensions */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { type FrameTimingInfo } from '../Core/Timer';
import {
  type GLTF,
  GLTFLoader,
} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { getCamera, type CameraOptions } from './Camera';

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

  static scene(): THREE.Scene {
    return new THREE.Scene();
  }

  static camera(cameraOptions: CameraOptions): THREE.Camera {
    const camera = getCamera(cameraOptions);
    return camera;
  }

  static sensorCamera(): THREE.Camera {
    const renderAspectRatio = 1;
    return new THREE.PerspectiveCamera(10, renderAspectRatio, 0.01, 1000);
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
