# `instanceof-check`

This rule highlights whenever an `instanceof` expression is used in tab code against a type that is imported from a bundle or the modules library. Such checks might
fail at runtime as described [here](../../../modules/5-advanced/misc#instanceof-will-not-work-at-runtime)

The rule can be configured with an array of regex strings to match against import sources that might cause runtime `instanceof` checks to fail. For example:

```ts
// By default, the rule matches against bundles and modules-lib

const config = {
  '@sourceacademy/instanceof-check': [
    'error', [
      '@sourceacademy/bundle-.+',
      '@sourceacademy/modules-lib(?:/.+)?',
    ]
  ]
};
```

## ✅ Examples of **correct** code for this rule

The rule will not highlight when the `instanceof` check is being performed against an imported class is being imported from a bundle or `modules-lib`.

```tsx twoslash [foo/index.tsx]
// @jsx: react-jsx
// @noErrors: 2307
declare function FooTab(): React.ReactElement;
// ---cut---
import { defineTab, getModuleState } from '@sourceacademy/modules-lib/tabs/utils';
import { ClassX } from 'some_package';

export default defineTab({
  toSpawn(context) {
    return getModuleState(context, 'foo') instanceof ClassX;
  },
  body() {
    return <FooTab />;
  },
  label: 'FooTab',
  iconName: 'shapes'
});

```

## ❌ Examples of **incorrect** code for this rule

The rule will highlight when the `instanceof` check is being performed against an imported class is being imported from a bundle or `modules-lib`.

```tsx twoslash [foo/index.tsx]
// @filename: funcs.ts
// @paths: { "@sourceacademy/bundle-foo": ["./funcs.ts"] }
export declare class ClassX {};
// @jsx: react-jsx
// @filename: index.tsx
declare function FooTab(): React.ReactElement;
// ---cut---
import { ClassX } from '@sourceacademy/bundle-foo';
import { defineTab, getModuleState } from '@sourceacademy/modules-lib/tabs/utils';

export default defineTab({
  toSpawn(context) {
    // By comparing to a class from a bundle via a tab, this check
    // might fail at runtime unintentionally
    return getModuleState(context, 'foo') instanceof ClassX;
    //     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  },
  body() {
    return <FooTab />;
  },
  label: 'FooTab',
  iconName: 'shapes'
});
```
