import * as THREE from 'three';
import { Renderer } from '../../../engine';
import { type Sensor } from './types';
import { type ChassisWrapper } from '../components/Chassis';
import { type SimpleVector } from '../../../engine/Math/Vector';
import { vec3 } from '../../../engine/Math/Convert';
import type { PhysicsTimingInfo } from '../../../engine/Physics';
import {
  getCamera,
  type CameraOptions,
} from '../../../engine/Render/helpers/Camera';

type Color = { r: number; g: number; b: number };

export type ColorSensorConfig = {
  size: {
    height: number;
    width: number;
  };
  displacement: SimpleVector;
  camera: CameraOptions;
  tickRateInSeconds: number;
  debug: boolean;
};

export class ColorSensor implements Sensor<Color> {
  chassisWrapper: ChassisWrapper;
  displacement: THREE.Vector3;
  config: ColorSensorConfig;

  camera: THREE.Camera;
  renderer: Renderer;
  accumulator = 0;
  colorSensed: Color;
  tempCanvas: HTMLCanvasElement;

  constructor(
    chassisWrapper: ChassisWrapper,
    render: Renderer,
    config: ColorSensorConfig,
  ) {
    this.chassisWrapper = chassisWrapper;
    this.displacement = vec3(config.displacement);
    this.config = config;

    this.camera = getCamera(config.camera);
    // We create a new renderer with the same scene. But we use a different camera.
    this.renderer = new Renderer(render.scene(), this.camera, {
      width: this.config.size.width,
      height: this.config.size.height,
      control: 'none',
    });

    this.colorSensed = {
      r: 0,
      g: 0,
      b: 0,
    };

    this.tempCanvas = document.createElement('canvas');
    this.tempCanvas.width = this.config.size.width;
    this.tempCanvas.height = this.config.size.height;

    if (config.debug) {
      const helper = new THREE.CameraHelper(this.camera);
      render.add(helper);
    }
  }

  getColorSensorPosition() {
    const chassis = this.chassisWrapper.getEntity();
    const colorSensorPosition = chassis.worldTranslation(
      this.displacement.clone(),
    );
    return colorSensorPosition;
  }

  sense(): Color {
    return this.colorSensed;
  }

  // Even though we are rendering, we use fixedUpdate because the student's code can be affected
  // by the values of sense() and could affect the determinism of the simulation.
  fixedUpdate(timingInfo: PhysicsTimingInfo) {
    this.accumulator += timingInfo.timestep;

    const tickRateInMilliseconds = this.config.tickRateInSeconds * 1000;

    // We check the accumulator to see if it's time update the color sensor.
    // If it's not time, we return early.
    if (this.accumulator < tickRateInMilliseconds) {
      return;
    }
    this.accumulator -= tickRateInMilliseconds;

    // We move the camera to the right position
    this.camera.position.copy(this.getColorSensorPosition());
    // Point it downwards
    this.camera.lookAt(
      this.camera.position.x,
      this.camera.position.y - 1, // 1 unit below its current position
      this.camera.position.z,
    );

    // We render to load the color sensor data into the renderer.
    this.renderer.render();

    // We get the HTMLCanvasElement from the renderer
    const rendererCanvas = this.renderer.getElement();

    // Get the context from the temp canvas
    const tempCtx = this.tempCanvas.getContext('2d', {
      willReadFrequently: true,
    })!;

    // Draw the renderer canvas to the temp canvas
    tempCtx.drawImage(rendererCanvas, 0, 0);

    // Get the image data from the temp canvas
    const imageData = tempCtx.getImageData(
      0,
      0,
      this.config.size.width,
      this.config.size.height,
      {},
    );

    // Calculate the average color
    const averageColor = {
      r: 0,
      g: 0,
      b: 0,
    };

    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
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
