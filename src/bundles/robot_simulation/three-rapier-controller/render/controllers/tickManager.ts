import { getSimulation } from '../../init';

// animation params
type Frame = XRFrame | null;

export type TickData = {
  timestamp: number
  timeDiff: number
  fps: number
  frame: Frame
};

const localTickData: TickData = {
  timestamp: 0,
  timeDiff: 0,
  fps: 0,
  frame: null,
};

const localFrameOpts = {
  data: localTickData,
};

const frameEvent = new MessageEvent('tick', localFrameOpts);

class TickManager extends EventTarget {
  timestamp: number;
  timeDiff: number;
  frame: Frame;
  lastTimestamp: number;
  fps: number;

  constructor({ timestamp, timeDiff, frame } = localTickData) {
    super();

    this.timestamp = timestamp;
    this.timeDiff = timeDiff;
    this.frame = frame;
    this.lastTimestamp = 0;
    this.fps = 0;
  }

  startLoop() {
    const simulation = getSimulation();
    if (simulation.state !== 'ready') {
      throw new Error('Tried to start a loop before starting simulation');
    }
    const renderer = simulation.renderer;
    const physics = simulation.physicsWorld;
    const physicsObjects = simulation.physicsObjects;
    const scene = simulation.scene;
    const camera = simulation.camera;


    if (!renderer) {
      throw new Error('Updating Frame Failed : Uninitialized Renderer');
    }

    const animate = (timestamp: number, frame: Frame) => {
      const now = performance.now();
      this.timestamp = timestamp ?? now;
      this.timeDiff = timestamp - this.lastTimestamp;

      const timeDiffCapped = Math.min(Math.max(this.timeDiff, 0), 100);

      // physics
      physics.step();

      for (let i = 0; i < physicsObjects.length; i++) {
        const po = physicsObjects[i];
        const autoAnimate = po.autoAnimate;

        if (autoAnimate) {
          const mesh = po.mesh;
          const collider = po.collider;
          mesh.position.copy(collider.translation() as THREE.Vector3);
          mesh.quaternion.copy(collider.rotation() as THREE.Quaternion);
          console.log(mesh.position);
        }

        const fn = po.fn;
        if (fn) {
          fn();
        }
      }

      // performance tracker start
      this.fps = 1000 / this.timeDiff;
      this.lastTimestamp = this.timestamp;
      renderer.render(scene, camera);
      this.tick(timestamp, timeDiffCapped, this.fps, frame);
    };

    renderer.setAnimationLoop(animate);
  }

  tick(timestamp: number, timeDiff: number, fps: number, frame: Frame) {
    localTickData.timestamp = timestamp;
    localTickData.frame = frame;
    localTickData.timeDiff = timeDiff;
    localTickData.fps = fps;
    this.dispatchEvent(frameEvent);
  }
}

export default TickManager;
