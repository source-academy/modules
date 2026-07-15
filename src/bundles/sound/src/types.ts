/**
 * A wave is a function that takes in a number `t` and returns a number representing the
 * amplitude at time `t`. The amplitude should fall within the range of [-1, 1].
 *
 * Generator-based (not plain async) because a wave may wrap a user-supplied Conductor closure
 * (see `make_sound`), which can only be invoked through `evaluator.closure_call_unchecked` -
 * itself an AsyncGenerator, since it drives the evaluator's CSE machine step by step. Calling it
 * with `yield*` (rather than draining it to a Promise) properly threads those steps through to
 * whatever's driving the top-level generator, preserving stepping/breakpoint visibility into a
 * student's own wave function and avoiding a tight synchronous loop over its steps. Waves built
 * entirely from module-native math (the oscillators, envelopes, and instruments below) are still
 * plain generator functions, they simply never yield.
 */
export type Wave = (t: number) => AsyncGenerator<void, number, undefined>;

/**
 * A Sound is `[wave, duration]`, where duration is the length of the sound in seconds. This is
 * the pure, evaluator-free internal representation used throughout functions.ts; the
 * Conductor-facing plugin in index.ts converts to/from the equivalent Conductor PAIR
 * (`[TypedValue<CLOSURE>, TypedValue<NUMBER>]`) at the boundary.
 */
export interface Sound {
  wave: Wave;
  duration: number;
}

export type SoundProducer = (freq: number, duration: number) => Sound;
export type SoundTransformer = (s: Sound) => Sound;
