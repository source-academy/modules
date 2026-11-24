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
