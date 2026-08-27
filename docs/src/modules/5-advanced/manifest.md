---
title: Modules Manifest
---
# The Modules Manifest

Every bundle has its own [manifest](../2-bundle/1-overview/1-overview#manifestjson), but there is also a combined manifest, which actually consists of all the
separate bundles' manifests combined into one. This serves as a easy file for `js-slang` to check against when loading bundles and also to make
sure that the bundle being loaded actually exists.

The modules manifest is located at `build/modules.json`. It is not intended to be modified directly. Rather, you should modify the fields in your bundle's
`package.json` and `manifest.json`.

The manifest is generated automatically during build time, but if you want to regenerate the manifest, you can use `yarn buildtools manifest` from the root of
the repository to regenerate the manifest.

## Documentation site visibility

Separately, [`conductor-modules.json`](https://github.com/source-academy/modules/blob/master/conductor-modules.json) at the root of the repository is a
manually maintained allowlist of bundles shown on the [documentation site](https://source-academy.github.io/modules/documentation/). Bundles that haven't
been migrated to Conductor yet don't work correctly in the current Source Academy frontend, so they're deliberately left off this list to avoid confusing
students with documentation for modules they can't actually use.

Once your bundle has been migrated to Conductor and is ready for students to see, add its directory name to `conductor-modules.json` in the same pull
request. This file only controls the documentation site - it has no effect on `build/modules.json` above, so it doesn't change which modules are actually
loadable in the Source Academy IDE.
