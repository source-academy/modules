---
title: 'closure_call_sync: An Optional Fast Path for Hot Callback Loops'
---

# `closure_call_sync`: an optional fast path for hot callback loops

Conductor's own `ExternCallable` contract requires a closure call to be an `AsyncGenerator` - not a choice either an evaluator or a bundle gets to make, since a call might genuinely need to suspend on a channel round-trip to the frontend. `IDataHandler.closure_call`/`closure_call_unchecked` are shaped around that: a bundle `yield*`s through them, which is also what preserves cadet-code stepping/breakpoint visibility when the closure being called is cadet-authored.

That's the right default, but it isn't free. Even when a call never actually needs to suspend, entering an async generator, wrapping arguments, and awaiting the result costs real, measurable time relative to a plain call - overhead that has nothing to do with any genuine cross-boundary work. It's negligible for a one-off call. It stops being negligible when a bundle calls a cadet-supplied closure at high frequency - the motivating case is `sound`'s `play()`, which samples a cadet-authored wave function up to 44100 times per second of audio.

## The escape hatch

`IDataHandler.closure_call_sync` is an **optional** method: a bundle checks for its presence at runtime and falls back to the async path if it's missing, rather than assuming any particular evaluator has it. `sound`'s `closureToWave` (in `index.ts`) is the reference implementation of this pattern - it builds the async `Wave` unconditionally, then separately checks whether `evaluator.closure_call_sync` exists and, only if so, attaches a matching synchronous `.sync` method alongside it. Callers that know how to use the fast path (`sound`'s own sample loop) check for `.sync` the same way and use it when present; everything else keeps working through the async path unchanged.

Only **py-slang's py2js engine** implements `closure_call_sync` today (PVML and CSE don't have it yet) - via a closure that's been dual-compiled into a synchronous and an asynchronous body sharing one closure environment, so whichever side of the boundary picks the function up gets the body it needs. A closure with no synchronous twin, or one whose arguments/result fall outside the sync path's restricted scalar coverage, makes `closure_call_sync` return `undefined` (the "no fast path, use `closure_call_unchecked` instead" signal) rather than guessing.

**Don't assume `closure_call_sync` exists, and don't assume it doesn't.** A module has to check for it explicitly every time, not cache the result by evaluator type - a currently-async-only engine (CSE, PVML) could gain the method later, and a specific closure on a supporting engine can still decline (return `undefined`) if it's outside the sync path's coverage.

## Attach `.sync` liberally, not selectively

Once a closure your bundle hands back to cadet code is provably synchronous - built purely from your own bundle's math, no real host round-trip involved - attach a `.sync` twin to it. Do this for every such closure, not just the ones you expect to be sampled in a hot loop by your own bundle's functions.

The reason: once a closure is in the cadet's hands, your bundle has no say over where it goes next. It can be passed straight into a *different* module's own synchronous sampling loop, closed over by a cadet-authored combinator, or otherwise re-entered from code your bundle never sees. `sound`'s own `closureToWave` (see `modules`#833's fix) has to defend against exactly this: a cadet-authored closure whose compiled synchronous body itself calls a different module's closure can throw partway through a sync probe instead of failing cleanly, if that inner call turns out to need a real round-trip. The safest way to keep that kind of composition working (and fast) is to make sure any closure that *can* go fully synchronous, does - not to guess at which caller will end up needing it.

Reserve the `AsyncGenerator`-only path for closures that genuinely need a real host round-trip - actual I/O, a real async browser API, anything that might have to suspend. Those can't have a meaningful `.sync` twin, and that's correct, permanent behavior for them, not a gap to close.

## Why this matters enough to have an escape hatch

Numbers from py-slang's `experiments/py2js` benchmarks (not load-bearing for correctness, just the reasoning that motivated this design - see py-slang's own experiment README for methodology and full results if these ever need re-validating):

- Calling convention alone, isolated from any real work: a plain synchronous call runs in the tens of nanoseconds; the mandatory async-generator shape costs on the order of 20× that, purely in allocation and microtask scheduling.
- On the actual sound-module scenario (441 000 wave callbacks, 10s of audio): a synchronous fast path landed within a few percent of a pure-synchronous reference build, while forcing every sample through the async path cost roughly 3× as long per callback.
- Across general execution (not just closure calls), py-slang's compiled py2js engine measured one to two orders of magnitude faster than the CSE machine and PVML interpreter on the same workloads - PVML and CSE track each other fairly closely, since PVML's per-instruction interpretation loop and CSE's control/stash step loop pay similar per-step overhead.

None of this changes what a module *has* to do (the async path is always correct, and is the only option on engines without a sync path) - it only explains why a hot per-sample loop is worth the extra branch to check for `closure_call_sync`, and why that check has to be a runtime capability check rather than an assumption baked in per engine.
