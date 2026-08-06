---
title: 'Stepper Thumbnails for Opaque Values'
---

# Stepper thumbnails for opaque values

A `DataType.OPAQUE` value (see [where recursion stops](./3-opaque)) is, by design, inert to the evaluator - it's handed back out exactly as given, with no attempt to interpret it. That's exactly right for something like a `binary_tree` payload, but it leaves a gap for opaque values that are genuinely *visual* - a `rune`'s WebGL scene graph, a future `curve`'s parametric plot - where a stepper walking through a cadet's program would rather show a small picture than the text `<opaque>`.

Unlike a bitmap image type (DrRacket's `2htdp/image` values, for comparison), these opaque values have no pixels sitting in memory - they're descriptions of a scene that only produce pixels once something drives an actual draw call through a canvas/GPU context. So "thumbnail an opaque value" needs a real render step, and that step can only live inside the module that owns the value - only `rune` knows how to turn its own scene graph into pixels.

## The convention: the value carries its own renderer

Rather than a module-level registry, or a new Python-callable export, a module that wants stepper thumbnails attaches a zero-argument render function directly onto the JS object it already passes to `opaque_make`, under a dedicated `Symbol` key exported from `@sourceacademy/modules-lib`:

```ts
import { RENDER_THUMBNAIL_SYMBOL } from '@sourceacademy/modules-lib/conductor/thumbnail';

Object.defineProperty(value, RENDER_THUMBNAIL_SYMBOL, {
  value: () => renderToDataUrl(value),   // () => Promise<string | undefined>
  enumerable: false,
  configurable: true
});
```

### Why this shape

- **No new public API.** The hook never touches `exports`/the module's Python-facing surface - cadet code can't call it, doesn't know it exists, and none of the module's exported functions change signature.
- **No SDK changes needed.** `opaque_make`/`opaque_get` hand back the exact same live in-memory JS reference, in the same realm - a plain extra property just rides along, no serialization boundary to survive.
- **No provenance/registry bookkeeping for the consumer.** A stepper doesn't need to track "this value came from module X" and look up a renderer by name - the value already carries what it needs.
- **`Symbol.for`, not a plain string or a `Symbol()`.** `Symbol.for('source-academy.stepper.renderThumbnail')` is a *global-registry* symbol - a module and a consumer in entirely different packages/repos (this repo's `rune`, py-slang's stepper) get the identical key without importing from each other. Only the string itself is the real cross-repo contract; `RENDER_THUMBNAIL_SYMBOL` is exported from `modules-lib` purely so nobody has to hand-type it and risk a typo.

### The contract

- **Signature:** `() => Promise<string | undefined>`. Resolves to a data URL (e.g. `data:image/png;base64,...`) on success, or to `undefined` if a render attempt fails at call time - consumers must handle both, never assume the result is always a valid string.
- **Attach only when actually renderable, never throw.** If rendering isn't possible in the current realm (see below), simply don't attach the property at all - a consumer that doesn't find the key falls back to a generic placeholder (ideally the value's constructor name, e.g. `<Rune>`, obtainable for free via `v?.constructor?.name` on the same `opaque_get` payload). If the hook *is* attached but a render attempt fails at call time, resolve to `undefined` rather than rejecting - a broken thumbnail must never surface as a runtime error to cadet code, and a consumer that gets `undefined` back should fall back to the same placeholder it'd use for a missing hook.
- **Mutate the value in place, don't wrap or copy it.** Whatever object shape `opaque_make` receives (e.g. `rune`'s `Rune` class instances) very likely has other code checking `value instanceof SomeClass` on round-trips through `opaque_get` - a spread copy or wrapper object would silently break those checks. `Object.defineProperty(value, ..., { enumerable: false })` on the original object avoids that, and keeps the hook out of `for...in`/`Object.keys`/hand-written serialization that reads named fields explicitly.

## No DOM canvas in the render realm

The module plugin runs in the same realm as the evaluator - which, in production, is a Web Worker, not the main thread. There's no `document`, no `HTMLCanvasElement` there; all of a bundle's normal canvas/WebGL rendering happens host-side (e.g. `rune`'s tab, fed over its `IChannel`), fed by a real, mounted DOM canvas. A thumbnail hook has to produce pixels *without* any of that.

`rune`'s implementation (`src/bundles/rune/src/rune.ts`) uses `OffscreenCanvas`, which is available inside Web Workers and supports both `getContext('webgl')` and `convertToBlob()`. Its existing WebGL draw code (`getWebGlFromCanvas`, `drawRunesToFrameBuffer`, `DrawnNormalRune.draw`) was widened to accept `HTMLCanvasElement | OffscreenCanvas` rather than duplicated, so the exact same shader/buffer logic serves both the tab's live rendering and the headless thumbnail render.

`OffscreenCanvas` + WebGL + `convertToBlob` support isn't universal across every environment an evaluator might run in. `rune` feature-detects (`typeof OffscreenCanvas !== 'undefined'`) before attaching the hook at all, and wraps the actual render in a try/catch that resolves to `undefined` on any failure - see the "attach only when renderable, never throw" rule above.

## Adopting this in another module

A sketch for a hypothetical `curve` adoption, following the exact same shape as `rune`:

```ts
import { RENDER_THUMBNAIL_SYMBOL } from '@sourceacademy/modules-lib/conductor/thumbnail';

function attachThumbnailHook(curve: Curve): Curve {
  if (typeof OffscreenCanvas !== 'undefined') {
    Object.defineProperty(curve, RENDER_THUMBNAIL_SYMBOL, {
      value: () => renderCurveThumbnail(curve),
      enumerable: false,
      configurable: true
    });
  }
  return curve;
}

// wherever the module currently calls opaque_make(curve, ...):
return await this.evaluator.opaque_make(attachThumbnailHook(curve), true);
```

`renderCurveThumbnail` is the one genuinely module-specific piece - reuse whatever WebGL/canvas rendering code the module already has (widened to accept `OffscreenCanvas`, the same way `rune` did), rather than writing a second, parallel rendering path.

## Scope note

This page documents the *module* side of the convention only. The consumer - a stepper actually reading `RENDER_THUMBNAIL_SYMBOL` off an opaque value and rendering an inline `<img>` - lives in py-slang, is tracked there separately, and is itself gated on the stepper supporting `import` at all. A module that attaches this hook ships with no visible effect on its own until that consumer lands.
