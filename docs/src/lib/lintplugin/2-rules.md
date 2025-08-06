# Rules Reference
[[toc]]

## `default-import-name`
Enforces that the name assigned to a default or namespace import is consistent.

This rule was primarily created to avoid developers using the import <nobr><code>import path from 'path'</code></nobr> since the identifier `path` would be end up being used in other places often.
With this linting rule, common default imports (especially those from Node) will be named consistently.

The rule has a configuration option, which is just an object whose keys represent import sources and values represent valid identifier values:
```ts
type RuleOptions = {
  [source: string]: string | string[]
}
```

### Specifying a Single Name
#### ❌ Examples of incorrect code for this rule with `{ path: 'pathlib' }`:
```ts
// with the option set to { path: 'pathlib' }
import path from 'path';
import * as path from 'path';
```

#### ✅ Examples of correct code for this rule with `{ path: 'pathlib' }`:
```ts
// with the option set to { path: 'pathlib' }
import pathlib from 'path';
import * as pathlib from 'path';
import fs from 'fs/promises' // This is ignored because it wasn't specified in the options
```

### Specifying Multiple Names
If you specify multiple valid names, then any one of those names is accepted:

#### ✅ Examples of correct code for this rule with `{ path: ['path', 'pathlib'] }`:
```ts
import pathlib from 'path';
import path from 'path';
```

### Specifying Multiple Sources
You can of course, enforce naming for more than one import source:

```ts
// with option: { path: 'pathlib', 'fs/promises': 'fs' }

import fs from 'fs/promises';
import path from 'pathlib'

// both import statements will be validated!
```

## `tab-type`

Enforces that tabs have a default export using the `defineTab` helper.

### ❌ Examples of **incorrect** code for this rule:
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

✅ Examples of **correct** code using these options:
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

### ✅ Examples of **correct** code for this rule:
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

### ❌ Examples of **incorrect** code for this rule:

```ts
// Missing name for region
// #region
export function foo() {}
// #endregion

// Missing #region tag
export function bar() {}
// #endregion 1
```
