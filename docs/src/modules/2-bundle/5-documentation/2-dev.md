---
title: Developer Documentation
---

# Documentation for Developers

As part of good practice, you should write documentation to assist future developers that might want to
add to or modify the functionalities of your bundle.

## Locations

Developer documentation for bundles are located in two places:

### 1. As a `README` file at the root of your bundle:

```dirtree
name: bundle0
children:
- name: manifest.json
  comment: the
- name: package.json
  comment: usual stuff
- src
- name: README.md
  comment: Your README file here!
```

This file should contain basic information regarding your bundle such that someone wouldn't have to
install any further dependencies to be able to view it (i.e they wouldn't need to spin up
the entire documentation server to read it).

If you have more complex documentation needs, you can follow the instructions in the next section.

### 2. As a collection of Markdown files located [here](../../../lib/dev):

Within the `dev` folder, markdown files are collated and displayed in the index page. Each
markdown file/folder structure represents a separate bundle.

For example:
```dirtree
name: dev
children:
- name: index.md
  comment: Index Page

- name: curve.md
  comment: Documentation for the curve bundle

- name: game.md
  comment: Documentation for the game bundle

- name: your_bundle.md
  comment: Add your own bundle's documentation!
```

### 3. Throughout Your Code

Especially when your bundle intentionally breaks conventions or rules, or when you need to do
something unconventional, you should leave comments in your source code detailing why.

For example, the `communication` bundle uses the `mqtt` bundle but doesn't use its main
export. The comment explains why the alternate import is being used.
```ts
import { connect, type MqttClient, type QoS } from 'mqtt/dist/mqtt';
// Need to use "mqtt/dist/mqtt" as "mqtt" requires global, which SA's compiler does not define.
```

## What to include?

You should document:
- Your thought processes behind your code
- How you intend for cadets to use your bundle
- Information flows (like what functions write to the module context etc...)
- Any interesting quirks or configurations required to get your bundle working
- How the underlying implementation of your bundle actually works

::: details The `pix_n_flix` bundle
A good example for the last point is the `pix_n_flix` bundle, where many of the cadet facing functions, when called,
actually queue their effects to be applied and don't execute immediately.

Documenting how and when those functions actually
execute and interact with cadet code would be helpful to future developers working with the bundle.
:::

> [!IMPORTANT] Global Variables
> Though the use of global variables is generally considered bad practice, they might not be avoidable
> in the design of your bundle. (In fact, many of the older bundles need to rely on global variables)
>
> You _should_ document where such variables are written to and read from.
