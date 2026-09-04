/**
 * Robot simulator for EV3.
 *
 * The entire program - setup (creating the world, floor, EV3, adding controllers) *and* the
 * robot's control program - can be written in any Conductor language (Source, Python, Scheme):
 * this module is a normal `BaseModulePlugin`, the same shape as csg/rune/curve. It used to only
 * be reachable from Source, via a `js-slang/context` import that a Python or Scheme setup program
 * has no equivalent of - see PR #947 for that history.
 *
 * The module itself never touches the DOM/WebGL - it runs inside Conductor's runner Worker, which
 * has neither. All rendering (`THREE.WebGLRenderer`, `OrbitControls`, the canvas, the draw loop)
 * lives entirely in the RobotSimulation tab; this plugin streams entity transforms to it once per
 * physics tick over a dedicated channel, mirroring pix_n_flix's frame channel - see protocol.ts
 * and SceneRegistry's doc comment for the full design.
 *
 * `from robot_simulation import ...` still only works for the *setup* program, not the robot's own
 * control program: whether that code arrives as a string literal (`createPythonCSE`) or from the
 * `repl` tab (`run_robot_code`), it's evaluated by a private, hand-built py-slang `Context` (see
 * controllers/program/pythonRuntime.ts) stepped in lockstep with the physics tick, entirely
 * separate from Conductor's own evaluator/module-loading machinery - there is no
 * `ModuleLoaderRunnerPlugin` inside that shadow context for an `import` to resolve through. The
 * `ev3_*` API is available to it directly by name instead (no import).
 *
 * The recommended student-facing shape is: `init_default_simulation()` + `add_wall`/`add_paper`
 * calls in the main pane (one-time scene setup), then `set_evaluator(run_robot_code)` (from the
 * `repl` module) to hand the robot's own code to a separate, rerunnable REPL tab - see
 * `run_robot_code`'s doc comment.
 *
 * @module robot_simulation
 * @author Joel Chan
 */
import { EvaluatorParameterTypeError, EvaluatorRuntimeError } from '@sourceacademy/conductor/common';
import { makeRpc, type IChannel, type IConduit } from '@sourceacademy/conductor/conduit';
import { BaseModulePlugin } from '@sourceacademy/conductor/module';
import type { IInterfacableEvaluator } from '@sourceacademy/conductor/runner';
import { DataType, type TypedValue } from '@sourceacademy/conductor/types';
import { attachModuleMethod } from '@sourceacademy/modules-lib/conductor/methods';

import { Cuboid, type CuboidConfig } from './controllers/environment/Cuboid';
import { Paper } from './controllers/environment/Paper';
import type { Motor } from './controllers/ev3/components/Motor';
import { ev3Config } from './controllers/ev3/ev3/default/config';
import { createDefaultEv3, type DefaultEv3 } from './controllers/ev3/ev3/default/ev3';
import type { ColorSensor } from './controllers/ev3/sensor/ColorSensor';
import type { UltrasonicSensor } from './controllers/ev3/sensor/UltrasonicSensor';
import { Program } from './controllers/program/Program';
import { createRobotPythonContext } from './controllers/program/pythonRuntime';
import {
  EntityFactory,
  Physics,
  RobotConsole,
  SceneRegistry,
  Timer,
  World,
  type Controller,
} from './engine';
import type { Dimension, SimpleVector } from './engine/Math/Vector';
import { createEv3Functions, type Ev3Functions } from './ev3_functions';
import {
  ROBOT_SIMULATION_CONTROL_CHANNEL_ID,
  ROBOT_SIMULATION_STATE_CHANNEL_ID,
  ROBOT_SIMULATION_TAB_NAME,
  type RobotSimulationModuleRpc,
  type RobotSimulationTabRpc,
  type StateChannelMessage,
} from './protocol';

type RobotSimulationTabLoader = {
  tabs: string[];
  loadTab: (tab: string) => void;
};

