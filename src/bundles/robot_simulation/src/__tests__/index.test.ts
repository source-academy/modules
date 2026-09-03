import rapier from '@dimforge/rapier3d-compat';
import { DataType } from '@sourceacademy/conductor/types';
import { TestDataHandler, runAsyncGenerator, stringValue } from '@sourceacademy/modules-testplugin';
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

      const result = await runAsyncGenerator(
        (plugin as any).init_default_simulation(stringValue('ev3_pause(1)\n'))
      );

      expect(result).toStrictEqual({ type: DataType.VOID, value: undefined });
      expect(tabLoader.loadTab).toHaveBeenCalledWith('RobotSimulation');
    });

    test('is idempotent - a second call is a no-op once a world already exists', async () => {
      const { plugin, controlChannel } = makePlugin();

      await runAsyncGenerator((plugin as any).init_default_simulation(stringValue('ev3_pause(1)\n')));
      const callsAfterFirst = controlChannel.send.mock.calls.length;
      await runAsyncGenerator((plugin as any).init_default_simulation(stringValue('ev3_pause(2)\n')));

      // No new world was built (and hence no new worldStateChanged RPC was queued) the second time.
      expect(controlChannel.send.mock.calls.length).toBe(callsAfterFirst);
    });

    test('declares a single CONST_STRING parameter', () => {
      const { signature } = (RobotSimulationModulePlugin.prototype as any).init_default_simulation;
      expect(signature.args).toStrictEqual([DataType.CONST_STRING]);
      expect(signature.returnType).toBe(DataType.VOID);
    });
  });
});
