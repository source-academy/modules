# Modules Validator

Checks to ensure that the built versions of bundles and tabs perform to specification.

To add tests for your bundle and tab:

## 1. Create a new file under the `__tests__/indiv` folder.

Give it the name of your bundle, i.e `curve.test.ts`.

## 2. Import the tab and bundle

You can follow the template that the other tests follow:

```ts
import type { CurveModuleState } from '@sourceacademy/bundle-curve/types';
import { getModuleState } from '@sourceacademy/modules-lib/utils';

// Import the bundle using Javscript for type information
import type * as funcs from '@sourceacademy/bundle-curve';
import { describe, expect } from 'vitest';
import { render } from 'vitest-browser-react';

// Import the actual built bundle
import partialBundle from '#bundle/curve';

// Import the actual built tab
import partialTab from '#tab/Curve';

// Use this utility to get an instance of the Vitest 'test' function
import { getTestFunc } from '../utils';

// Notice the name of the bundle being passed to the function
const test = getTestFunc<typeof funcs>('curve', partialBundle, partialTab);
```

> [!INFO]
>
> The `#bundle` and `#tab` specifiers make it easier to refer to the `build` directory. They're
> essentially path substitutions. `#bundle/curve` becomes `../../../../build/bundles/curve.js`, for example.

> [!WARNING]
>
> If you import the bundle package, you should add it to `peerDependencies` in `package.json` for the validator:
>
> ```jsonc
> "peerDependencies": {
>   "@sourceacademy/bundle-curve": "workspace:^",
>   "@sourceacademy/bundle-repl": "workspace:^",
>   "@sourceacademy/bundle-rune": "workspace:^",
>   "@sourceacademy/bundle-sound": "workspace:^",
> }
> ```

## 3. Write the tests

```ts
describe('Curve bundle and tab', () => {
  // Have a test to determine if toSpawn behaves correctly
  test('empty curves should not spawn', ({ context, tab: { toSpawn } }) => {
    expect(toSpawn!(context)).toEqual(false);
  });

  test('draw single normal curve', async ({ context, bundle, tab }) => {
    bundle.draw_connected(200)(t => bundle.make_point(t, 0.5));

    const { drawnCurves } = getModuleState<CurveModuleState>(context, 'curve')!;
    expect(drawnCurves.length).toEqual(1);

    expect(tab.toSpawn!(context)).toEqual(true);

    // Use the render function from vitest-browser-react to test tab rendering
    await render(tab.body(context));
  });
});
```

Each test function is passed a test context as a parameter. The test context contains three properties, the loaded
bundle, the loaded tab and the debugger context used to load both. You need to use the destructuring syntax:

```ts
// Use the destructuring syntax
test('empty curves should not spawn', ({ bundle, context, tab: { toSpawn } }) => {
  expect(toSpawn!(context)).toEqual(false);
});

// This will not work
test('empty curves should not spawn', context => {
  expect(toSpawn!(context.context)).toEqual(false);
});
```

Vitest will only load the properties you destructure. In the example below, by omitting the bundle property,
the bundle isn't loaded:

```ts
// Bundle is not loaded here
test('empty curves should not spawn', ({ context, tab: { toSpawn } }) => {
  expect(toSpawn!(context)).toEqual(false);
});
```

If you need the bundle to be loaded but don't need its value, you can treat it as an unused variable:

```ts
// Bundle is loaded but not used here
test('empty curves should not spawn', ({ bundle: _unused, context, tab: { toSpawn } }) => {
  expect(toSpawn!(context)).toEqual(false);
});
```