export default class RobotSimulationModulePlugin extends BaseModulePlugin {
  id = 'robot_simulation';
  static override channelAttach = [ROBOT_SIMULATION_CONTROL_CHANNEL_ID, ROBOT_SIMULATION_STATE_CHANNEL_ID];
  override exportedNames = [
    'createCustomPhysics',
    'createPhysics',
    'createTimer',
    'createRobotConsole',
    'createWorld',
    'createCuboid',
    'createFloor',
    'createWall',
    'createPaper',
    'createEv3',
    'createPythonCSE',
    'addControllerToWorld',
    'saveToContext',
    'init_simulation',
    'init_default_simulation',
    'add_wall',
    'add_paper',
    'run_robot_code',
    'ev3_motorA',
    'ev3_motorB',
    'ev3_motorC',
    'ev3_motorD',
    'ev3_runToRelativePosition',
    'ev3_pause',
    'ev3_colorSensor',
    'ev3_colorSensorRed',
    'ev3_colorSensorGreen',
    'ev3_colorSensorBlue',
    'ev3_ultrasonicSensor',
    'ev3_ultrasonicSensorDistance',
  ] as const;

  private readonly __tabRpc: RobotSimulationTabRpc;
  private readonly __stateChannel: IChannel<StateChannelMessage>;
  private readonly __tabLoader: RobotSimulationTabLoader | undefined;
  private readonly __sceneRegistry = new SceneRegistry();
  private readonly __ev3Fns: Ev3Functions;
  private __tabLoaded = false;

  /** What `saveToContext`/the `ev3_*` API read/write - one plugin instance per run, so this
    replaces the pre-migration `context.moduleContexts.robot_simulation.state`. */
  private readonly __state: Record<string, unknown> = {};

  constructor(
    conduit: IConduit,
    [controlChannel, stateChannel]: IChannel<any>[],
    evaluator: IInterfacableEvaluator,
    tabLoader?: RobotSimulationTabLoader
  ) {
    if (!controlChannel || !stateChannel) {
      throw new EvaluatorRuntimeError('Robot simulation control/state channels are required but were not provided.');
    }
    super(conduit, [controlChannel, stateChannel], evaluator);

    this.__tabLoader = tabLoader;
    this.__tabRpc = makeRpc<RobotSimulationModuleRpc, RobotSimulationTabRpc>(controlChannel, {
      $runReplCode: code => {
        try {
          this.__runReplCode(code);
        } catch (error) {
          // No live World yet (e.g. the embedded editor's Run button was clicked before the main
          // program ran) - there is no evaluator/caller boundary here to surface this to, unlike
          // run_robot_code's own throw (see its doc comment). The World-state readout already
          // shown in this same tab makes "nothing is running yet" obvious without one.
          console.warn('robot_simulation: could not run code from the RobotSimulation tab\'s embedded editor', error);
        }
      },
    });
    this.__stateChannel = stateChannel as IChannel<StateChannelMessage>;
    this.__sceneRegistry.setSpawnListener(message => this.__stateChannel.send(message));
    this.__ev3Fns = createEv3Functions({
      getWorld: () => this.__getWorldFromContext(),
      getEv3: () => this.__getEv3FromContext(),
    });

    // A tab that (re)connects after entities already exist needs the full backlog replayed -
    // mirrors csg/rune's `{ type: 'request' }` handling.
    this.__stateChannel.subscribe(message => {
      if (message.kind === 'request-replay') {
        this.__sceneRegistry.replaySpawns();
      }
    });
  }

  private __ensureTabLoaded(): void {
    if (this.__tabLoaded || this.__tabLoader === undefined) return;
    const tabName = this.__tabLoader.tabs.find(tab => tab === ROBOT_SIMULATION_TAB_NAME);
    if (tabName === undefined) return;
    this.__tabLoader.loadTab(tabName);
    this.__tabLoaded = true;
  }

  private __getWorldFromContext(): World {
    const world = this.__state.world;
    if (world === undefined) {
      throw new EvaluatorRuntimeError('World not initialized');
    }
    return world as World;
  }

  private __getEv3FromContext(): DefaultEv3 {
    const ev3 = this.__state.ev3;
    if (ev3 === undefined) {
      throw new EvaluatorRuntimeError('ev3 not initialized');
    }
    return ev3 as DefaultEv3;
  }

  private async __getOpaque<T>(value: TypedValue<DataType.OPAQUE>): Promise<T> {
    return (await this.evaluator.opaque_get(value)) as T;
  }

  private __createCuboid(
    physics: Physics,
    position: SimpleVector,
    dimension: Dimension,
    mass: number,
    color: number | string,
    bodyType: string
  ): Cuboid {
    if (!EntityFactory.isRigidBodyType(bodyType)) {
      throw new EvaluatorParameterTypeError('createCuboid', 'bodyType', '"fixed" or "dynamic"', bodyType);
    }
    const config: CuboidConfig = { position, dimension, mass, color, type: bodyType };
    return new Cuboid(physics, this.__sceneRegistry, config);
  }

