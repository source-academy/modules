import { sceneConfig } from '@sourceacademy/bundle-robot_simulation/config';
import { DEFAULT_LOOK_AT, MeshFactory, getCamera, loadGLTF } from '@sourceacademy/bundle-robot_simulation/engine';
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
 * Where the viewer's last camera position/orbit target is remembered across a reload or a
 * re-run of the program - see `__saveCameraView`/`__loadCameraView`. Keyed in `localStorage`,
 * which is per-browser, not per-program-run - exactly "did the person looking at this tab move
 * the camera" state, same category as "which tab is open", not simulation state.
 */
const CAMERA_VIEW_STORAGE_KEY = 'robot_simulation:camera-view';

type StoredCameraView = {
  position: [number, number, number];
  target: [number, number, number];
};

function isStoredCameraView(value: unknown): value is StoredCameraView {
  const isVec3 = (v: unknown): v is [number, number, number] => Array.isArray(v) && v.length === 3 && v.every(n => typeof n === 'number' && Number.isFinite(n));
  return typeof value === 'object' && value !== null
    && isVec3((value as StoredCameraView).position) && isVec3((value as StoredCameraView).target);
}

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

  /** ids of every 'gltf'-kind entity seen so far - the EV3's chassis mesh (Mesh.ts) and its wheels
   * (Motor.ts/Wheel.ts) are the *only* things this bundle ever spawns as 'gltf' (everything else -
   * `createCuboid`/`createWall`/`createFloor`, `createPaper` - is 'cuboid'/'paper'), so this set is
   * exactly "the EV3, as a set of parts" with no extra bookkeeping needed to tell it apart from
   * other scene content. Used by {@link __focusOnEv3} ("F to focus", Unity/Blender-style).
   */
  private readonly __ev3EntityIds = new Set<number>();

  private __keydownListener: ((e: KeyboardEvent) => void) | undefined;
  private __controlsEndListener: (() => void) | undefined;
  /**
   * Whether the default auto-focus (see `__applySnapshot`) should stay suppressed for the
   * *current* World - true once it has already fired for this run, or once a saved view exists
   * (re-checked fresh from `localStorage` on every `$worldStateChanged('loading')`, i.e. every Run
   * - not just cached from the tab's initial attach - so a manual drag/F-focus made *during* an
   * earlier run still suppresses auto-focus on a later re-run of the program, matching
   * `__loadCameraView`/`__saveCameraView`'s existing "the viewer's view survives a re-run" intent).
   * Reset to that same "does a saved view exist" check (not unconditionally to `false`) so a fresh
   * run still frames whatever the new World actually spawned, unless the viewer already has a view
    they set up themselves.
   */
  private __suppressAutoFocus = false;

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
    this.__ev3EntityIds.add(id);
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

    // The EV3's spawn position isn't known until its first transform snapshot lands (it's created
    // at the origin - see __spawnEntity's placeholder), so "default to the F-focused view" can only
    // happen here, on the first snapshot that actually contains it - not at canvas-attach time,
    // when __focusOnEv3 would find an empty/zero-size bounding box and no-op. Skipped once already
    // suppressed for this run (a saved view, or this having already fired) - see
    // `__suppressAutoFocus`'s doc comment.
    if (!this.__suppressAutoFocus && this.__ev3EntityIds.size > 0 && this.__controls) {
      this.__suppressAutoFocus = true;
      this.__focusOnEv3();
    }
  }

  private __attachCanvas(canvas: HTMLCanvasElement): void {
    this.__renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.__renderer.shadowMap.enabled = true;
    this.__renderer.setSize(sceneConfig.width, sceneConfig.height);
    this.__renderer.setPixelRatio(window.devicePixelRatio * 1.5);
    this.__controls = new OrbitControls(this.__camera, this.__renderer.domElement);
    // Orbiting needs a target, not just a camera position - without this the controls' own
    // `update()` (called every render frame in __tick) would silently re-point the camera back at
    // the world origin (their default target) on the very first frame, undoing getCamera()'s own
    // "look at the EV3's spawn point" default.
    this.__controls.target.copy(DEFAULT_LOOK_AT);
    this.__controls.enableDamping = true;
    this.__controls.dampingFactor = 0.1;
    this.__controls.zoomSpeed = 0.6;

    // A view the viewer already set up (by dragging/zooming, or F-focusing) survives a reload or
    // a re-run of the program instead of snapping back to getCamera()'s default every time - see
    // `__loadCameraView`/`__saveCameraView`. Only overrides the (camera, controls.target) pair
    // just set above if something was actually saved.
    this.__suppressAutoFocus = this.__loadCameraView();
    this.__controls.update();

    // "F to focus" (Unity/Blender-style): only wired to this canvas, not the page, and only fires
    // while the canvas itself has focus - a plain keydown on `window` would steal every "f"
    // keystroke typed anywhere else in the app (e.g. the code editor). `tabIndex` on the canvas
    // (set in RobotSimulationView_) is what makes it focusable/receive keyboard events at all.
    this.__keydownListener = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        this.__focusOnEv3();
        this.__saveCameraView();
      }
    };
    canvas.addEventListener('keydown', this.__keydownListener);

    // Persist on 'end' (fired once per drag/zoom/pan gesture), not 'change' (fired continuously
    // mid-gesture, dozens of times a second) - plenty responsive for "remember where I left the
    // camera" without hammering localStorage on every frame of a drag.
    this.__controlsEndListener = () => this.__saveCameraView();
    this.__controls.addEventListener('end', this.__controlsEndListener);

    this.__requestId = window.requestAnimationFrame(this.__tick);
  }

  private __detachCanvas(): void {
    if (this.__requestId !== undefined) {
      window.cancelAnimationFrame(this.__requestId);
      this.__requestId = undefined;
    }
    if (this.__keydownListener) {
      this.__renderer?.domElement.removeEventListener('keydown', this.__keydownListener);
      this.__keydownListener = undefined;
    }
    if (this.__controlsEndListener) {
      this.__controls?.removeEventListener('end', this.__controlsEndListener);
      this.__controlsEndListener = undefined;
    }
    this.__controls?.dispose();
    this.__controls = undefined;
    this.__renderer = undefined;
  }

  /**
   * Persists the current camera position + orbit target to `localStorage`, keyed per-browser (not
   * per-program-run) - see {@link CAMERA_VIEW_STORAGE_KEY}. Best-effort: a private-browsing tab or
   * a full storage quota throws on `setItem`, which just means the view doesn't stick - not worth
   * failing the render loop over.
   */
  private __saveCameraView(): void {
    if (!this.__controls) return;
    try {
      const view: StoredCameraView = {
        position: this.__camera.position.toArray(),
        target: this.__controls.target.toArray(),
      };
      window.localStorage.setItem(CAMERA_VIEW_STORAGE_KEY, JSON.stringify(view));
    } catch {
      // See doc comment - not fatal.
    }
  }

  /**
   * Counterpart to {@link __saveCameraView} - applies a previously-saved view, if any, to the
   * current camera/controls. Leaves both at whatever `getCamera()`'s default already put them at
   * if nothing was saved yet, or if what's stored doesn't parse as a valid view (e.g. an older
   * format from a previous version of this tab).
   */
  private __loadCameraView(): boolean {
    if (!this.__controls) return false;
    try {
      const raw = window.localStorage.getItem(CAMERA_VIEW_STORAGE_KEY);
      if (!raw) return false;
      const parsed: unknown = JSON.parse(raw);
      if (!isStoredCameraView(parsed)) return false;
      this.__camera.position.fromArray(parsed.position);
      this.__controls.target.fromArray(parsed.target);
      return true;
    } catch {
      // Corrupt/inaccessible storage - fall back to whatever's already set (the default view).
      return false;
    }
  }

  /** Existence check only (no camera mutation) - unlike `__loadCameraView`, safe to call any time,
   * including before `__controls` exists. See `__suppressAutoFocus`'s doc comment for why this is
    re-checked fresh on every Run rather than cached once. */
  private __hasSavedCameraView(): boolean {
    try {
      const raw = window.localStorage.getItem(CAMERA_VIEW_STORAGE_KEY);
      return raw !== null && isStoredCameraView(JSON.parse(raw));
    } catch {
      return false;
    }
  }

  /** Unity/Blender-style "F to focus selected", hardcoded to "selected" = the EV3 (the only thing
   * a robot_simulation scene ever really has to look at - see `__ev3EntityIds`'s doc comment for
   * why picking it out from arbitrary other scene content, e.g. walls/paper, needs no extra
   * bookkeeping). Recenters `OrbitControls.target` on the EV3's current (live, physics-driven)
   * position and pulls the camera to a distance based on its actual on-screen bounding box,
   * preserving whatever orbit angle/direction the viewer had already set up rather than resetting
   * it to some fixed "front" view.
   */
  private __focusOnEv3(): void {
    if (this.__ev3EntityIds.size === 0 || !this.__controls) return;

    const box = new THREE.Box3();
    let any = false;
    for (const id of this.__ev3EntityIds) {
      const node = this.__entities.get(id);
      if (!node) continue;
      box.expandByObject(node);
      any = true;
    }
    if (!any || box.isEmpty()) return;

    const center = box.getCenter(new THREE.Vector3());
    const radius = Math.max(box.getSize(new THREE.Vector3()).length() / 2, 0.05);
    // ~2.2x the bounding radius keeps the whole robot comfortably inside the frame with a little
    // margin, rather than filling it edge-to-edge.
    const distance = radius * 2.2;

    const direction = this.__camera.position.clone().sub(this.__controls.target);
    if (direction.lengthSq() === 0) direction.set(0, 0.35, -0.4);
    direction.normalize().multiplyScalar(distance);

    this.__controls.target.copy(center);
    this.__camera.position.copy(center).add(direction);
    this.__controls.update();
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
    // 'loading' fires exactly once per Run (World.init(), right at the start of a fresh World's
    // lifecycle - see World.ts), before any entity-spawned/state-snapshot message for it can
    // arrive - the right moment to decide whether *this* run gets a default auto-focus, without
    // racing the snapshots that would otherwise immediately re-suppress it. See
    // `__suppressAutoFocus`'s doc comment for why this re-checks localStorage instead of just
    // resetting to `false`.
    if (state === 'loading') {
      this.__suppressAutoFocus = this.__hasSavedCameraView();
    }
  }

  $sensorSnapshot(snapshot: SensorSnapshot): void {
    this.__setState({ sensors: snapshot });
  }

  $focusTab(): void {
    this.__tabService.showTab(ROBOT_SIMULATION_TAB_ID);
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
        <canvas ref={canvasRef} tabIndex={0} width={sceneConfig.width} height={sceneConfig.height} style={{ outline: 'none' }} />
      </div>
      <div style={{ display: 'flex', gap: '1rem', fontFamily: 'monospace', fontSize: 12, color: '#8a97a3' }}>
        <div>Drag to orbit, scroll to zoom, click the view then press F to focus the robot</div>
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
