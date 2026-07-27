import { DataType, type TypedValue } from '@sourceacademy/conductor/types';
import { TestDataHandler, numberValue, runAsyncGenerator, stringValue } from '@sourceacademy/modules-testplugin';
import { describe, expect, test, vi } from 'vitest';
import CsgModulePlugin from '..';
import type { CsgChannelMessage, CsgRenderMessage } from '../protocol';
import { Group, RenderGroup, Shape } from '../utilities';

const SILVER = '#AAAAAA';
const CRIMSON = '#AA0000';

type SignaturedMethod = {
  signature: {
    args: DataType[];
    returnType: DataType;
  };
};

function makePlugin() {
  const sent: CsgChannelMessage[] = [];
  let subscriber: ((message: CsgChannelMessage) => void) | undefined;
  const channel = {
    send: vi.fn((message: CsgChannelMessage) => sent.push(message)),
    subscribe: vi.fn((s: (message: CsgChannelMessage) => void) => { subscriber = s; }),
    unsubscribe: vi.fn(),
    close: vi.fn(),
    name: 'csg-test-channel'
  };
  const evaluator = new TestDataHandler();
  const tabLoader = { tabs: ['Csg'], loadTab: vi.fn() };
  const plugin = new CsgModulePlugin({} as any, [channel] as any, evaluator, tabLoader);

  return {
    plugin,
    evaluator,
    sent,
    tabLoader,
    /** Stands in for the tab asking for its backlog once it has loaded. */
    requestBacklog: () => subscriber!({ type: 'request' }),
    renders: () => sent.filter((message): message is CsgRenderMessage => message.type === 'render')
  };
}

function opaqueValue(evaluator: TestDataHandler, value: TypedValue<DataType.OPAQUE>) {
  return evaluator.opaque_get(value);
}

