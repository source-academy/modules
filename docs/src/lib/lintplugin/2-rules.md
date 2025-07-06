# Rules Reference

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

## Options
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
