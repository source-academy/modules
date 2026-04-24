# Overview of Tabs

A Module's Tab(s) enables a modules to provide an interactive interface to users. Tabs are written in TSX (Typescript React) and are designed to
be used with the [frontend](https://github.com/source-academy/frontend).

## Tab Directory Structure Overview

The typical tab directory structure is shown below.

```dirtree
name: TabName
children:
  - index.tsx
  - tsconfig.json
  - package.json
```

Alternatively, should you wish to use a `src` folder:

```dirtree
name: TabName
children:
  - name: src
    children:
      - index.tsx
      - component.tsx
  - tsconfig.json
  - package.json
```

> [!NOTE]
> The name of the root folder will be the name of the tab

Tabs also support testing (using both `.ts` and `.tsx` extensions):

```dirtree
name: TabName
children:
  - name: src
    children:
      - name: __tests__
        children:
          - name: index.test.tsx
            comment: You can use a tsx file
          - name: index.test.ts
            comment: Or a regular ts file
      - index.tsx
      - component.tsx
  - tsconfig.json
  - package.json
```

The name of the tab is what you should refer to the tab as in its parent bundle's manifest:

```json
{
  "tabs": ["TabName"]
}
```

## Tab Entry Point

The entry point for a tab is either `index.tsx` or `src/index.tsx`. No other entrypoints will be considered valid.

The Frontend expects each tab's entry point to provide a default export of an object conforming to the following interface:

```ts twoslash
import type { ModuleSideContent as _Content, DebuggerContext } from '@sourceacademy/modules-lib/types';
type IconName = _Content['iconName'];
// ---cut---
interface ModuleSideContent {
  toSpawn: ((context: DebuggerContext) => boolean) | undefined;
  body: (context: DebuggerContext) => React.ReactElement;
  label: string;
  // @blueprintjs/core icon names
  iconName: IconName;
}
```

To ensure that your tab conforms to this interface, use the `defineTab` helper:

```ts twoslash
// @noErrors: 2345
import { defineTab } from '@sourceacademy/modules-lib/tabs/utils';

export default defineTab({
  // ...details
});
```

Here is an example of a tab object:

```tsx twoslash [Sound/src/index.tsx]
// @jsx: react-jsx
import type { AudioPlayed } from '@sourceacademy/bundle-sound/types';
declare function SoundTab(props: { elements: AudioPlayed[] }): React.ReactElement;
// ---cut---
import type { SoundModuleState } from '@sourceacademy/bundle-sound/types';
import { defineTab, getModuleState } from '@sourceacademy/modules-lib/tabs/utils';

export default defineTab({
  toSpawn(context) {
    const state = getModuleState<SoundModuleState>(context, 'sound');
    return !!state && state.audioPlayed.length > 0;
  },
  body(context) {
    const { audioPlayed } = getModuleState<SoundModuleState>(context, 'sound')!;
    return <SoundTab elements={audioPlayed} />;
  },
  label: 'Sound Tab',
  iconName: 'music'
});
```

> [!TIP] Using getModuleState
>
> Often, to access your module state using plain Javascript, you would probably have to use a long chain of
> property accesses or object destructuring:
>
> ```ts
> const { context: { moduleContexts: { sound: { state: { audioPlayed } } } } } = context;
> // or
> const audioPlayed = context.context.moduleContexts.sound.state.audioPlayed;
> ```
>
> The risk here is that each one of these property accesses could return `null` or `undefined`, resulting
> in a `TypeError` at runtime. What you would need to do is "null-coalesce" - propagate the `null` or `undefined`
> all the way to the end:
>
> ```ts
> const toSpawn = (context: DebuggerContext): boolean => {
>   // Can't use destructuring with null coalescing
>   const audioPlayed = context.context.moduleContexts?.sound?.state?.audioPlayed;
>   return audioPlayed && audioPlayed.length > 0;
> };
> ```
>
> To remedy all of this, you can simply call `getModuleState` instead, which
> abstracts the all of the accessing and destructuring for you:
>
> ```ts twoslash
> import type { DebuggerContext } from '@sourceacademy/modules-lib/types';
> import type { SoundModuleState } from '@sourceacademy/bundle-sound/types';
> // ---cut---
> import { getModuleState } from '@sourceacademy/modules-lib/tabs/utils';
>
> const toSpawn = (context: DebuggerContext): boolean => {
>   // Can't use destructuring with null coalescing
>   const state = getModuleState<SoundModuleState>(context, 'sound');
>   return !!state && state.audioPlayed.length > 0;
> };
> ```
>
> Then in your `body` function, you can use a non-null assertion. 
> 
> ```tsx twoslash
> // @jsx: react-jsx
> import type { DebuggerContext } from '@sourceacademy/modules-lib/types';
> import type { AudioPlayed, SoundModuleState } from '@sourceacademy/bundle-sound/types';
> declare function SoundTab(props: { elements: AudioPlayed[] }): React.ReactElement;
> // ---cut---
> import { getModuleState } from '@sourceacademy/modules-lib/tabs/utils';
>
> const body = (context: DebuggerContext): React.ReactElement => {
>   const { audioPlayed } = getModuleState<SoundModuleState>(context, 'sound')!;
>   return <SoundTab elements={audioPlayed} />;
> };
> ```
>
> As long as your `toSpawn` code is correct, accessing your module context should not throw a `TypeError`
> because of attempting to access a property on `undefined` or other similar errors.
>
> You will need to explicitly pass in the type of your state object, since `getModuleState` won't be able
> to infer it by itself.

Here are explanations for each member of the tab interface:

### `toSpawn`

If not provided or `undefined`, when its corresponding bundle is loaded, the tab will always be spawned.

Otherwise, the tab will be spawned depending on the return value of the function, true to spawn the tab, false otherwise. This is where you can use module contexts to determine if the tab should be spawned.

```ts
// Will spawn the Curve tab if there are any drawn curves
const toSpawn = (context: DebuggerContext) => {
  const state = getModuleState<CurveModuleState>(context, 'curve');
  return !!state && state.drawCurves.length > 0;
};
```

### `body`

If `toSpawn` returns true, this function will be called to generate the content to be displayed. You can use JSX syntax for this.

```tsx
const body = (context: DebuggerContext) => <div>This is the repeat tab</div>;
```

Similarly, the debugger context is available here, which allows you to access module contexts or the result of the program that was just evaluated.

### `label`

A string containing the text for the tooltip to display when the user hovers over the tab's icon.

### `iconName`

The name of the BlueprintJS icon to use for the tab icon. You can refer to the list of icon names [here](https://blueprintjs.com/docs/#icons).

Note that `IconName`s are defined in `@blueprintjs/core`, but it is not necessary to import that type.

## Tab Evaluation

A tab is only evaluated once per Source evaluation. Only one instance of a given tab can be spawned at the same time. Your tab and bundle should be designed with this in mind.

For example, the `sound` bundle stores in its state an array of `AudioPlayed` objects, which allows the single tab to handle multiple calls to `play_in_tab`, which is the function in the bundle that causes the tab to spawn.

Other bundles like `repl` have a single instance. The bundle never spawns a second instance of its programmable REPL, so the single REPL tab that spawns handles everything.
