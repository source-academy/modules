import {
  Context as PyContext,
  VARIANT_GROUPS,
  type BuiltinValue,
  type Value,
} from '@sourceacademy/py-slang';
import type { World } from '../../engine/World';
import type { Ev3Functions } from '../../ev3_functions';
import type { Motor } from '../ev3/components/Motor';
import type { ColorSensor } from '../ev3/sensor/ColorSensor';
import type { UltrasonicSensor } from '../ev3/sensor/UltrasonicSensor';

/**
 * Builds the py-slang `Context` that a Python-flavoured {@link Program} evaluates against.
 *
 * ## Why this exists
 *
 * `robot_simulation` re-runs the robot's control program *inside* the simulation loop: the
 * `Program` controller (see Program.ts) owns a CSE machine that is stepped `stepsPerTick` steps
 * per physics tick, so `ev3_*` calls happen in simulated time rather than all at once. For a
 * Source program that machine would be js-slang's - see Program.ts's doc comment on why that path
 * isn't wired up yet.
 *
 * There is no equivalent of the pre-migration 'js-slang/context' injection for py-slang either:
 * nothing hands this bundle a populated py-slang `Context` (Conductor's runner Worker only hands
 * a `BaseModulePlugin` its `evaluator` - the setup program's own evaluator, an entirely different
 * thing from a shadow CSE context for the control program). So for the Python path the bundle
 * builds its own, here - a `Context` seeded with
 *
 *   * the standard SICPy builtins for the chosen chapter (`VARIANT_GROUPS`), and
 *   * the `ev3_*` robot API, wrapped as py-slang `BuiltinValue`s so a Python program can call
 *     them directly by name (no `import` needed - see the module-level doc comment in index.ts
 *     for why `from robot_simulation import ...` inside the *control* program specifically still
 *     isn't possible even now that the module is a proper Conductor plugin), and
 *   * an output stream routed into the simulation's own Robot Console panel.
 *
 * The group preludes (the parts of the SICPy library written in Python itself, e.g. `map`,
 * `filter`) are deliberately NOT evaluated here: doing so would need an async drain before the
 * first physics tick. Only the primitive builtins each group defines in TypeScript are
 * registered, which covers everything a robot control program realistically needs
 * (arithmetic, comparisons, `print`, `math`, ...).
 */

/** The SICPy chapter the robot's Python control program is evaluated at. */
export const ROBOT_PYTHON_VARIANT = 4;

function toJsNumber(value: Value | undefined, name: string): number {
  if (value === undefined) {
    throw new TypeError(`${name}: expected a number, got nothing`);
  }
  if (value.type === 'number') {
    return value.value;
  }
  if (value.type === 'bigint') {
    return Number(value.value);
  }
  throw new TypeError(`${name}: expected a number, got '${value.type}'`);
}

/**
 * Unwraps a value the Python program is passing back to us that it originally received from one
 * of these same builtins (a `Motor`, `ColorSensor`, ...). Those cross the boundary as py-slang
 * `opaque` values, which is exactly what `opaque` is for: py-slang never inspects the payload.
 */
function toJsOpaque<T>(value: Value | undefined, name: string): T | null {
  if (value === undefined || value.type === 'none') {
    return null;
  }
  if (value.type !== 'opaque') {
    throw new TypeError(`${name}: expected a robot object, got '${value.type}'`);
  }
  return value.value as T;
}

function opaque(value: unknown): Value {
  return value === null || value === undefined
    ? { type: 'none' }
    : { type: 'opaque', value };
}

function num(value: number): Value {
  return { type: 'number', value };
}

function builtin(
  name: string,
  minArgs: number,
  func: (args: Value[]) => Value | undefined
): [string, BuiltinValue] {
  return [name, { type: 'builtin', name, minArgs, func: args => func(args) }];
}

/**
 * The `ev3_*` API, as py-slang builtins. Deliberately a straight 1:1 wrapping of `ev3` - the
 * exact same bound functions the plugin's own module methods call (see index.ts) - so a Python
 * control program and the setup program's own `ev3_*` calls drive the simulation identically.
 */