  /** Wires a freshly-created World's console/state/physics events into the tab - see
   * protocol.ts's doc comment for why everything DOM-facing goes over these channels instead of
    this module touching anything itself. */
  private __hookWorld(world: World): void {
    world.addEventListener('worldStateChange', () => this.__tabRpc.$worldStateChanged(world.state));

    const originalLog = world.robotConsole.log.bind(world.robotConsole);
    world.robotConsole.log = (message, level) => {
      originalLog(message, level);
      this.__tabRpc.$consoleLog(message, level);
    };

    world.physics.addEventListener('afterPhysicsUpdate', () => this.__pushSnapshot());
  }

  private __pushSnapshot(): void {
    // `.buffer` is freshly allocated by `new Float32Array(...)` inside `snapshot()`, so it is
    // always a plain ArrayBuffer - its declared type is only wider (ArrayBufferLike) because a
    // typed array could in general wrap a SharedArrayBuffer instead.
    const buffer = this.__sceneRegistry.snapshot().buffer as ArrayBuffer;
    this.__stateChannel.send({ kind: 'state-snapshot', buffer }, [buffer]);

    const ev3 = this.__state.ev3 as DefaultEv3 | undefined;
    if (!ev3) return;
    this.__tabRpc.$sensorSnapshot({
      leftMotorVelocity: ev3.get('leftMotor').motorVelocity,
      rightMotorVelocity: ev3.get('rightMotor').motorVelocity,
      colorSensor: ev3.get('colorSensor').sense(),
      ultrasonicDistanceCm: ev3.get('ultrasonicSensor').sense(),
    });
  }

  // [Configuration]

  async* createCustomPhysics(
    gravity: TypedValue<DataType.NUMBER>,
    timestep: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    const physics = new Physics({ gravity: { x: 0, y: gravity.value, z: 0 }, timestep: timestep.value });
    return await this.evaluator.opaque_make(physics, true);
  }

