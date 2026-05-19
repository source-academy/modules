# `no-barrel-imports`

Enforces that imports from a certain source uses individual imports instead of the main barrel import.

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

## Fixes

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

## Options

The rule should be configured with an array of package names to check:

```js
const config = {
  rules: {
    '@sourceacademy/no-barrel-imports': ['error', ['lodash']]
  }
};
```

## ✅ Examples of **correct** code for this rule

```ts
// with @sourceacademy/no-barrel-imports: ['error', ['lodash']]

// Lone default or namespace imports are ok
import _ from 'lodash';
import * as _ from 'lodash';

// Type-only imports are okay
import type _ from 'lodash';
import type { memoize } from 'lodash';
```

## ❌ Examples of **incorrect** code for this rule

```ts
// with @sourceacademy/no-barrel-imports: ['error', ['lodash']]

// Regular Import
import { memoize } from 'lodash';

// Default import mixed with type imports
import _, { type memoize } from 'lodash';
```