function robotBuiltins(ev3: Ev3Functions): Array<[string, BuiltinValue]> {
  return [
    builtin('ev3_motorA', 0, () => opaque(ev3.ev3_motorA())),
    builtin('ev3_motorB', 0, () => opaque(ev3.ev3_motorB())),
    builtin('ev3_motorC', 0, () => opaque(ev3.ev3_motorC())),
    builtin('ev3_motorD', 0, () => opaque(ev3.ev3_motorD())),
    builtin('ev3_pause', 1, args => {
      ev3.ev3_pause(toJsNumber(args[0], 'ev3_pause'));
      return { type: 'none' };
    }),
    builtin('ev3_runToRelativePosition', 3, args => {
      ev3.ev3_runToRelativePosition(
        toJsOpaque<Motor>(args[0], 'ev3_runToRelativePosition'),
        toJsNumber(args[1], 'ev3_runToRelativePosition'),
        toJsNumber(args[2], 'ev3_runToRelativePosition')
      );
      return { type: 'none' };
    }),
    builtin('ev3_colorSensor', 0, () => opaque(ev3.ev3_colorSensor())),
    builtin('ev3_colorSensorRed', 1, args => num(
      ev3.ev3_colorSensorRed(toJsOpaque<ColorSensor>(args[0], 'ev3_colorSensorRed')!)
    )),
    builtin('ev3_colorSensorGreen', 1, args => num(
      ev3.ev3_colorSensorGreen(toJsOpaque<ColorSensor>(args[0], 'ev3_colorSensorGreen')!)
    )),
    builtin('ev3_colorSensorBlue', 1, args => num(
      ev3.ev3_colorSensorBlue(toJsOpaque<ColorSensor>(args[0], 'ev3_colorSensorBlue')!)
    )),
    builtin('ev3_ultrasonicSensor', 0, () => opaque(ev3.ev3_ultrasonicSensor())),
    builtin('ev3_ultrasonicSensorDistance', 1, args => num(
      ev3.ev3_ultrasonicSensorDistance(
        toJsOpaque<UltrasonicSensor>(args[0], 'ev3_ultrasonicSensorDistance')!
      )
    )),
  ];
}

/**
 * Routes the Python program's `print()` output into the simulation's own Robot Console panel
 * (the "Console" tab under the 3D view), which is where a Source control program's `display()`
 * output would go too. The world isn't created yet when this context is built (createPythonCSE
 * runs inside the `init_simulation` callback), so the lookup is deferred to write time.
 */
function robotConsoleStreams(getWorld: () => World): PyContext['streams'] {
  const stdoutStream = new WritableStream<string>({
    write(chunk) {
      const text = String(chunk).replace(/\n$/u, '');
      if (text === '') {
        return;
      }
      try {
        getWorld().robotConsole.log(text, 'source');
      } catch {
        // World not available (e.g. the program printed before init finished) - drop it rather
        // than killing the tick.
      }
    },
  });
  const stderrStream = new WritableStream<unknown>({
    write(chunk) {
      const message
        = typeof chunk === 'string'
          ? chunk
          : (chunk as { message?: string })?.message ?? String(chunk);
      try {
        getWorld().robotConsole.log(message, 'error');
      } catch {
        // See above.
      }
    },
  });
  const stdinStream = new ReadableStream<string>({
    start(controller) {
      // A robot control program has no interactive input; close immediately so a stray input()
      // resolves to '' instead of hanging the physics loop forever.
      controller.close();
    },
  });

  return {
    initialised: true,
    stdout: { stream: stdoutStream, writer: stdoutStream.getWriter() },
    stderr: {
      stream: stderrStream,
      writer: stderrStream.getWriter(),
    },
    stdin: {
      stream: stdinStream,
      reader: stdinStream.getReader(),
      setNextPrompt: () => {},
    },
  };
}

/**
 * Creates a py-slang `Context` for a robot control program: SICPy builtins for
 * {@link ROBOT_PYTHON_VARIANT}, plus the `ev3_*` robot API, plus output wired to the Robot
 * Console.
 *
 * @param ev3 The same bound `ev3_*` functions the plugin's own module methods call (see
 * `createEv3Functions` in ev3_functions.ts) - keeps the control program and the setup program
 * observing/driving the exact same world.
 * @param getWorld Deferred lookup of the current `World` (for console output) - see
 * `robotConsoleStreams`'s doc comment for why this can't just be a value.
 */
export function createRobotPythonContext(
  ev3: Ev3Functions,
  getWorld: () => World,
  variant: number = ROBOT_PYTHON_VARIANT
): PyContext {
  const context = new PyContext();
  context.variant = variant;

  for (const group of VARIANT_GROUPS[variant] ?? []) {
    for (const [name, value] of group.builtins) {
      context.nativeStorage.builtins.set(name, value);
    }
  }
  for (const [name, value] of robotBuiltins(ev3)) {
    context.nativeStorage.builtins.set(name, value);
  }

  context.streams = robotConsoleStreams(getWorld);
  return context;
}
