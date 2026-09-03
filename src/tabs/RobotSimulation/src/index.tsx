import { sceneConfig } from '@sourceacademy/bundle-robot_simulation/config';
import { MeshFactory, getCamera, loadGLTF } from '@sourceacademy/bundle-robot_simulation/engine';
import {
  ROBOT_SIMULATION_CONTROL_CHANNEL_ID,
  ROBOT_SIMULATION_STATE_CHANNEL_ID,
  type EntityDescriptor,
  type RobotSimulationTabRpc,
  type SensorSnapshot,
  type StateChannelMessage,
  type WorldStateName,
} from '@sourceacademy/bundle-robot_simulation/protocol';
import type { ITabService, Tab } from '@sourceacademy/common-tabs';
import { checkIsPluginClass, makeRpc, type IChannel, type IConduit, type IPlugin } from '@sourceacademy/conductor/conduit';
import { createElement, useEffect, useRef, useSyncExternalStore } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const ROBOT_SIMULATION_TAB_ID = 'robot_simulation';

type LogEntry = { message: string, level: 'error' | 'source', timestamp: number };

interface ViewState {
  worldState: WorldStateName;
  sensors: SensorSnapshot | undefined;
  logs: readonly LogEntry[];
}

const MAX_LOGS = 200;

/**
 * Host-side (browser main thread) counterpart of `RobotSimulationModulePlugin` (in the
 * robot_simulation bundle) - owns everything DOM/WebGL-touching: `THREE.WebGLRenderer`,
 * `OrbitControls`, the canvas, and the render loop, none of which the module itself can touch any
 * more (see protocol.ts and SceneRegistry's doc comment in the bundle). Mirrors
 * `PixNFlixTabPlugin`'s shape: implements the module's RPC interface directly, and separately
 * subscribes to a dedicated state channel for the high-frequency (per physics tick) entity
 * transform stream, which is sent as a transferable rather than routed through RPC.
 *
 * Builds real THREE geometry from each `EntityDescriptor` the module streams over the state
 * channel the first time an entity is seen, then just keeps repositioning/reorienting that
 * geometry every tick from the transform snapshot - the module never sends geometry more than
 * once per entity.
 */
// eslint-disable-next-line @sourceacademy/tab-type
export default class RobotSimulationTabPlugin implements IPlugin, RobotSimulationTabRpc {
  readonly id = 'robot-simulation-web';
  static readonly channelAttach = [ROBOT_SIMULATION_CONTROL_CHANNEL_ID, ROBOT_SIMULATION_STATE_CHANNEL_ID];

  private readonly __tabService: ITabService;
  private readonly __stateChannel: IChannel<StateChannelMessage>;
  private readonly __listeners = new Set<() => void>();

  private readonly __scene = new THREE.Scene();
  private readonly __camera = getCamera({
    type: 'perspective',
    aspect: sceneConfig.width / sceneConfig.height,
    fov: 75,
    near: 0.1,
    far: 1000,
  });
  private __renderer: THREE.WebGLRenderer | undefined;
  private __controls: OrbitControls | undefined;
  private __requestId: number | undefined;

  /** One entry per entity the module has ever told us about. For a 'gltf' entity this is a
   * placeholder `Object3D` added immediately (so transform updates never have nowhere to go) -
    the actual loaded model is added as its child once `loadGLTF` resolves. */
  private readonly __entities = new Map<number, THREE.Object3D>();

  private __state: ViewState = {
    worldState: 'unintialized',
    sensors: undefined,
    logs: [],
  };

  constructor(_conduit: IConduit, [controlChannel, stateChannel]: IChannel<any>[], tabService: ITabService) {
    if (!controlChannel || !stateChannel) {
      throw new Error('Robot simulation control/state channels are required but were not provided.');
    }
    this.__tabService = tabService;
    this.__stateChannel = stateChannel as IChannel<StateChannelMessage>;

    makeRpc<RobotSimulationTabRpc, Record<string, never>>(controlChannel, this);

    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(0, 1, 0);
    this.__scene.add(light);
    this.__scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    this.__scene.background = new THREE.Color(0xffffff);

    this.__stateChannel.subscribe(message => {
      if (message.kind === 'entity-spawned') {
        this.__spawnEntity(message.id, message.descriptor);
      } else if (message.kind === 'state-snapshot') {
        this.__applySnapshot(message.buffer);
      }
    });
    // A tab that mounts after the module has already spawned entities needs the backlog replayed
    // - mirrors csg/rune's `{ type: 'request' }`.
    this.__stateChannel.send({ kind: 'request-replay' });

    const subscribe = (listener: () => void) => this.__subscribe(listener);
    const getState = () => this.__state;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const plugin = this;
    function RobotSimulationView() {
      const state = useSyncExternalStore(subscribe, getState);
      const canvasRef = useRef<HTMLCanvasElement | null>(null);

      useEffect(() => {
        if (canvasRef.current) plugin.__attachCanvas(canvasRef.current);
        return () => plugin.__detachCanvas();
      }, []);

      return createElement(RobotSimulationView_, { state, canvasRef });
    }

    const tab = {
      id: ROBOT_SIMULATION_TAB_ID,
      iconName: 'build',
      body: createElement(RobotSimulationView),
      label: 'Robot Simulation',
      disabled: false,
    } satisfies Tab;

    this.__tabService.registerTab(tab);
    this.__tabService.showTab(ROBOT_SIMULATION_TAB_ID);
  }

