# `default-import-name`

Enforces that the name assigned to a default or namespace import is consistent.

This rule was primarily created to avoid developers using the import <nobr><code>import path from 'path'</code></nobr> since the identifier `path` would be end up being used in other places often.
With this linting rule, common default imports (especially those from Node) will be named consistently.

The rule has a configuration option, which is just an object whose keys represent import sources and values represent valid identifier values:

```ts
type RuleOptions = {
  [source: string]: string | string[];
};
```

## Specifying a Single Name

### ❌ Examples of incorrect code for this rule with `{ path: 'pathlib' }`

```ts
// with the option set to { path: 'pathlib' }
import path from 'path';
import * as path from 'path';
```

### ✅ Examples of correct code for this rule with `{ path: 'pathlib' }`

```ts
// with the option set to { path: 'pathlib' }
import pathlib from 'path';
import * as pathlib from 'path';
import fs from 'fs/promises'; // This is ignored because it wasn't specified in the options
```

## Specifying Multiple Names

If you specify multiple valid names, then any one of those names is accepted:

### ✅ Examples of correct code for this rule with `{ path: ['path', 'pathlib'] }`

```ts
import pathlib from 'path';
import path from 'path';
```

## Specifying Multiple Sources

You can of course, enforce naming for more than one import source:

```ts
// with option: { path: 'pathlib', 'fs/promises': 'fs' }

import fs from 'fs/promises';
import path from 'pathlib';

// both import statements will be validated!
```
