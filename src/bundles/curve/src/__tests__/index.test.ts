import { DataType, type TypedValue } from '@sourceacademy/conductor/types';
import { describe, expect, test, vi } from 'vitest';
import CurveModulePlugin from '..';
import * as funcs from '../functions';

type FakeClosure = {
  sig: {
    args: readonly DataType[];
    returnType: DataType;
  };
  dependsOn?: unknown[];
  func: (...args: any[]) => AsyncGenerator<void, unknown, undefined>;
};

async function run<T>(generator: AsyncGenerator<void, T, undefined>): Promise<T> {
  const result = await generator.next();
  expect(result.done).toBe(true);
  return result.value as T;
}

describe(CurveModulePlugin, () => {
  test('draw functions send cloneable curve data over the channel', async () => {
    const sentMessages: unknown[] = [];
    const channel = {
      send: vi.fn(message => sentMessages.push(message)),
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
      close: vi.fn(),
      name: 'curve-test-channel'
    };
    const evaluator = {
      hasDataInterface: true,
      closure_make: vi.fn(async (sig, func, dependsOn?: unknown[]) => ({
        type: DataType.CLOSURE,
        value: { sig, dependsOn, func }
      })),
      closure_arity_assert: vi.fn(async (closure, arity) => {
        if (closure.value.sig.args.length !== arity) {
          throw new Error('Bad arity');
        }
      }),
      closure_call: vi.fn((closure, args) => closure.value.func(...args)),
      closure_call_unchecked: vi.fn((closure, args) => closure.value.func(...args)),
      opaque_make: vi.fn(async (value, _immutable?: boolean) => ({
        type: DataType.OPAQUE,
        value
      })),
      opaque_get: vi.fn(async value => value.value)
    };
    const plugin = new CurveModulePlugin({} as any, [channel] as any, evaluator as any, {
      tabs: [],
      loadTab: vi.fn()
    });

    const renderFunction = await run(plugin.draw_connected({
      type: DataType.NUMBER,
      value: 2
    })) as unknown as { value: FakeClosure };
    const curve = await evaluator.closure_make(
      {
        args: [DataType.NUMBER] as const,
        returnType: DataType.OPAQUE
      },
      async function* line(t: TypedValue<DataType.NUMBER>) {
        return await evaluator.opaque_make(funcs.make_point(t.value, t.value), true);
      }
    );

    const renderClosure = renderFunction.value;
    await run(renderClosure.func.call(renderClosure, curve));

    expect(sentMessages).toHaveLength(1);
    expect(sentMessages[0]).toMatchObject({
      type: 'render',
      curve: {
        drawMode: 'lines',
        numPoints: 2,
        space: '2D',
        drawCubeArray: [],
        curvePosArray: [-1, -1, 0, 0, 1, 1],
        curveColorArray: [
          0, 0, 0, 1,
          0, 0, 0, 1,
          0, 0, 0, 1
        ]
      }
    });
    expect('init' in (sentMessages[0] as any).curve).toBe(false);
    expect('redraw' in (sentMessages[0] as any).curve).toBe(false);
  });
});
