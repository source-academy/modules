---
order: 4
---

# The Modules Manifest

Each bundle contains its own manifest. However, after compilation, the manifest remains a separate file that doesn't get included with the bundle's compiled code.

Instead, after all bundles are built, all the bundle manifests are collated to produce a singular JSON file that is written to `build/modules.json`.

When `js-slang` tries to load Source modules, it first checks the module manifest for information about that module, like what tabs if any it should load.
