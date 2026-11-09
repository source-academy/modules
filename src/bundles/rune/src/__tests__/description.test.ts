import { checkDescription } from '@sourceacademy/modules-lib/description';
import { describe, expect, test, vi } from 'vitest';
import RuneModulePlugin from '..';
import { description } from '../description';

/** A plugin as the conductor makes it, with an evaluator that can make what the plugin exports. */
function makePlugin() {
  const channel = { send: vi.fn(), subscribe: vi.fn(), unsubscribe: vi.fn(), close: vi.fn(), name: 'rune-test-channel' };
  const evaluator = {
    hasDataInterface: true,
    closure_make: vi.fn(async (sig, func, dependsOn) => ({ type: 'closure', value: { sig, dependsOn, func } })),
    opaque_make: vi.fn(async value => ({ type: 'opaque', value })),
    opaque_get: vi.fn(async value => value.value)
  };
  const tabLoader = { tabs: [] as string[], loadTab: vi.fn() };
  return new RuneModulePlugin({} as any, [channel] as any, evaluator as any, tabLoader);
}

describe('the description of rune', () => {
  test('describes exactly what the plugin exports once it is loaded, and is consistent', async () => {
    const plugin = makePlugin();
    await plugin.initialise();

    // `exportedNames` has the 38 functions; the 11 shapes are exported by `initialise()`.
    expect(checkDescription(description, plugin.exports.map(each => each.symbol))).toEqual([]);
  });

  test('a description that is out of step with the plugin is reported', async () => {
    const plugin = makePlugin();
    await plugin.initialise();
    const symbols = plugin.exports.map(each => each.symbol);

    const problems = checkDescription(
      { ...description, functions: description.functions.filter(each => each.name !== 'beside') },
      [...symbols, 'a_new_function']
    );
    expect(problems).toEqual(
      expect.arrayContaining([
        'a_new_function is exported but not described',
        'beside is exported but not described'
      ])
    );
  });
});
