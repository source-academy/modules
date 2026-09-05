import rapier from '@dimforge/rapier3d-compat';
import { DataType } from '@sourceacademy/conductor/types';
import { TestDataHandler, numberValue, runAsyncGenerator, stringValue } from '@sourceacademy/modules-testplugin';
import { describe, expect, test, vi } from 'vitest';
import RobotSimulationModulePlugin from '..';

function makeRigidBody() {
  return {
    setTranslation: vi.fn(),
    setRotation: vi.fn(),
    translation: vi.fn(() => ({ x: 0, y: 0, z: 0 })),
    rotation: vi.fn(() => ({ x: 0, y: 0, z: 0, w: 1 })),
    linvel: vi.fn(() => ({ x: 0, y: 0, z: 0 })),
    angvel: vi.fn(() => ({ x: 0, y: 0, z: 0 })),
    applyImpulseAtPoint: vi.fn(),
  };
}

function makeCollider() {
  return { setMass: vi.fn(), mass: vi.fn(() => 0) };
}

// Same rapier mock as engine/__tests__/Physics.test.ts - init_default_simulation constructs a
// real Physics/World underneath, and this bundle otherwise has no way to step rapier's actual
// WASM in a plain vitest environment.
vi.mock(import('@dimforge/rapier3d-compat'), () => {
  const mocked: typeof rapier = {
    init: vi.fn(),
    World: class {
      timestep = vi.fn();
      createRigidBody = vi.fn(() => makeRigidBody());
      createCollider = vi.fn(() => makeCollider());
      castRayAndGetNormal = vi.fn();
      step = vi.fn();
      castRay = vi.fn();
    },
    Ray: vi.fn(),
    RigidBodyDesc: {
      fixed: vi.fn(() => ({})),
      dynamic: vi.fn(() => ({})),
    } as any,
    ColliderDesc: {
      cuboid: vi.fn(() => ({})),
    } as any,
  } as any;
  return { default: mocked };
});

function makePlugin() {
  const controlChannel = { send: vi.fn(), subscribe: vi.fn(), unsubscribe: vi.fn(), close: vi.fn(), name: 'control' };
  const stateChannel = { send: vi.fn(), subscribe: vi.fn(), unsubscribe: vi.fn(), close: vi.fn(), name: 'state' };
  const evaluator = new TestDataHandler();
  const tabLoader = { tabs: ['RobotSimulation'], loadTab: vi.fn() };
  const plugin = new RobotSimulationModulePlugin(
    {} as any,
    [controlChannel, stateChannel] as any,
    evaluator,
    tabLoader
  );
  return { plugin, evaluator, controlChannel, stateChannel, tabLoader };
}

