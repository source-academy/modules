/**
 * The module's own record for a single opaque image handle - registered as an OPAQUE's stored
 * value via `evaluator.opaque_make(meta)` (so the general/async path, e.g. `get_pixel_value`'s
 * fallback body, can `await evaluator.opaque_get(handle)` to get this same object back), and
 * mirrored into `PixNFlixModulePlugin`'s own synchronously-readable buffer map, keyed by the
 * handle's identifier - `evaluator.opaque_get` is `async` (see `GenericDataHandler`), so it can't
 * be used from `get_pixel_value`/`set_pixel_value`'s `.sync` twin, which is exactly the fast path
 * this module exists to provide.
 */
export interface ImageBuffer {
  /** RGBA, `width * height * 4` bytes - the same layout `ImageData.data` uses. */
  view: Uint8ClampedArray;
  width: number;
  height: number;
}
