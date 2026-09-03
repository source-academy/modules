/**
 * Conductor wiring for robot_simulation: two channels, following pix_n_flix's
 * (`pix_n_flix/src/protocol.ts`) precedent for splitting a real-time visual bundle across the
 * worker/main-thread boundary.
 *
 * The module (this bundle's `BaseModulePlugin`) runs inside Conductor's runner Web Worker,
 * alongside the evaluator - it has no `window`, no `document`, no WebGL. It owns physics
 * (rapier3d-compat, WASM, worker-safe) and the robot control program's CSE stepping. It NEVER
 * constructs a `THREE.WebGLRenderer`, `OrbitControls`, or a canvas - see SceneRegistry's doc
 * comment. All of that - the camera, the canvas, the render loop, mouse-driven orbit controls -
 * is owned entirely by the RobotSimulation tab (real DOM, main thread), exactly like pix_n_flix's
 * tab owning the camera/video/canvas ("unlike the pre-migration version, the module never touches
 * DOM elements").
 *
 * - {@link ROBOT_SIMULATION_CONTROL_CHANNEL_ID}: infrequent RPC (module -> tab pushes: console
 *   log lines, world state changes, sensor snapshots for the debug panels) via Conductor's
 *   `makeRpc`.
 * - {@link ROBOT_SIMULATION_STATE_CHANNEL_ID}: a dedicated channel for the two things that need
 *   to move every physics tick - "a new entity was spawned" (rare) and "here are everyone's
 *   transforms" (every tick). Deliberately NOT routed through `makeRpc` (which structured-clones
 *   every argument): the per-tick transform snapshot is sent as a raw `Float32Array.buffer`
 *   transferred via `IChannel.send(message, [buffer])`, mirroring pix_n_flix's frame channel.
 */
export const ROBOT_SIMULATION_CONTROL_CHANNEL_ID = 'sourceacademy-robot-simulation-control-channel';
export const ROBOT_SIMULATION_STATE_CHANNEL_ID = 'sourceacademy-robot-simulation-state-channel';
export const ROBOT_SIMULATION_TAB_NAME = 'RobotSimulation';

export type EntityDimension = { width: number, height: number, length: number };

/**
 * What the tab should actually draw for one entity. The module only ever produces a bare
 * `THREE.Object3D` transform node for physics/game-logic purposes (see SceneRegistry) - it has no
 * geometry, material, or texture of its own, since building any of those in the worker would be
 * pointless (nothing there can render them). This descriptor is the one-time (per entity) message
 * that tells the tab what real THREE object to build and keep positioned at that node's transform.
 */
export type EntityDescriptor =
  | { kind: 'cuboid', dimension: EntityDimension, color: string }
  | { kind: 'paper', width: number, height: number, url: string }
  | { kind: 'gltf', url: string, dimension: EntityDimension, offsetY: number };

/** Module -> tab: a new entity was added to the scene registry. Replayed in full to a tab that
  (re)connects after entities already exist - mirrors csg/rune's render backlog replay. */
export interface EntitySpawnedMessage {
  kind: 'entity-spawned';
  id: number;
  descriptor: EntityDescriptor;
}

/** Module -> tab: every tracked entity's current transform, laid out as
 * `[id, px, py, pz, qx, qy, qz, qw] * N` in a single `Float32Array` - sent as a transferable, not
  cloned, since this goes out once per physics tick (~20Hz). */
export interface StateSnapshotMessage {
  kind: 'state-snapshot';
  buffer: ArrayBuffer;
}

/** Tab -> module: replay every entity spawned so far (a tab that just mounted / reconnected),
  mirrors csg/rune's `{ type: 'request' }`. */
export interface RequestReplayMessage {
  kind: 'request-replay';
}

export type StateChannelMessage = EntitySpawnedMessage | StateSnapshotMessage | RequestReplayMessage;

export type WorldStateName = 'unintialized' | 'loading' | 'ready' | 'running' | 'error';

export interface SensorSnapshot {
  leftMotorVelocity: number;
  rightMotorVelocity: number;
  colorSensor: { r: number, g: number, b: number };
  ultrasonicDistanceCm: number;
}

/**
 * Host-side (tab, browser main thread) operations the robot_simulation module invokes over
 * {@link ROBOT_SIMULATION_CONTROL_CHANNEL_ID} via Conductor's `makeRpc` - mirrors
 * `PixNFlixTabRpc`/`SoundTabRpc`. `$`-prefixed methods are fire-and-forget.
 */
export interface RobotSimulationTabRpc {
  $consoleLog(message: string, level: 'error' | 'source'): void;
  $worldStateChanged(state: WorldStateName): void;
  $sensorSnapshot(snapshot: SensorSnapshot): void;
}
