/** A wave sampled directly, with no generator/Promise indirection at all - see `Wave.sync`. */
export type SyncWave = (t: number) => number;

/**
 * A wave is a function that takes in a number `t` and returns a number representing the
 * amplitude at time `t`. The amplitude should fall within the range of [-1, 1].
 *
 * Generator-based (not plain async) because a wave may wrap a user-supplied Conductor closure
 * (see `make_sound`), which can only be invoked through `evaluator.closure_call_unchecked` -
 * itself an AsyncGenerator, since it drives the evaluator's CSE machine step by step. Calling it
 * with `yield*` (rather than draining it to a Promise) properly threads those steps through to
 * whatever's driving the top-level generator, preserving stepping/breakpoint visibility into a
 * student's own wave function and avoiding a tight synchronous loop over its steps.
 *
 * Waves built entirely from module-native math (the oscillators, envelopes, and instruments
 * below) never actually yield - the generator wrapper above is real overhead for them (every
 * `AsyncGenerator#next()` resolves via microtask no matter how trivial the body is, and sampling a
 * multi-second Sound calls a wave ~44100 times per second of audio). Such a wave additionally
 * exposes `sync`: the exact same computation as a plain, synchronous, Promise-free function.
 * `sampleWave` (and every combinator that builds a new Wave out of existing ones) uses `sync` when
 * every wave involved has one, and falls back to the generator path the moment a user-supplied
 * closure (via `closureToWave` in index.ts, which never sets `sync`) is anywhere in the mix -
 * so correctness for student-authored waves is unaffected; only module-native ones get faster.
 */
export type Wave = {
  (t: number): AsyncGenerator<void, number, undefined>;
  readonly sync?: SyncWave;
};

/**
 * A Sound is always stereo internally: `[[left_wave, right_wave], duration]`, where duration is
 * the length of the sound in seconds. "Mono" isn't a separate type - it's just the common case,
 * produced by `make_sound`, where `leftWave` and `rightWave` have the same behavior:
 * `leftWave(t) == rightWave(t)` for all `t`. This is the pure, evaluator-free internal
 * representation used throughout functions.ts; the Conductor-facing plugin in index.ts converts
 * to/from the equivalent Conductor PAIR (`[[TypedValue<CLOSURE>, TypedValue<CLOSURE>],
 * TypedValue<NUMBER>]`) at the boundary.
 */
export interface Sound {
  leftWave: Wave;
  rightWave: Wave;
  duration: number;
}

export type SoundProducer = (freq: number, duration: number) => Sound;
export type SoundTransformer = (s: Sound) => Sound;