  destroy(): void {
    this.__detachCanvas();
  }

  private __subscribe(listener: () => void): () => void {
    this.__listeners.add(listener);
    return () => this.__listeners.delete(listener);
  }

  private __emit(): void {
    this.__listeners.forEach(listener => listener());
  }

  private __setState(patch: Partial<ViewState>): void {
    this.__state = { ...this.__state, ...patch };
    this.__emit();
  }

  private __spawnEntity(id: number, descriptor: EntityDescriptor): void {
    if (this.__entities.has(id)) return;

    if (descriptor.kind === 'cuboid') {
      const mesh = MeshFactory.addCuboid({
        orientation: { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0, w: 1 } },
        dimension: descriptor.dimension,
        color: new THREE.Color(descriptor.color),
        debug: false,
      });
      this.__scene.add(mesh);
      this.__entities.set(id, mesh);
      return;
    }

    if (descriptor.kind === 'paper') {
      const geometry = new THREE.PlaneGeometry(descriptor.width, descriptor.height);
      const texture = new THREE.TextureLoader().load(descriptor.url);
      const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ map: texture }));
      this.__scene.add(mesh);
      this.__entities.set(id, mesh);
      return;
    }

    // 'gltf': add a placeholder immediately so a transform snapshot arriving before the model
    // finishes loading still has somewhere to go; the real model becomes its child once ready.
    const holder = new THREE.Object3D();
    this.__scene.add(holder);
    this.__entities.set(id, holder);
    loadGLTF(descriptor.url, descriptor.dimension)
      .then(data => holder.add(data.scene))
      .catch(error => console.warn('robot_simulation tab: failed to load GLTF asset:', descriptor.url, error));
  }

  private __applySnapshot(buffer: ArrayBuffer): void {
    const view = new Float32Array(buffer);
    const stride = 8;
    for (let offset = 0; offset + stride <= view.length; offset += stride) {
      const node = this.__entities.get(view[offset]);
      if (!node) continue;
      node.position.set(view[offset + 1], view[offset + 2], view[offset + 3]);
      node.quaternion.set(view[offset + 4], view[offset + 5], view[offset + 6], view[offset + 7]);
    }
  }

  private __attachCanvas(canvas: HTMLCanvasElement): void {
    this.__renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.__renderer.shadowMap.enabled = true;
    this.__renderer.setSize(sceneConfig.width, sceneConfig.height);
    this.__renderer.setPixelRatio(window.devicePixelRatio * 1.5);
    this.__controls = new OrbitControls(this.__camera, this.__renderer.domElement);
    this.__requestId = window.requestAnimationFrame(this.__tick);
  }

  private __detachCanvas(): void {
    if (this.__requestId !== undefined) {
      window.cancelAnimationFrame(this.__requestId);
      this.__requestId = undefined;
    }
    this.__controls?.dispose();
    this.__controls = undefined;
    this.__renderer = undefined;
  }

  private __tick = (): void => {
    this.__requestId = window.requestAnimationFrame(this.__tick);
    this.__controls?.update();
    this.__renderer?.render(this.__scene, this.__camera);
  };

  // [RobotSimulationTabRpc]

  $consoleLog(message: string, level: 'error' | 'source'): void {
    const logs = [...this.__state.logs, { message, level, timestamp: Date.now() }];
    this.__setState({ logs: logs.length > MAX_LOGS ? logs.slice(logs.length - MAX_LOGS) : logs });
  }

  $worldStateChanged(state: WorldStateName): void {
    this.__setState({ worldState: state });
  }

  $sensorSnapshot(snapshot: SensorSnapshot): void {
    this.__setState({ sensors: snapshot });
  }
}
checkIsPluginClass(RobotSimulationTabPlugin);

function RobotSimulationView_({ state, canvasRef }: { state: ViewState, canvasRef: React.RefObject<HTMLCanvasElement | null> }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      <div
        style={{
          width: sceneConfig.width,
          height: sceneConfig.height,
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
        }}
      >
        <canvas ref={canvasRef} width={sceneConfig.width} height={sceneConfig.height} />
      </div>
      <div style={{ display: 'flex', gap: '1rem', fontFamily: 'monospace', fontSize: 12 }}>
        <div>World: {state.worldState}</div>
        {state.sensors && (
          <>
            <div>Left motor: {state.sensors.leftMotorVelocity.toFixed(2)}</div>
            <div>Right motor: {state.sensors.rightMotorVelocity.toFixed(2)}</div>
            <div>
              Color: rgb({state.sensors.colorSensor.r.toFixed(0)}, {state.sensors.colorSensor.g.toFixed(0)}, {state.sensors.colorSensor.b.toFixed(0)})
            </div>
            <div>Ultrasonic: {state.sensors.ultrasonicDistanceCm.toFixed(1)} cm</div>
          </>
        )}
      </div>
      <div
        style={{
          width: sceneConfig.width,
          height: 150,
          overflowY: 'auto',
          backgroundColor: '#1a2530',
          color: '#fff',
          fontFamily: 'monospace',
          fontSize: 12,
          padding: '0.5rem',
          borderRadius: 3,
        }}
      >
        {state.logs.map((log, index) => (

          <div key={index} style={{ color: log.level === 'error' ? '#ff6b6b' : undefined }}>
            {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}
