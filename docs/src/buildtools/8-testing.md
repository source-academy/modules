# Testing Using `Vitest`

`vitest` comes with its own [Node API](https://vitest.dev/advanced/api/) that can be used to run tests from Node. To reduce the number of configuration files required,
the buildtools provide their own default `vitest` configuration for bundles and tabs.

`vitest` supports a similar concept to workspaces known as [projects](https://vitest.dev/guide/projects.html). However, each `vitest` configuration file assumes that it isn't a child project under another root configuration.
So, when we use `mergeConfig` to inherit test configuration options from the root config, `vitest` tries to resolve `projects` field relative to that file. For example, if we have the following `vitest.config.ts`:

```ts
// src/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'Root Test Project',
    projects: [
      'src/bundles/*/vitest.config.ts'
    ]
  }
})
```

And then we have a child config that inherits from the root config:
```ts
// src/bundles/curve/vitest.config.ts

import { mergeConfig, defineProject } from 'vitest/config';
import rootConfig from '../../vitest.config.ts';

export default mergeConfig(
  rootConfig,
  defineProject({
    test: {
      name: 'Child Project'
    }
  })
)
```

If we run `vitest` from the root of the repository, it will accurately detect `"Child Project"` is a valid project name. However, the buildtools need to be able to be executed from within the bundle's directory too.

If we run the following command within the bundles directory, we will find that `vitest` cannot find a project with the name "Child Project":

```sh
yarn vitest --project "Child Project"
```

This can be solved by configuring the root `vitest.config.ts`'s root parameter:

```ts {6}
// src/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: import.meta.dirname,
    name: 'Root Test Project',
    projects: [
      'src/bundles/*/vitest.config.ts'
    ]
  }
})
```
This causes `vitest` to resolve the configuration correctly every time.

## Vitest for specific Bundle/Tab

However, even with the configuration above, we face an issue. `vitest` requires that each project specification matches a specific file. The pattern `src/bundles/*/vitest.config.ts` matches all `vitest.config.ts` files under the
top-level directory of each bundle. This is equivalent to `src/bundles/*`, since by default, `vitest` will try to find a file named `vitest.config`. This requires that the specific configuration file exists in that folder for it to be considered a project.

This means that for a bundle/tab's tests to be detected, that bundle or tab would need to maintain its own `vitest` config. Alternatively, the specific configuration for that bundle/tab could be added directly to the root config. Neither of these solutions are particularly ideal.
The former would run the risk of misconfiguration, and the latter would cause the root configuration to become cluttered and defeat the purpose of splitting the repository into workspaces.

To remove the need for each bundle/tab to contain its own Vitest config, the buildtools provide the configuration manually:

<<< ../../../lib/buildtools/src/testing.ts

Within the `runIndividualVitest` function, the bundle/tab you are trying to run tests for gets configured as its own test project that inherits options from the root configuration file.

With this, running `yarn test` within a bundle or tab's directory structure will only run the tests for that tab or bundle without requiring the `--project` or directory filters.

## Vitest for all bundles or all tabs or both

The approach above works when you know that the current tab or bundle has tests that need to be run. In order to run tests for **all** bundles or **all** tabs at once, the buildtools would have to determine
which bundles and tabs have tests and which don't (as Vitest considers it an error if you give it a test project that it can't find tests for).

Instead, all bundles and all tabs are configured as a test project each. Hence, under `src/bundles` and `src/tabs` you can find a `vitest.config.js` that is specific to bundles and tabs respectively. This shifts
the responsibility for determining which bundles and tabs contain tests onto `vitest` itself and so it will not fail (unless for some reason every single bundle and tab test was removed).