describe(CsgModulePlugin, () => {
  test('constructor throws before touching the base plugin if the channel is missing', () => {
    const evaluator = new TestDataHandler();
    expect(() => new CsgModulePlugin({} as any, [undefined] as any, evaluator))
      .toThrow('CSG channel is required but was not provided.');
  });

  test('exports every function plus the sixteen colour constants', async () => {
    const { plugin } = makePlugin();
    await plugin.initialise();

    const symbols = plugin.exports.map(exported => exported.symbol);
    expect(symbols).toHaveLength(plugin.exportedNames.length + 16);
    expect(plugin.exports.find(exported => exported.symbol === 'silver')!.value)
      .toStrictEqual({ type: DataType.CONST_STRING, value: SILVER });
  });

  test('initialise() is idempotent', async () => {
    const { plugin } = makePlugin();
    await plugin.initialise();
    await plugin.initialise();

    const symbols = plugin.exports.map(exported => exported.symbol);
    expect(symbols).toHaveLength(plugin.exportedNames.length + 16);
  });

  test('every exported name carries an attached signature', () => {
    const { plugin } = makePlugin();
    const missing = plugin.exportedNames.filter(name => {
      const method: unknown = plugin[name];
      return typeof method !== 'function'
        || (method as { signature?: unknown }).signature === undefined;
    });

    expect(missing).toStrictEqual([]);
  });

  test('predicates declare an arity of one, not zero', () => {
    for (const name of ['is_shape', 'is_group'] as const) {
      const { signature } = CsgModulePlugin.prototype[name] as unknown as SignaturedMethod;
      expect(signature.args).toStrictEqual([DataType.ANY]);
      expect(signature.returnType).toBe(DataType.BOOLEAN);
    }
  });

  test('primitives round-trip through opaque handles', async () => {
    const { plugin, evaluator } = makePlugin();
    const shape = await runAsyncGenerator(plugin.cube(stringValue(SILVER)));

    expect(shape.type).toBe(DataType.OPAQUE);
    expect(await opaqueValue(evaluator, shape)).toBeInstanceOf(Shape);
  });

  test('render serializes the scene and reports the canvas in the REPL', async () => {
    const { plugin, evaluator, sent, tabLoader, requestBacklog } = makePlugin();
    const shape = await runAsyncGenerator(plugin.cube(stringValue(SILVER)));
    const result = await runAsyncGenerator(plugin.render_grid_axes(shape));

    expect(tabLoader.loadTab).toHaveBeenCalledWith('Csg');
    requestBacklog();

    expect(sent).toHaveLength(1);
    const message = sent[0] as CsgRenderMessage;
    expect(message.hasGrid).toBe(true);
    expect(message.hasAxis).toBe(true);
    expect(message.solids).toHaveLength(1);
    expect(message.solids[0].polygons.length).toBeGreaterThan(0);

    const renderGroup = await opaqueValue(evaluator, result);
    expect(renderGroup).toBeInstanceOf(RenderGroup);
    expect((renderGroup as RenderGroup).toReplString()).toBe('<Render #1>');
  });

  test('each render call produces its own canvas, delivered exactly once', async () => {
    const { plugin, evaluator, sent, requestBacklog } = makePlugin();
    // The realistic sequence: the first render loads the tab, the tab then asks
    // for the backlog, and later renders stream live.
    const first = await runAsyncGenerator(plugin.render(await runAsyncGenerator(plugin.cube(stringValue(SILVER)))));
    requestBacklog();
    const second = await runAsyncGenerator(plugin.render(await runAsyncGenerator(plugin.sphere(stringValue(CRIMSON)))));

    expect(sent).toHaveLength(2);
    expect((await opaqueValue(evaluator, first) as RenderGroup).toReplString()).toBe('<Render #1>');
    expect((await opaqueValue(evaluator, second) as RenderGroup).toReplString()).toBe('<Render #2>');
    // Each group holds only the shapes stored since the previous render
    expect((sent as CsgRenderMessage[]).map(message => message.solids.length)).toStrictEqual([1, 1]);
  });

  test('renders made before the tab asks are replayed once, not duplicated', async () => {
    const { plugin, sent, requestBacklog } = makePlugin();
    await runAsyncGenerator(plugin.render(await runAsyncGenerator(plugin.cube(stringValue(SILVER)))));
    await runAsyncGenerator(plugin.render(await runAsyncGenerator(plugin.sphere(stringValue(CRIMSON)))));

    expect(sent).toHaveLength(0);
    requestBacklog();
    expect(sent).toHaveLength(2);
  });

  test('rendering a Group flattens its children into one scene', async () => {
    const { plugin, evaluator, renders, requestBacklog } = makePlugin();
    const cube = await runAsyncGenerator(plugin.cube(stringValue(SILVER)));
    const sphere = await runAsyncGenerator(plugin.sphere(stringValue(CRIMSON)));
    const grouped = await runAsyncGenerator(plugin.group(await evaluator.list(cube, sphere)));

    await runAsyncGenerator(plugin.render(grouped));
    requestBacklog();

    expect(renders()[0].solids).toHaveLength(2);
  });

  test('group and ungroup round-trip a Source list', async () => {
    const { plugin, evaluator } = makePlugin();
    const cube = await runAsyncGenerator(plugin.cube(stringValue(SILVER)));
    const sphere = await runAsyncGenerator(plugin.sphere(stringValue(CRIMSON)));

    const grouped = await runAsyncGenerator(plugin.group(await evaluator.list(cube, sphere)));
    expect(await opaqueValue(evaluator, grouped)).toBeInstanceOf(Group);

    const elements = await evaluator.list_to_vec(await runAsyncGenerator(plugin.ungroup(grouped)));
    expect(elements).toHaveLength(2);
    for (const element of elements) {
      expect(await opaqueValue(evaluator, element as TypedValue<DataType.OPAQUE>)).toBeInstanceOf(Shape);
    }
  });

  test('transformations accept both Shapes and Groups', async () => {
    const { plugin, evaluator } = makePlugin();
    const cube = await runAsyncGenerator(plugin.cube(stringValue(SILVER)));
    const grouped = await runAsyncGenerator(plugin.group(await evaluator.list(cube)));

    const moved = await runAsyncGenerator(plugin.translate(cube, numberValue(1), numberValue(0), numberValue(0)));
    expect(await opaqueValue(evaluator, moved)).toBeInstanceOf(Shape);

    const scaled = await runAsyncGenerator(plugin.scale(grouped, numberValue(2), numberValue(2), numberValue(2)));
    expect(await opaqueValue(evaluator, scaled)).toBeInstanceOf(Group);
  });

  test('operations reject a Group where a Shape is required', async () => {
    const { plugin, evaluator } = makePlugin();
    const cube = await runAsyncGenerator(plugin.cube(stringValue(SILVER)));
    const grouped = await runAsyncGenerator(plugin.group(await evaluator.list(cube)));

    await expect(runAsyncGenerator(plugin.union(grouped, cube))).rejects.toThrow(/Shape/);
  });

  test('bounding_box returns a callable two-argument closure', async () => {
    const { plugin, evaluator } = makePlugin();
    const sphere = await runAsyncGenerator(plugin.sphere(stringValue(SILVER)));
    const getter = await runAsyncGenerator(plugin.bounding_box(sphere));

    expect(getter.type).toBe(DataType.CLOSURE);
    expect(await evaluator.closure_arity(getter)).toBe(2);

    const max = await runAsyncGenerator(
      evaluator.closure_call_unchecked(getter, [stringValue('y'), stringValue('max')])
    );
    const min = await runAsyncGenerator(
      evaluator.closure_call_unchecked(getter, [stringValue('x'), stringValue('min')])
    );
    expect(max.value).toBeCloseTo(1);
    expect(min.value).toBeCloseTo(0);
  });

  test('predicates answer for any type rather than throwing', async () => {
    const { plugin, evaluator } = makePlugin();
    const cube = await runAsyncGenerator(plugin.cube(stringValue(SILVER)));
    const grouped = await runAsyncGenerator(plugin.group(await evaluator.list(cube)));

    expect((await runAsyncGenerator(plugin.is_shape(cube))).value).toBe(true);
    expect((await runAsyncGenerator(plugin.is_group(cube))).value).toBe(false);
    expect((await runAsyncGenerator(plugin.is_group(grouped))).value).toBe(true);
    expect((await runAsyncGenerator(plugin.is_shape(numberValue(5)))).value).toBe(false);
    expect((await runAsyncGenerator(plugin.is_group(stringValue('x')))).value).toBe(false);
  });

  test('download_shape_stl sends the serialized STL for the tab to save', async () => {
    const { plugin, sent, requestBacklog } = makePlugin();
    const cube = await runAsyncGenerator(plugin.cube(stringValue(SILVER)));
    await runAsyncGenerator(plugin.download_shape_stl(cube));
    requestBacklog();

    expect(sent).toHaveLength(1);
    const message = sent[0];
    if (message.type !== 'download') throw new Error('expected a download message');
    expect(message.filename).toBe('Source Academy CSG Shape.stl');
    expect(message.data.every(chunk => chunk instanceof ArrayBuffer)).toBe(true);
    // 80-byte header plus the 4-byte triangle count, at minimum
    expect(message.data.reduce((total, chunk) => total + chunk.byteLength, 0)).toBeGreaterThan(84);
  });

  test('a download is never replayed to a later request (e.g. the tab being recreated)', async () => {
    const { plugin, sent, requestBacklog } = makePlugin();
    const cube = await runAsyncGenerator(plugin.cube(stringValue(SILVER)));
    await runAsyncGenerator(plugin.download_shape_stl(cube));
    requestBacklog();
    expect(sent.filter(message => message.type === 'download')).toHaveLength(1);

    // The tab is recreated (or simply asks again) - the completed download
    // must not be re-sent, unlike a render, which is fine to redraw.
    requestBacklog();
    expect(sent.filter(message => message.type === 'download')).toHaveLength(1);
  });
});
