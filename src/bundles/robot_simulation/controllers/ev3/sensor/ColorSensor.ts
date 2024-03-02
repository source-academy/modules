import * as THREE from 'three';
import { Renderer } from '../../../engine';
import { type Sensor } from './types';
import { type ChassisWrapper } from '../components/Chassis';
import { type SimpleVector } from '../../../engine/Math/Vector';
import { vec3 } from '../../../engine/Math/Convert';
import type { PhysicsTimingInfo } from '../../../engine/Physics';

type Color = { r:number, g:number, b:number };

type ColorSensorConfig = {
  debug: boolean
};

export class ColorSensor implements Sensor<Color> {
  renderer: Renderer;
  camera: THREE.Camera;
  displacement: THREE.Vector3;
  chassisWrapper: ChassisWrapper;

  accumulator = 0;
  colorSensed:Color;
  tempCanvas: HTMLCanvasElement;

  constructor(chassisWrapper: ChassisWrapper, scene: THREE.Scene, displacement: SimpleVector, config: ColorSensorConfig) {
    this.chassisWrapper = chassisWrapper;
    this.camera = Renderer.sensorCamera();
    this.displacement = vec3(displacement);
    this.colorSensed = {
      r: 0,
      g: 0,
      b: 0,
    };

    this.renderer = new Renderer(scene, this.camera, {
      width: 16,
      height: 16,
      control: 'none',
    });
    this.tempCanvas = document.createElement('canvas');


    if (config.debug) {
      const helper = new THREE.CameraHelper(this.camera);
      scene.add(helper);
    }
  }

  getColorSensorPosition() {
    const chassis = this.chassisWrapper.getEntity();
    const colorSensorPosition = chassis.worldTranslation(this.displacement.clone());
    return colorSensorPosition;
  }

  getElement(): HTMLCanvasElement {
    return this.renderer.getElement();
  }

  sense(): Color {
    return this.colorSensed;
  }

  fixedUpdate(timingInfo: PhysicsTimingInfo) {
    const { timestep } = timingInfo;

    this.accumulator += timestep;
    if (this.accumulator < 1000) {
      return;
    }
    this.accumulator -= 1000;

    this.renderer.render();

    this.camera.position.copy(this.getColorSensorPosition());

    const lookAt = this.getColorSensorPosition();
    lookAt.y -= 1;
    this.camera.lookAt(lookAt);

    const rendererCanvas = this.getElement();

    this.tempCanvas.width = rendererCanvas.width;
    this.tempCanvas.height = rendererCanvas.height;

    const tempCtx = this.tempCanvas.getContext('2d', { willReadFrequently: true })!;

    tempCtx.drawImage(rendererCanvas, 0, 0);

    const imageData = tempCtx.getImageData(0, 0, 16, 16, {});

    const averageColor = {
      r: 0,
      g: 0,
      b: 0,
    };

    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      // const a = imageData.data[i + 3];
      averageColor.r += r;
      averageColor.g += g;
      averageColor.b += b;
    }

    averageColor.r /= imageData.data.length;
    averageColor.g /= imageData.data.length;
    averageColor.b /= imageData.data.length;

    this.colorSensed = averageColor;
  }
}
