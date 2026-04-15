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
<<<<<<< HEAD
  toSpawn?: (context: DebuggerContext) => boolean;
  body: (context: DebuggerContext) => JSX.Element;
=======
  toSpawn: ((context: DebuggerContext) => boolean) | undefined;
  body: (context: DebuggerContext) => React.ReactElement;
>>>>>>> origin/master
  label: string;
  // @blueprintjs/core icon names
  iconName: IconName;
}
```

To ensure that your tab conforms to this interface, use the `defineTab` helper:

```ts
import { defineTab } from '@sourceacademy/modules-lib/tabs';

export default defineTab({
  // ...details
});
```

Here is an example of a tab object:

```tsx twoslash [Sound/src/index.tsx]
// @jsx: react-jsx
import type { AudioPlayed } from '@sourceacademy/bundle-sound/types';
declare function SoundTab(props: { elements: AudioPlayed[] }): JSX.Element;
// ---cut---
import type { SoundModuleState } from '@sourceacademy/bundle-sound/types';
import { defineTab, getModuleState } from '@sourceacademy/modules-lib/tabs/utils';

export default defineTab({
  toSpawn(context) {
    const { context: { moduleContexts: { sound: { state: { audioPlayed } } } } } = context;
    return audioPlayed.length > 0;
  },
  body(context) {
    // You can use the getModuleState helper instead of the destructuring pattern above
    // but you will need to provide typing for the returned state object
    const { audioPlayed } = getModuleState<SoundModuleState>(context, 'sound');
    return <SoundTab elements={audioPlayed} />;
  },
  label: 'Sound Tab',
  iconName: 'music'
});
```

Here are explanations for each member of the tab interface:

### `toSpawn`

If not provided or `undefined`, when its corresponding bundle is loaded, the tab will always be spawned.

Otherwise, the tab will be spawned depending on the return value of the function, true to spawn the tab, false otherwise. This is where you can use module contexts to determine if the tab should be spawned.

```ts
// Will spawn the Curve tab if there are any drawn curves
const toSpawn = (context: DebuggerContext) => {
  const { context: { moduleContexts: { curve: { state: { drawnCurves } } } } } = context;
  return drawCurves.length > 0;
};
```

### `body`

If `toSpawn` returns true, this function will be called to generate the content to be displayed. You can use JSX syntax for this.

```tsx
const body = (context) => <div>This is the repeat tab</div>;
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
