# Editing an Existing Tab

This page contains instructions for modifying an existing tab. If you are creating a new tab from scratch, refer to [these](./2-creating) instructions instead.

## Installing Dependencies

To install **only** the dependencies required by the tab you are modifying, use the command below:

```sh
yarn workspaces focus @sourceacademy/Tab-[desired tab]
```

> [!TIP]
> You may require functionalities from the root package, or other packages from this repository.
> It is possible to focus multiple workspaces at once:
<<<<<<< HEAD
=======
>
>>>>>>> workspaces-fix
> ```sh
> yarn workspaces focus @sourceacademy/Tab-[desired tab] @sourceacademy/modules
> ```

## Adding Dependencies

Your tab may need other Javascript packages. To add a dependency to your tab, run the command below:

```sh
yarn add [dependency]
```

If the dependency does not need to be present during runtime, then use:

```sh
yarn add --dev [dependency]
```

This adds the dependency to `devDependencies` instead.

> [!WARNING]
> You should only run this command in the directory of your tab. Otherwise, the dependency will end up being added to the
> root repository.

> [!NOTE]
> There are certain dependencies that are common to all tab (like `react`). When adding such a dependency, remember to add the exact version
> specified in the root repository `package.json`:
>
> ```sh
> yarn add react@^18.3.1
> ```
>
> You can also use the command `yarn constraints`  to check if you have incorrectly specified the version of a dependency. You can view all
> constraints [here](../../repotools/5-yarn).

> [!NOTE]
> When adding dependencies that originate from the repository (e.g `@sourceacademy/modules-lib`), use `workspace:^` as the given version:
>
> ```sh
> yarn add @sourceacademy/modules-lib@workspace:^
> ```

You can also add the dependency directly by modifying your `package.json`:

```jsonc {4}
{
  "name": "@sourceacademy/tab-Tab0",
  "dependencies": {
    "lodash": "^4.0.0"
  }
}
```

If you do so, remember to run your installation command (same as the one above) to update the lockfile.

## React/UI Components

Tabs are written using the React (JSX) syntax. In React, each UI element is referred to as a "component". Documentation on how to create UIs and use React can be found [here](https://react.dev). Where possible,
you should aim to write components using the functional syntax.

::: details Functional vs Class Components
Traditionally, React's functional components could not be "stateful". If a component needed to store state, it had to be written as a [class component](https://react.dev/reference/react/Component).

With the introduction of [hooks](https://react.dev/reference/react/hooks) in React 16, functional components could now be stateful and became the go-to method for writing React components. Officially, React now considers class components a legacy API and
all new code should be written using the functional style.

Within this repository, many of the tabs were written before the introduction and widespread use of functional components. Regardless, you should be designing your components using the functional component syntax where possible.
:::

Source Academy's frontend was designed using the [Blueprint UI library](https://blueprintjs.com). To ensure visual consistency, SA Module Tabs also make use of components and styling from this library.

If you need a specific kind of functionality (like a [button](https://blueprintjs.com/docs/versions/5/#core/components/buttons) or a [textbox](https://blueprintjs.com/docs/versions/5/#core/components/text-area)), you should check if this library contains a
component that performs the functions that you need before either installing a new package or writing the component yourself.

::: details The 'Automatic' JSX Transform
JSX Transforms describe what compilers should do with TSX/JSX syntax.

React 17 [introduced](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) a new "automatic" transform mode. Old React code required that React be in scope (e.g. imported into the module), but this
new transform waives that requirement.

All tab code must be compiled down to regular Javascript before they can be loaded by the frontend. This is done using the new transform, indicated by the `jsx: 'react-jsx'` option
in the root `tsconfig.json` used by tabs. `esbuild` reads from `tsconfig.json` and retrieves this option when compiling tabs.
:::

### Components from the Common Library

There are also several React components defined under `@sourceacademy/modules-lib/tabs` that perform functions common across tabs.

You can see the documentation for these components [here](/lib/modules-lib/)

## Export Interface

As mentioned in the [overview](./1-overview), all tabs should export a single default export from their entry point using the `defineTab` helper from `@sourceacademy/modules-lib/tabs`:

```tsx
// tabName/src/index.tsx OR tabName/index.tsx
import { defineTab } from '@sourceacademy/modules-lib/tabs';

function Component() {
  return <p>This is a react component!</p>;
}

export default defineTab({
  toSpawn: () => true,
  body: () => <Component />,
  label: 'some-tab',
  iconName: 'some icon'
});
```

This provides type checking to ensure that the tab correctly conforms to the interface required by the frontend. There is a linting rule that has been configured to show an error
if you do not use the `defineTab` helper or if your tab is missing the default export.

> [!TIP]
> For the Devserver to be able to accurately detect the changes you make to your tab while in hot-reload mode, you should define your component
> outside of the `body` property as in the example **above** and **not** within the property as in the example below:
>
> ```tsx
> // incorrect example
> export default defineTab({
>   toSpawn: () => true,
>   body: () => {
>     return <p>This is a react component!</p>;
>   },
>   label: 'some-tab',
>   iconName: 'some icon'
> });
> ```

Only the default export is used by the Frontend for displaying your tab. It is not necessary to also export your components, but it can be done for testing:
::: code-group

```tsx [index.tsx]
import { defineTab } from '@sourceacademy/modules-lib/tabs';

export function Component() {
  return <p>This is a react component!</p>;
}

export default defineTab({
  toSpawn: () => true,
  body: () => <Component />,
  label: 'some-tab',
  iconName: 'some icon'
});
```

```tsx [__tests__/index.tsx]
import { expect, test } from 'vitest';
import { Component } from '..';

test('Matches snapshot', () => {
  expect(<Component />).toMatchSnapshot();
});
```

:::

## Working with Module Contexts from within Tabs

Refer to [this](../5-advanced/context) about using module contexts.

## Quick FAQs

### When to spawn the tab?

As mentioned, when a `js-slang` program that imports Source modules gets evaluated, the frontend will go through the list of tabs for
the bundles currently loaded and determine if it should spawn those bundles' tabs. This is done
by calling the tab's `toSpawn` function (if it exists). If the function is missing, then the tab is always spawned.

In most cases, you should use the `toSpawn` function. This way, if the parent bundle is imported but no tab functions are called, the frontend won't have
to waste time loading the tab's UI. More importantly, it gives the developer more fine grained control of when the tab should be spawned.

However, there are some cases where it makes sense to have the tab always spawn. For example, the `pix_n_flix` tab doesn't rely on any functionality from the bundle.
So long as the `pix_n_flix` bundle is imported, the tab will be spawned.

Each tab is only ever loaded and evaluated once per program evaluation (i.e both `body` and `toSpawn` are only ever called once each).

### Can I update other UI elements in the frontend?

Right now, the UI is only updated once per evaluation (a limitation on the side of the frontend). This means that if code from your tab calls functions
like `display`, the output of those functions won't be displayed in the main REPL. The only elements that can be changed are elements within the tab.

As a workaround, bundles like the `repl` bundle provide their own REPL output. That way, when the `repl` bundle evaluates code, the output of that code
is still visible to the user.
