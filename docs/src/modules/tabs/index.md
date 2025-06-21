# Overview of Tabs
A Module's Tab(s) enables a modules to provide an interactive interface to users. Tabs are written in TSX (Typescript React) and are designed to
be used with the [frontend](https://github.com/source-academy/frontend).

## Tab Directory Structure Overview
The typical tab directory structure is shown below.

```
tabName
├── index.tsx
├── tsconfig.json
└── package.json
```

Alternatively, should you wish to use a `src` folder:
```
tabName
├── src
│   ├── index.tsx
│   ├── component.tsx
│   └── ...
├── tsconfig.json
└── package.json
```

## Tab Entry Point
The entry point for a tab is either `index.tsx` or `src/index.tsx`. No other entrypoints will be considered valid.

The Frontend expects each tab's entrypoint to provide a default export of an object conforming to the following interface:

```ts
interface Tab {
  toSpawn: ((context: DebuggerContext) => boolean) | undefined;
  body: ((context: DebuggerContext) => JSX.Element);
  label: string;
  iconName: string;
}
```

To ensure that your tab conforms to this interface, use the `defineTab` helper:
```ts
import { defineTab } from '@sourceacademy/modules-lib/tabs/utils';

export default defineTab({
  // ...details
})

```


Here is an example of a tab object:
```ts
// Curve/src/index.tsx
import { defineTab } from '@sourceacademy/modules-lib/tabs/utils';

export default defineTab({
  toSpawn(context: DebuggerContext) {
    return context.context?.moduleHelpers.curve.state.drawnCurves.length > 0;
  },
  body(context: DebuggerContext) {
    const { context: { modules: { contexts: { curve: { drawnCurves } } } } } = context;
   /*
    * Implementation hidden...
    */
    return <MultiItemDisplay elements={canvases} />;
  },
  label: 'Curves Tab',
  iconName: 'media',
});
```

Here are explanations for each member of the tab interface:

### `toSpawn`
If not provided, when it's corresponding bundle is loaded, the tab will also be loaded.

Otherwise, the tab will be spawned depending on the return value of the function, true to spawn the tab, false otherwise. This is where you can use module contexts to determine if the tab should be spawned.

```ts
// Will spawn the Curve tab if there are any drawn curves
const toSpawn = (context) => context.context.moduleContexts.curve.state.drawnCurves.length > 0
```

### `body`
If `toSpawn` returns true, this function will be called to generate the content to be displayed. You can use JSX syntax for this.
```tsx
const body = (context) => <div>This is the repeat tab</div>;
```
Similarly, the debugger context is available here, which allows you to access module contexts.

### `label`
A string containing the text for the tooltip to display when the user hovers over the tab's icon.

### `iconName`
The name of the BlueprintJS icon to use for the tab icon. You can refer to the list of icon names [here](https://blueprintjs.com/docs/#icons)
