/**
 * Symbol key for the stepper-thumbnail rendering hook. A module whose opaque
 * values are worth previewing (e.g. `rune`'s `Rune` instances) may attach a
 * zero-argument function under this key to the object it passes to
 * `opaque_make`:
 *
 * ```ts
 * Object.defineProperty(value, RENDER_THUMBNAIL_SYMBOL, {
 *   value: () => renderToDataUrl(value),
 *   enumerable: false,
 *   configurable: true
 * });
 * ```
 *
 * The hook must never throw. It resolves to a data URL string, or to
 * `undefined` if a render attempt fails at call time - callers must handle
 * both. It should simply be omitted (not attached at all) when rendering
 * isn't possible in the current realm - a consumer (e.g. a stepper) that
 * doesn't find this key, or gets `undefined` back from it, falls back to a
 * plain placeholder, so there is no wrong answer here beyond attaching a
 * hook that throws.
 *
 * `Symbol.for` (a global-registry symbol) is used deliberately so that
 * modules and consumers in different packages/repos share the same key
 * without importing from each other - only the string below is the actual
 * cross-repo contract.
 */
export const RENDER_THUMBNAIL_SYMBOL = Symbol.for('source-academy.stepper.renderThumbnail');