  async* createPhysics(): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    const physics = new Physics({ gravity: { x: 0, y: -9.81, z: 0 }, timestep: 1 / 20 });
    return await this.evaluator.opaque_make(physics, true);
  }

  async* createTimer(): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.evaluator.opaque_make(new Timer(), true);
  }

  async* createRobotConsole(): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.evaluator.opaque_make(new RobotConsole(), true);
  }

  async* createWorld(
    physics: TypedValue<DataType.OPAQUE>,
    timer: TypedValue<DataType.OPAQUE>,
    robotConsole: TypedValue<DataType.OPAQUE>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    const world = new World(
      await this.__getOpaque<Physics>(physics),
      await this.__getOpaque<Timer>(timer),
      await this.__getOpaque<RobotConsole>(robotConsole)
    );
    return await this.evaluator.opaque_make(world, true);
  }

  async* createCuboid(
    physics: TypedValue<DataType.OPAQUE>,
    position_x: TypedValue<DataType.NUMBER>,
    position_y: TypedValue<DataType.NUMBER>,
    position_z: TypedValue<DataType.NUMBER>,
    width: TypedValue<DataType.NUMBER>,
    length: TypedValue<DataType.NUMBER>,
    height: TypedValue<DataType.NUMBER>,
    mass: TypedValue<DataType.NUMBER>,
    color: TypedValue<DataType.CONST_STRING>,
    bodyType: TypedValue<DataType.CONST_STRING>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    const cuboid = this.__createCuboid(
      await this.__getOpaque<Physics>(physics),
      { x: position_x.value, y: position_y.value, z: position_z.value },
      { width: width.value, length: length.value, height: height.value },
      mass.value,
      color.value,
      bodyType.value
    );
    return await this.evaluator.opaque_make(cuboid, true);
  }

  async* createFloor(physics: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    const floor = this.__createCuboid(
      await this.__getOpaque<Physics>(physics),
      { x: 0, y: -0.5, z: 0 },
      { width: 20, length: 20, height: 1 },
      1,
      'white',
      'fixed'
    );
    return await this.evaluator.opaque_make(floor, true);
  }

  async* createWall(
    physics: TypedValue<DataType.OPAQUE>,
    x: TypedValue<DataType.NUMBER>,
    y: TypedValue<DataType.NUMBER>,
    width: TypedValue<DataType.NUMBER>,
    length: TypedValue<DataType.NUMBER>,
    height: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    const wall = this.__createCuboid(
      await this.__getOpaque<Physics>(physics),
      { x: x.value, y: height.value / 2, z: y.value },
      { width: width.value, length: length.value, height: height.value },
      1,
      'yellow',
      'fixed'
    );
    return await this.evaluator.opaque_make(wall, true);
  }

  async* createPaper(
    url: TypedValue<DataType.CONST_STRING>,
    width: TypedValue<DataType.NUMBER>,
    height: TypedValue<DataType.NUMBER>,
    x: TypedValue<DataType.NUMBER>,
    y: TypedValue<DataType.NUMBER>,
    rotation: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    const paper = new Paper(this.__sceneRegistry, {
      url: url.value,
      dimension: { width: width.value, height: height.value },
      position: { x: x.value, y: y.value },
      rotation: (rotation.value * Math.PI) / 180,
    });
    return await this.evaluator.opaque_make(paper, true);
  }

  async* createEv3(physics: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    const ev3 = createDefaultEv3(await this.__getOpaque<Physics>(physics), this.__sceneRegistry, ev3Config);
    return await this.evaluator.opaque_make(ev3, true);
  }

  /**
   * Creates a CSE machine as a Program Object, running Python. The Python program can call the
   * whole `ev3_*` API directly by name; no `import` is needed (and none is possible - see
   * pythonRuntime.ts). `print(...)` goes to the simulation's Robot Console panel.
   *
   * @param code The robot's control program, written in Python (SICPy §4).
   */
  async* createPythonCSE(code: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    const pyContext = createRobotPythonContext(this.__ev3Fns, () => this.__getWorldFromContext());
    const program = new Program(code.value, undefined, pyContext);
    return await this.evaluator.opaque_make(program, true);
  }

  async* addControllerToWorld(
    controller: TypedValue<DataType.OPAQUE>,
    world: TypedValue<DataType.OPAQUE>
  ): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    const worldValue = await this.__getOpaque<World>(world);
    worldValue.addController(await this.__getOpaque<Controller>(controller));
    return { type: DataType.VOID, value: undefined };
  }

  async* saveToContext(
    key: TypedValue<DataType.CONST_STRING>,
    value: TypedValue<DataType.OPAQUE>
  ): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    this.__state[key.value] = await this.evaluator.opaque_get(value);
    return { type: DataType.VOID, value: undefined };
  }

  /**
   * Initialize the simulation world. The callback takes no parameters and returns a world created
   * by `createWorld` (with controllers already added via `addControllerToWorld`). Physics starts
   * running as soon as `init()` resolves - unlike the pre-migration version, this no longer waits
   * for the tab to be opened first (the tab has no way to signal the module at all besides the
   * exported functions student code calls - see protocol.ts), so the simulation is "live" from
   * the moment `init_simulation` returns, whether or not anyone has the tab open to watch it yet.
   */
  async* init_simulation(
    worldFactory: TypedValue<DataType.CLOSURE>
  ): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    if (this.__state.world !== undefined) {
      return { type: DataType.VOID, value: undefined };
    }
    this.__ensureTabLoaded();

    const result = yield* this.evaluator.closure_call_unchecked(
      worldFactory as TypedValue<DataType.CLOSURE, DataType.OPAQUE>,
      []
    );
    if (result.type !== DataType.OPAQUE) {
      throw new EvaluatorRuntimeError('init_simulation: the callback must return a World (see createWorld)');
    }
    const world = (await this.evaluator.opaque_get(result)) as World;

    this.__hookWorld(world);
    await world.init();
    world.start();

    return { type: DataType.VOID, value: undefined };
  }

  /**
   * The boilerplate-free alternative to `init_simulation`: builds default physics, a default
   * world, a default floor and a default EV3 (the same defaults `createPhysics`/`createFloor`/
   * `createEv3` use), and starts the simulation - all in one call. Takes no control program: pair
   * this with `run_robot_code`/the `repl` module (see that method's doc comment) to drive the EV3
   * from a separate, rerunnable REPL tab instead of a control-code string baked into setup.
   *
   * For a customised World (non-default physics/gravity, a control program written in
   * Source/Scheme instead of Python), use `createPhysics`/`createWorld`/`createWall`/
   * `createPaper`/`createPythonCSE`/`addControllerToWorld`/`saveToContext`/`init_simulation`
   * directly instead, exactly as before.
   */
  async* init_default_simulation(): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    if (this.__state.world !== undefined) {
      return { type: DataType.VOID, value: undefined };
    }
    this.__ensureTabLoaded();

    const physics = new Physics({ gravity: { x: 0, y: -9.81, z: 0 }, timestep: 1 / 20 });
    const world = new World(physics, new Timer(), new RobotConsole());
    const floor = this.__createCuboid(
      physics,
      { x: 0, y: -0.5, z: 0 },
      { width: 20, length: 20, height: 1 },
      1,
      'white',
      'fixed'
    );
    const ev3 = createDefaultEv3(physics, this.__sceneRegistry, ev3Config);

    world.addController(floor, ev3);

    this.__state.world = world;
    this.__state.ev3 = ev3;

    this.__hookWorld(world);
    await world.init();
    world.start();

    return { type: DataType.VOID, value: undefined };
  }

  /**
   * Adds a fixed yellow wall to the already-initialised default world (`init_default_simulation`
   * must have been called first) - a friendly wrapper over `createWall`/`addControllerToWorld`
   * that doesn't need `physics`/`world` opaque handles, since `init_default_simulation` already
   * owns both. Uses `World.addLiveController` rather than `addController` because the world is
   * already running by the time a student calls this from the setup pane.
   */
  async* add_wall(
    x: TypedValue<DataType.NUMBER>,
    y: TypedValue<DataType.NUMBER>,
    width: TypedValue<DataType.NUMBER>,
    length: TypedValue<DataType.NUMBER>,
    height: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    const world = this.__getWorldFromContext();
    const wall = this.__createCuboid(
      world.physics,
      { x: x.value, y: height.value / 2, z: y.value },
      { width: width.value, length: length.value, height: height.value },
      1,
      'yellow',
      'fixed'
    );
    world.addLiveController(wall);
    return { type: DataType.VOID, value: undefined };
  }

  /**
   * Adds a visual (non-collidable - see Paper.ts's doc comment) floor overlay to the
   * already-initialised default world - a friendly wrapper over `createPaper`/
   * `addControllerToWorld` for the same reason as `add_wall`.
   */
  async* add_paper(
    url: TypedValue<DataType.CONST_STRING>,
    width: TypedValue<DataType.NUMBER>,
    height: TypedValue<DataType.NUMBER>,
    x: TypedValue<DataType.NUMBER>,
    y: TypedValue<DataType.NUMBER>,
    rotation: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    const world = this.__getWorldFromContext();
    const paper = new Paper(this.__sceneRegistry, {
      url: url.value,
      dimension: { width: width.value, height: height.value },
      position: { x: x.value, y: y.value },
      rotation: (rotation.value * Math.PI) / 180,
    });
    world.addLiveController(paper);
    return { type: DataType.VOID, value: undefined };
  }

  /**
   * The `repl`-module hook: pass this function itself to `repl`'s `set_evaluator`, and the `repl`
   * tab it opens will call it with whatever the student typed there each time they hit Run -
   * `code` is exactly what `createPythonCSE`/`init_default_simulation`'s old `control_code`
   * argument used to be, just supplied interactively instead of baked into the setup program.
   *
   * Each call adds a fresh `Program` controller (via `World.addLiveController`, since the world is
   * already running by this point) rather than editing one in place, but all calls share one
   * `pyContext` (lazily created on the first call, cached in `__state`) - `runPythonECEvaluator`
   * re-analyzes each run against that same context's global environment (see evaluate.ts), so
   * variables and function defs a student's REPL code creates in one run are still visible in the
   * next, the way a REPL is expected to behave. The previous run's `Program` is `stop()`'d first so
   * it can't keep pumping its now-superseded generator against the same shared `pyContext` (see
   * `Program.stop`'s doc comment).
   *
   * Requires `init_default_simulation`/`init_simulation` to have already been called - there must
   * be a live World for the robot code to act on.
   *
   * Also calls `$focusTab` on success, asking the RobotSimulation tab to bring itself to the
   * front - but the frontend's side-content host only actually honours that the *first* time any
   * tab is shown in a session (see `SideContentManager.showTab`'s "don't yank the student away from
   * wherever they navigated" guard), so in practice this rarely does anything once the student has
   * looked at any tab at all. A student who wants the 3D view and the code they're driving the
   * robot with on screen *together*, without fighting that guard, should use the RobotSimulation
   * tab's own embedded editor instead (`$runReplCode` in protocol.ts) - same effect as this
   * function, just triggered from inside the tab that's already showing the 3D view, so there's
   * nothing to focus/switch away from in the first place.
   */
  async* run_robot_code(
    code: TypedValue<DataType.CONST_STRING>
  ): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    this.__runReplCode(code.value);
    return { type: DataType.VOID, value: undefined };
  }

  /**
   * Shared by `run_robot_code` (the `repl`-module hook, above) and `$runReplCode` (the
   * RobotSimulation tab's own embedded mini-editor - see protocol.ts's doc comment on
   * `RobotSimulationModuleRpc`) - same effect either way, just reached from two different callers.
   * Throws (via `__getWorldFromContext`) if no World exists yet; `run_robot_code` lets that
   * propagate (repl displays it as an error), while the `$runReplCode` RPC handler catches and logs
   * it instead, since there is no evaluator/caller boundary there to surface a throw to.
   */
  private __runReplCode(code: string): void {
    const world = this.__getWorldFromContext();

    if (this.__state.replPyContext === undefined) {
      this.__state.replPyContext = createRobotPythonContext(this.__ev3Fns, () => this.__getWorldFromContext());
    }
    const pyContext = this.__state.replPyContext as ReturnType<typeof createRobotPythonContext>;

    (this.__state.replProgram as Program | undefined)?.stop();

    const program = new Program(code, undefined, pyContext);
    world.addLiveController(program);
    this.__state.replProgram = program;

    this.__tabRpc.$focusTab();
  }

  // [EV3]

  async* ev3_motorA(): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.evaluator.opaque_make(this.__ev3Fns.ev3_motorA(), true);
  }

  async* ev3_motorB(): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.evaluator.opaque_make(this.__ev3Fns.ev3_motorB(), true);
  }

  async* ev3_motorC(): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.evaluator.opaque_make(this.__ev3Fns.ev3_motorC(), true);
  }

  async* ev3_motorD(): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.evaluator.opaque_make(this.__ev3Fns.ev3_motorD(), true);
  }

  async* ev3_runToRelativePosition(
    motor: TypedValue<DataType.OPAQUE>,
    position: TypedValue<DataType.NUMBER>,
    speed: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    this.__ev3Fns.ev3_runToRelativePosition(await this.__getOpaque<Motor | null>(motor), position.value, speed.value);
    return { type: DataType.VOID, value: undefined };
  }

  async* ev3_pause(duration: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    this.__ev3Fns.ev3_pause(duration.value);
    return { type: DataType.VOID, value: undefined };
  }

  async* ev3_colorSensor(): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.evaluator.opaque_make(this.__ev3Fns.ev3_colorSensor(), true);
  }

  async* ev3_colorSensorRed(colorSensor: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, undefined> {
    return { type: DataType.NUMBER, value: this.__ev3Fns.ev3_colorSensorRed(await this.__getOpaque<ColorSensor>(colorSensor)) };
  }

  async* ev3_colorSensorGreen(colorSensor: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, undefined> {
    return { type: DataType.NUMBER, value: this.__ev3Fns.ev3_colorSensorGreen(await this.__getOpaque<ColorSensor>(colorSensor)) };
  }

  async* ev3_colorSensorBlue(colorSensor: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, undefined> {
    return { type: DataType.NUMBER, value: this.__ev3Fns.ev3_colorSensorBlue(await this.__getOpaque<ColorSensor>(colorSensor)) };
  }

  async* ev3_ultrasonicSensor(): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.evaluator.opaque_make(this.__ev3Fns.ev3_ultrasonicSensor(), true);
  }

  async* ev3_ultrasonicSensorDistance(sensor: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, undefined> {
    return { type: DataType.NUMBER, value: this.__ev3Fns.ev3_ultrasonicSensorDistance(await this.__getOpaque<UltrasonicSensor>(sensor)) };
  }
}

attachModuleMethod(RobotSimulationModulePlugin, 'createCustomPhysics', [DataType.NUMBER, DataType.NUMBER], DataType.OPAQUE);
attachModuleMethod(RobotSimulationModulePlugin, 'createPhysics', [], DataType.OPAQUE);
attachModuleMethod(RobotSimulationModulePlugin, 'createTimer', [], DataType.OPAQUE);
attachModuleMethod(RobotSimulationModulePlugin, 'createRobotConsole', [], DataType.OPAQUE);
attachModuleMethod(RobotSimulationModulePlugin, 'createWorld', [DataType.OPAQUE, DataType.OPAQUE, DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RobotSimulationModulePlugin, 'createCuboid', [
  DataType.OPAQUE, DataType.NUMBER, DataType.NUMBER, DataType.NUMBER,
  DataType.NUMBER, DataType.NUMBER, DataType.NUMBER, DataType.NUMBER,
  DataType.CONST_STRING, DataType.CONST_STRING,
], DataType.OPAQUE);
attachModuleMethod(RobotSimulationModulePlugin, 'createFloor', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RobotSimulationModulePlugin, 'createWall', [DataType.OPAQUE, DataType.NUMBER, DataType.NUMBER, DataType.NUMBER, DataType.NUMBER, DataType.NUMBER], DataType.OPAQUE);
attachModuleMethod(RobotSimulationModulePlugin, 'createPaper', [DataType.CONST_STRING, DataType.NUMBER, DataType.NUMBER, DataType.NUMBER, DataType.NUMBER, DataType.NUMBER], DataType.OPAQUE);
attachModuleMethod(RobotSimulationModulePlugin, 'createEv3', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RobotSimulationModulePlugin, 'createPythonCSE', [DataType.CONST_STRING], DataType.OPAQUE);
attachModuleMethod(RobotSimulationModulePlugin, 'addControllerToWorld', [DataType.OPAQUE, DataType.OPAQUE], DataType.VOID);
attachModuleMethod(RobotSimulationModulePlugin, 'saveToContext', [DataType.CONST_STRING, DataType.OPAQUE], DataType.VOID);
attachModuleMethod(RobotSimulationModulePlugin, 'init_simulation', [DataType.CLOSURE], DataType.VOID);
attachModuleMethod(RobotSimulationModulePlugin, 'init_default_simulation', [], DataType.VOID);
attachModuleMethod(RobotSimulationModulePlugin, 'add_wall', [DataType.NUMBER, DataType.NUMBER, DataType.NUMBER, DataType.NUMBER, DataType.NUMBER], DataType.VOID);
attachModuleMethod(RobotSimulationModulePlugin, 'add_paper', [DataType.CONST_STRING, DataType.NUMBER, DataType.NUMBER, DataType.NUMBER, DataType.NUMBER, DataType.NUMBER], DataType.VOID);
attachModuleMethod(RobotSimulationModulePlugin, 'run_robot_code', [DataType.CONST_STRING], DataType.VOID);
attachModuleMethod(RobotSimulationModulePlugin, 'ev3_motorA', [], DataType.OPAQUE);
attachModuleMethod(RobotSimulationModulePlugin, 'ev3_motorB', [], DataType.OPAQUE);
attachModuleMethod(RobotSimulationModulePlugin, 'ev3_motorC', [], DataType.OPAQUE);
attachModuleMethod(RobotSimulationModulePlugin, 'ev3_motorD', [], DataType.OPAQUE);
attachModuleMethod(RobotSimulationModulePlugin, 'ev3_runToRelativePosition', [DataType.OPAQUE, DataType.NUMBER, DataType.NUMBER], DataType.VOID);
attachModuleMethod(RobotSimulationModulePlugin, 'ev3_pause', [DataType.NUMBER], DataType.VOID);
attachModuleMethod(RobotSimulationModulePlugin, 'ev3_colorSensor', [], DataType.OPAQUE);
attachModuleMethod(RobotSimulationModulePlugin, 'ev3_colorSensorRed', [DataType.OPAQUE], DataType.NUMBER);
attachModuleMethod(RobotSimulationModulePlugin, 'ev3_colorSensorGreen', [DataType.OPAQUE], DataType.NUMBER);
attachModuleMethod(RobotSimulationModulePlugin, 'ev3_colorSensorBlue', [DataType.OPAQUE], DataType.NUMBER);
attachModuleMethod(RobotSimulationModulePlugin, 'ev3_ultrasonicSensor', [], DataType.OPAQUE);
attachModuleMethod(RobotSimulationModulePlugin, 'ev3_ultrasonicSensorDistance', [DataType.OPAQUE], DataType.NUMBER);
