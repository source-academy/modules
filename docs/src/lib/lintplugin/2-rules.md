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
};
```

### Specifying a Single Name

#### ❌ Examples of incorrect code for this rule with `{ path: 'pathlib' }`

```ts
// with the option set to { path: 'pathlib' }
import path from 'path';
import * as path from 'path';
```

#### ✅ Examples of correct code for this rule with `{ path: 'pathlib' }`

```ts
// with the option set to { path: 'pathlib' }
import pathlib from 'path';
import * as pathlib from 'path';
import fs from 'fs/promises'; // This is ignored because it wasn't specified in the options
```

### Specifying Multiple Names

If you specify multiple valid names, then any one of those names is accepted:

#### ✅ Examples of correct code for this rule with `{ path: ['path', 'pathlib'] }`

```ts
import pathlib from 'path';
import path from 'path';
```

### Specifying Multiple Sources

You can of course, enforce naming for more than one import source:

```ts
// with option: { path: 'pathlib', 'fs/promises': 'fs' }

import fs from 'fs/promises';
import path from 'pathlib';

// both import statements will be validated!
```

## `no-barrel-imports`

Enforces that imports from a certain source uses individual imports intead of the main barrel import.

This rule was primarily motivated by packages like `lodash` and `@mui`, which re-export all their functionalities
through the main export, but also make each function available in a separate package:

```ts
// Imports from the root package
import _ from 'lodash';
_.memoize(func);

import { memoize } from 'lodash';
memoize(func);
// vs importing from a "sub-package"
import memoize from 'lodash/memoize';
memoize(func);
```

The reason for these "per method imports" is to help bundlers more effectively tree-shake and thus more effectively reduce final bundle size.

> [!INFO] Why not directly use "per method packages"?
> In theory, `lodash` provides its sub-packages as actual packages you can install separately without having to install the entire `lodash` bundle.
> However, the `lodash` [documentation](https://lodash.com/per-method-packages) recommends against this practice for reasons mentioned there.

The exception to this is Typescript "type-only" imports, since those automatically get removed from the output source code:

```ts
// Are perfectly ok
import type _ from 'lodash';
import type { memoize } from 'lodash';
```

### Fixes

The rule replaces the original import with different import statements from each of the subpackages:

```ts
import { memoize } from 'lodash';
// gets autofixed to
import memoize from 'lodash/memoize';
```

If you aliased the import, the appropriate alias name will be used:

```ts
import { memoize as func } from 'lodash';
// gets autofixed to
import func from 'lodash/memoize';
```

Multiple imports from the root package get transformed like this:

```ts
import { memoize as func, cloneDeep } from 'lodash';
// gets autofixed to
import func from 'lodash/memoize';
import cloneDeep from 'lodash/cloneDeep';
import cloneDeep from 'lodash/cloneDeep';
```

Type-only imports, when mixed with default imports, also get autofixed:

```ts
import { type memoize as func, cloneDeep } from 'lodash';
// gets autofixed to
import type func from 'lodash/memoize';
import cloneDeep from 'lodash/cloneDeep';
```

> [!WARNING]
> This only tells the rule what import sources to check for. It doesn't perform any kind of verification that the sub-package export paths
> are actually available. For example, the rule will not actually verify that `lodash/memoize` is a valid import path and that it does have a default export

### Options

The rule should be configured with an array of package names to check:

```js
const config = {
  rules: {
    '@sourceacademy/no-barrel-imports': ['error', ['lodash']]
  }
};
```

### ✅ Examples of **correct** code for this rule

```ts
// with @sourceacademy/no-barrel-imports: ['error', ['lodash']]

// Lone default or namespace imports are ok
import _ from 'lodash';
import * as _ from 'lodash';

// Type-only imports are okay
import type _ from 'lodash';
import type { memoize } from 'lodash';
```

### ❌ Examples of **incorrect** code for this rule

```ts
// with @sourceacademy/no-barrel-imports: ['error', ['lodash']]

// Regular Import
import { memoize } from 'lodash';

// Default import mixed with type imports
import _, { type memoize } from 'lodash';
```

## `region-comment`

This rule enforces that each `// #region` comment is named and paired with a corresponding `// #endregion` comment.

### ✅ Examples of **correct** code for this rule

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

### ❌ Examples of **incorrect** code for this rule

```ts
// Missing name for region
// #region
export function foo() {}
// #endregion

// Missing #region tag
export function bar() {}
// #endregion 1
```

## `tab-type`

Enforces that tabs have a default export using the `defineTab` helper.

### ❌ Examples of **incorrect** code for this rule

```tsx
export default 0;

export default {
  body: () => <Component />,
  toSpawn: () => false,
  iconName: 'icon',
  label: 'tab'
};
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
If the rule was configured with `['error', '@sourceacademy/modules-lib/tabs/utils', 'tabHelper']`:

```tsx
import { tabHelper } from '@sourceacademy/modules-lib/tabs/utils';

export default tabHelper({
  body: () => <Component />,
  toSpawn: () => false,
  iconName: 'icon',
  label: 'tab'
});
```