describe(RobotSimulationModulePlugin, () => {
  test('every exported name carries an attached signature', () => {
    const { plugin } = makePlugin();
    const missing = plugin.exportedNames.filter(name => {
      const method: unknown = (plugin as any)[name];
      return typeof method !== 'function'
        || (method as { signature?: unknown }).signature === undefined;
    });

    expect(missing).toStrictEqual([]);
  });

  describe('init_default_simulation', () => {
    test('builds a default world, loads the tab, and starts the simulation from one call', async () => {
      const { plugin, tabLoader } = makePlugin();

      const result = await runAsyncGenerator((plugin as any).init_default_simulation());

      expect(result).toStrictEqual({ type: DataType.VOID, value: undefined });
      expect(tabLoader.loadTab).toHaveBeenCalledWith('RobotSimulation');
    });

    test('is idempotent - a second call is a no-op once a world already exists', async () => {
      const { plugin, controlChannel } = makePlugin();

      await runAsyncGenerator((plugin as any).init_default_simulation());
      const callsAfterFirst = controlChannel.send.mock.calls.length;
      await runAsyncGenerator((plugin as any).init_default_simulation());

      // No new world was built (and hence no new worldStateChanged RPC was queued) the second time.
      expect(controlChannel.send.mock.calls.length).toBe(callsAfterFirst);
    });

    test('declares no parameters', () => {
      const { signature } = (RobotSimulationModulePlugin.prototype as any).init_default_simulation;
      expect(signature.args).toStrictEqual([]);
      expect(signature.returnType).toBe(DataType.VOID);
    });
  });

  describe('add_wall / add_paper', () => {
    test('add a controller to the already-running default world without needing physics/world handles', async () => {
      const { plugin } = makePlugin();
      await runAsyncGenerator((plugin as any).init_default_simulation());

      const world = (plugin as any).__state.world;
      const controllersBefore = world.controllers.controllers.length;

      await runAsyncGenerator(
        (plugin as any).add_wall(
          numberValue(0), numberValue(3), numberValue(2), numberValue(0.2), numberValue(1)
        )
      );
      await runAsyncGenerator(
        (plugin as any).add_paper(
          stringValue('red.png'), numberValue(1), numberValue(1), numberValue(0), numberValue(1), numberValue(0)
        )
      );
      await runAsyncGenerator(
        (plugin as any).add_color_patch(
          stringValue('red'), numberValue(0), numberValue(1), numberValue(0.5), numberValue(0.5)
        )
      );

      // All three controllers were added live (start() already fired) rather than only queued for
      // a future worldStart that already happened.
      expect(world.controllers.controllers.length).toBe(controllersBefore + 3);
    });

    test('add_color_patch registers a real physics collider with its color, unlike add_paper', async () => {
      const { plugin } = makePlugin();
      await runAsyncGenerator((plugin as any).init_default_simulation());

      const registerColorSpy = vi.spyOn((plugin as any).__state.world.physics, 'registerColor');

      await runAsyncGenerator(
        (plugin as any).add_color_patch(
          stringValue('#ff0000'), numberValue(0), numberValue(1), numberValue(0.5), numberValue(0.5)
        )
      );

      expect(registerColorSpy).toHaveBeenCalledWith(expect.anything(), '#ff0000');
    });
  });

  describe('run_robot_code', () => {
    test('drives the shared robot Python context across repeated calls, sharing state between runs', async () => {
      const { plugin } = makePlugin();
      await runAsyncGenerator((plugin as any).init_default_simulation());

      await runAsyncGenerator((plugin as any).run_robot_code(stringValue('x = 1')));
      const firstProgram = (plugin as any).__state.replProgram;

      await runAsyncGenerator((plugin as any).run_robot_code(stringValue('y = x + 1')));
      const secondProgram = (plugin as any).__state.replProgram;

      // A fresh Program per call...
      expect(secondProgram).not.toBe(firstProgram);
      // ...but the first one is stopped so it can't keep pumping the shared pyContext.
      expect((firstProgram as any).isStopped).toBe(true);
      // ...and both runs share the same pyContext, so `y = x + 1` could resolve `x` at all
      // (analyzePython would have thrown a NameError otherwise - see evaluate.ts).
      expect((plugin as any).__state.replPyContext).toBeDefined();
    });

    test('throws if the world has not been initialised yet', async () => {
      const { plugin } = makePlugin();
      await expect(
        runAsyncGenerator((plugin as any).run_robot_code(stringValue('ev3_pause(1)')))
      ).rejects.toThrow();
    });

    test('ev3_pause() pauses the currently-running Program, not a stale one from an earlier run', async () => {
      const { plugin } = makePlugin();
      await runAsyncGenerator((plugin as any).init_default_simulation());

      // First run: a Program that finishes immediately and is left behind, stopped, in
      // world.controllers.controllers - exactly what a real student's first REPL/embedded-editor
      // Run leaves behind once they move on to a second one.
      await runAsyncGenerator((plugin as any).run_robot_code(stringValue('x = 1')));
      const firstProgram = (plugin as any).__state.replProgram;

      // Second run calls ev3_pause() itself - if ev3_pause found the *first* Program with a
      // matching name (the bug this guards against), it would pause a dead, already-stopped
      // Program that no longer affects anything, leaving this run's own isPaused false forever.
      await runAsyncGenerator((plugin as any).run_robot_code(stringValue('ev3_pause(1000000)')));
      const secondProgram = (plugin as any).__state.replProgram;

      // Drive the second run's Python code far enough to actually execute the ev3_pause() call
      // (mirrors Program.python.test.ts's own real-py-slang pump pattern).
      for (let tick = 0; tick < 10; tick++) {
        secondProgram.fixedUpdate();
        // eslint-disable-next-line no-await-in-loop
        await new Promise(resolve => setTimeout(resolve, 0));
      }

      expect(secondProgram.isPaused).toBe(true);
      expect(firstProgram.isPaused).toBe(false);
    });
  });
});
