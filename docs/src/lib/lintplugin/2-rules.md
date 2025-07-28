# Rules Reference
[[toc]]

## `tab-type`

Enforces that types have a default export using the `defineTab` helper.

Examples of **incorrect** code for this rule:
```tsx
export default 0;

export default {
  body: () => <Component />,
  toSpawn: () => false,
  iconName: 'icon',
  label: 'tab'
}
```
Examples of **correct** code for this rule:
```tsx
import { defineTab } from '@sourceacademy/modules-lib/tabs';

export default defineTab({
  body: () => <Component />,
  toSpawn: () => false,
  iconName: 'icon',
  label: 'tab'
});
```

The rule considers the code below **correct** even if the import is aliased:
```tsx
import { defineTab as tabHelper } from '@sourceacademy/modules-lib/tabs';

export default tabHelper({
  body: () => <Component />,
  toSpawn: () => false,
  iconName: 'icon',
  label: 'tab'
});
```

### Options
This rule accepts a configuration array with two elements:
- The first option represents the expected import source. This is by default `@sourceacademy/modules-lib/tabs` but can be changed to whatever is in use
- The second option is the name of the imported helper. This is by default `defineTab`.

Examples of **correct** code using these options:
```tsx
/* eslint @sourceacademy/tab-type: ['error', '@sourceacademy/modules-lib/tabs/utils', 'tabHelper'] */
import { tabHelper } from '@sourceacademy/modules-lib/tabs/utils';

export default tabHelper({
  body: () => <Component />,
  toSpawn: () => false,
  iconName: 'icon',
  label: 'tab'
});
```

## `region-comment`
This rule enforces that each `// #region` comment is named and paired with a corresponding `// #endregion` comment.

Examples of **correct** code for this rule:
```ts
// #region Region1
export function foo() {}
// #endregion Region1
```

Regions can overlap:
```ts
// #region Region1
// #region Region2
export function foo() {}
// #endregion Region2
// #endregion Region1
```

Examples of **incorrect** code for this rule:

```ts
// Missing name for region
// #region
export function foo() {}
// #endregion

// Missing #region tag
export function bar() {}
// #endregion 1
```
