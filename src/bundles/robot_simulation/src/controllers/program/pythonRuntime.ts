import {
  Context as PyContext,
  VARIANT_GROUPS,
  type BuiltinValue,
  type Value,
} from '@sourceacademy/py-slang';
import type { Motor } from '../ev3/components/Motor';
import type { ColorSensor } from '../ev3/sensor/ColorSensor';
import type { UltrasonicSensor } from '../ev3/sensor/UltrasonicSensor';
import * as ev3 from '../../ev3_functions';
import { getWorldFromContext } from '../../helper_functions';

/**
 * Builds the py-slang `Context` that a Python-flavoured {@link Program} evaluates against.
 *
 * ## Why this exists
 *
 * `robot_simulation` re-runs the robot's control program *inside* the simulation loop: the
 * `Program` controller (see Program.ts) owns a CSE machine that is stepped `stepsPerTick` steps
 * per physics tick, so `ev3_*` calls happen in simulated time rather than all at once. For a
 * Source program that machine is js-slang's, and its `Context` arrives for free — the bundle
 * imports `js-slang/context`, which the host frontend injects at runtime (esbuild leaves
 * `js-slang*` external; see lib/buildtools/src/build/modules/commons.ts).
 *
 * There is no equivalent injection for py-slang: nothing hands this bundle a populated py-slang
 * `Context`. So for the Python path the bundle builds its own, here — a `Context` seeded with
 *
 *   * the standard SICPy builtins for the chosen chapter (`VARIANT_GROUPS`), and
 *   * the `ev3_*` robot API, wrapped as py-slang `BuiltinValue`s so a Python program can call
 *     them directly by name (no `import` needed — see the note on module imports below), and
 *   * an output stream routed into the simulation's own Robot Console panel.
 *
 * ## Note on `from robot_simulation import ...`
 *
 * A Python program running under py-slang's *own* conductor evaluator (`PyCseEvaluator3/4`)
 * cannot `import` this bundle: py-slang's CSE machine resolves every import through
 * `ModuleLoaderRunnerPlugin`, which requires the bundle to `export default` a
 * `BaseModulePlugin` subclass (as csg/rune/curve do). `robot_simulation` is a legacy js-slang
 * bundle with named exports only and a tab that reaches into the live `World` object through
 * `js-slang/context`, so it has not been migrated to Conductor. Hence: the robot's *control*
 * program can be Python (this file), while the *setup* program that calls `init_simulation` is
 * still Source.
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
 * The `ev3_*` API, as py-slang builtins. Deliberately a straight 1:1 wrapping of
 * `ev3_functions.ts` — the exact same functions a Source control program calls — so a Python
 * control program and a Source one drive the simulation identically.
 */
function robotBuiltins(): Array<[string, BuiltinValue]> {
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
function robotConsoleStreams(): PyContext['streams'] {
  const stdoutStream = new WritableStream<string>({
    write(chunk) {
      const text = String(chunk).replace(/\n$/u, '');
      if (text === '') {
        return;
      }
      try {
        getWorldFromContext().robotConsole.log(text, 'source');
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
          : ((chunk as { message?: string })?.message ?? String(chunk));
      try {
        getWorldFromContext().robotConsole.log(message, 'error');
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
  } as PyContext['streams'];
}

/**
 * Creates a py-slang `Context` for a robot control program: SICPy builtins for
 * {@link ROBOT_PYTHON_VARIANT}, plus the `ev3_*` robot API, plus output wired to the Robot
 * Console.
 */
export function createRobotPythonContext(
  variant: number = ROBOT_PYTHON_VARIANT
): PyContext {
  const context = new PyContext();
  context.variant = variant;

  for (const group of VARIANT_GROUPS[variant] ?? []) {
    for (const [name, value] of group.builtins) {
      context.nativeStorage.builtins.set(name, value);
    }
  }
  for (const [name, value] of robotBuiltins()) {
    context.nativeStorage.builtins.set(name, value);
  }

  context.streams = robotConsoleStreams();
  return context;
}
