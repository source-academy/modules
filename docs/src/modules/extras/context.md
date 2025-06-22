---
order: 1
---
# Module Contexts
Some times, a bundle needs to be able to maintain some state information, or send information to a tab. Module Contexts form the solution to this problem.

Every time `js-slang` evaluates Source code, it creates an evaluation context. Bundles can access this context by using this import:
```ts
// curve/functions.ts
import context from 'js-slang/context';
const drawnCurves = [];
context.moduleContexts.curve.state = {
  drawnCurves,
}
```
`context.moduleContexts` will not be null here, and is of the type `Record<string, { tabs: any[], state: any }>`. To access a module's context, simply index the `moduleContexts` object using the bundle's name.

The `state` object can be of any type - it is up to the developer to decide what needs to be stored as state.

This `state` object can then be accessed by the module's tab, for example:
```ts
// Curve/index.tsx
export default {
  toSpawn: (context) => {
    return context.context.moduleHelpers.curve.state.drawnCurves.length > 0;
  },
  body: (context) => { /* implementation */ },
}
```
For more information refer to the documentation for tabs.

`js-slang` guarantees that each module is only evaluated once per code evaluation, no matter how many import statements there are in a Source program.

> [!IMPORTANT]
> Module Contexts are reset on each evaluation and are not capable of storing information that persists across evaluations.

## Where to access context?
> [!WARNING]
> Writing to and reading from `js-slang/context` in multiple places throughout your bundle may result in undefined behaviour. Consider importing the context from
> one place only.

Consider the following bundle. It has three different `functions` files that each set the bundle's state to a different value. It also exports a `main()` function that
prints out the current value of the bundle's state.
::: code-group
```ts [index.ts]
import context from 'js-slang/context';
export { function0 } from './functions_0';
export { function1 } from './functions_1';
export { function2 } from './functions_2';

export function main() {
  return context.moduleContexts.bundle.state
}
```
```ts  [functions_0.ts]
import context from 'js-slang/context';
context.moduleContexts.bundle.state = 0;

export function function0() {
  // Does some things
}
```
```ts [functions_1.ts]
import context from 'js-slang/context';
context.moduleContexts.bundle.state = 1;

export function function1() {
  // Does some things
}

```
```ts [functions_2.ts]
import { function0 } from './functions_0';
import context from 'js-slang/context';
context.moduleContexts.bundle.state = 2;

export function function2() {
  // Does some things
}
```
:::
What will be the output of the code below?
```ts
import { main } from 'bundle';
display(main());
```

Code that does not imports code from other files will be evaluated first. Since `functions_2.ts` imports `functions_0.ts`, we know that `functions_2.ts` will be evaluated before `functions_0.ts`. By the time `main()` is even defined, the bundle's state will thus not be 2.

However, it is not clear which of `functions_0.ts` or `functions_1.ts` will be evaluated first. Depending on how the bundle is evaluated or was compiled, either `functions_0.ts` or `functions_1.ts` could be evaluated first. The bundle's state could be _non-deterministically_ either 0 or 1.

Thus it is recommended that you access context once throughout your entire bundle, or make sure you understand which order your files are going to be evaluated to avoid the above issue.

## Accessing Other Modules
It is possible for one bundle to access the context of another:
::: code-group
```ts [curve/src/index.ts]
import context from 'js-slang/context';

// If the rune module was also loaded, this object *may* not be null
if (context.moduleContexts.rune) {
  console.log('Both the rune and curve modules were loaded!')
} else {
  console.log('Only the curve module was loaded')
}
```
:::

However, the order in which modules are evaluated is not guaranteed. In the above code, if the `curve` module was evaluated first, it would indicate that only the `curve` module was loaded since `rune`'s state object has yet to be initialized. Thus, use this feature with caution.

## Initializing Context Outside the Bundle

Normally data flows from the bundle to the context object: i.e. the bundle contains the code that initializes the module's state object. However, it is also possible for the module's state object to be initialized before the bundle is loaded.

For example, the `game` module's [room preview feature](https://github.com/source-academy/frontend/blob/master/src/features/game/scenes/roomPreview/RoomPreview.ts) utilizes a special evaluation context:
```ts
// within createContext()

// Create an evaluation context
this.context = createContext(Chapter.SOURCE_4, [], 'playground', Variant.DEFAULT);

// Initialize the context for the game module
this.context.moduleContexts.game = {
  tabs: null,
  state: {
    scene: this,
    preloadImageMap: this.preloadImageMap,
    preloadSoundMap: this.preloadSoundMap,
    preloadSpritesheetMap: this.preloadSpritesheetMap,
    remotePath: (file: string) => toS3Path(file, true),
    screenSize: screenSize,
    createAward: (x: number, y: number, key: ItemId) => this.createAward(x, y, key)
  }
};

// Pass the context to the runInContext function from js-slang
```
The `game` bundle is then able to use the data provided to it:
```ts
// game/functions.ts
import context from 'js-slang/moduleContexts';

export default function gameFuncs() {
  const {
    scene,
    preloadImageMap,
    preloadSoundMap,
    preloadSpritesheetMap,
    remotePath,
    screenSize,
    createAward,
  } = context.moduleContexts.game.state || {
    // ...defaultValues
  };
  // Here we know for sure that the game module's state object has been initialized
  // but the check is still here just in case the module was not used in its intended way


  // do other things...
}
```
