---
title: Conductor Module Interface Conventions
outline: [2, 3]
---

# Conductor Module Interface Conventions

This page records design decisions made while migrating bundles to Conductor (the `IDataHandler`/`TypedValue<DataType>` protocol between an evaluator and a module), specifically around numbers, pairs/arrays, and opaque values. These came out of a design discussion between Martin Henz and the py-slang team while fixing [py-slang#307](https://github.com/source-academy/py-slang/pull/307), and apply to every bundle, not just the Python evaluators.

The short version: **keep it simple on the module side**. A module should never have to think about integers vs floats, or pairs vs arrays, as distinct concepts. The evaluator (py-slang, js-slang, ...) is responsible for presenting a clean, minimal interface; a module just consumes it.

## Numbers: always floats, no exceptions

> "numerical values coming from modules (including from functions that are passed to/from modules) are always floats. Values passed to modules (including to functions that are passed to/from modules) can be floats and ints; ints are silently converted to floats." — Martin Henz

Concretely:

- A module's `DataType.NUMBER`-declared parameter always receives a JS `number` (a float), never a `bigint`, even if the cadet passed a Python `int` literal. The evaluator converts it before the module ever sees it.
- A module's `DataType.NUMBER`-declared return value is likewise always treated as a float on the way back out.
- This holds **regardless of where the number is** — a bare scalar argument, an element inside a list, or a value stored via `DataType.OPAQUE` and handed back out later. There is no per-position exception.

### Why this "1.0 instead of 1" is a feature, not a bug

`binary_tree`'s `entry()` on a tree built with `make_tree(1, ...)` prints `1.0`, not `1`, in every evaluator. It's tempting to see this as something to fix — an earlier iteration of py-slang's work did exactly that, teaching the evaluator to tag Python ints distinctly and round-trip them through modules unchanged. Martin's final call reversed this:

> "'would print 1.0, not 1' is a feature, not a bug. We should keep integers out of modules."

The reasoning is practical, not aesthetic:

- **Simplicity.** A module never needs a "is this an int or a float?" branch anywhere in its own code.
- **Performance.** If modules had to support real integers, module code (all plain JS/TS) would have no choice but to use `bigint` arithmetic wherever a value *might* be an int — and `bigint` arithmetic is meaningfully slower than `number` arithmetic. Supporting a rare case (a module caring about integer-vs-float) would tax the common case (every numeric computation a module does).
- **Portability.** py-slang isn't the only evaluator a bundle talks to, and future evaluators for other languages may have no `bigint`-equivalent primitive at all. An interface contract that only ever promises "a float" works for all of them; one that promises "sometimes a real distinct integer type" doesn't.

If you're writing a bundle and want a value to visibly stay an integer across a module round-trip, that's not something to build — the interface deliberately doesn't offer it.

## Pairs and arrays: there is no "pair" type

> "there is nothing called a pair anymore. Pairs are just arrays of length 2." — Martin Henz

Conductor's `DataType.PAIR` still exists at the protocol level (`pair_make`/`pair_head`/`pair_tail`/`pair_assert` are real `IDataHandler` methods, and plenty of already-migrated bundles call them), but it is **not a separate concept from `DataType.ARRAY`** as far as an evaluator's own conversion layer is concerned. The only places "pair" survives as a distinct idea at all:

- The *name* of Python builtins (`pair()`, `is_pair()`, etc.) — a chapter-2/SICPy vocabulary choice, not a protocol-level distinction. (In Python §2/SICPy/CS1101S Unit 2, "pair" is the name given to a 2-element Python list, precisely because Python lists as a general concept aren't introduced until §3/Unit 3.)
- Chapter 1-2 error-message wording ("expected pair", not "expected list") — purely cosmetic, the same value either way.

Everywhere else, a pair *is* a 2-element array, and evaluators are expected to treat them interchangeably:

- A `DataType.ARRAY`-tagged value can be read via `pair_head`/`pair_tail` (reading index 0/1) exactly as a genuine `DataType.PAIR` can — bundle code that calls these for clarity keeps working unchanged, whichever representation the value actually carries at runtime.
- The generic list helpers (`is_list`/`list_to_vec`/`length`/`accumulate`) accept both a `DataType.PAIR`/`EMPTY_LIST` chain and a flat `DataType.ARRAY` — a bundle that only ever calls these needs no changes at all.
- An evaluator's Python-list-literal-to-module conversion should build a flat `DataType.ARRAY` for **any** Python list, regardless of length — including length 2. There is no length-based special case, and no need to track "was this value a genuine list literal, or the result of `pair()`/`llist()`, or a module value round-tripped back through the language" the way earlier code did.

### Untyped and recursive

`DataType.ARRAY` should be treated as **untyped** by the evaluator's own conversion code: don't gate behavior on what an array claims its element type is. An array can be heterogeneous — `sound`'s `Sound` is exactly `(wave, duration)`, a 2-element pair whose first element is a function and second is a number, and there's no reason an evaluator's generic array-handling code should assume otherwise. Convert recursively, element by element, with no assumptions about homogeneity.

### The bug this was fixing

Before this, py-slang's Python-list-to-module conversion built a linked `PAIR`/`EMPTY_LIST` chain for a list literal, and used a same-length ambiguity heuristic (was this value tagged as "a genuine list literal" at construction time, or not?) to decide whether a 2-element value should become a proper terminated chain or a raw dotted pair. That heuristic is fundamentally unreliable once a value round-trips out to the language and back in: a generic, untyped module function (one with no declared `LIST`/`ARRAY` parameter type to hint at the right shape — e.g. `repeat`'s `identity`/`composition`, which just relay whatever they're given) had no way to distinguish the two cases either, and `identity([0])` printed `[0.0, None]` instead of `[0.0]` — an extra `None` from the chain terminator being misread as a real list element.

Building every Python list as a flat `ARRAY` (rather than ever building a `PAIR` chain for one) removes the ambiguity at the source: an array's length is explicit, never inferred by walking a chain to a terminator, so there's nothing left to misread.

## `DataType.OPAQUE`: where recursion stops

`DataType.OPAQUE` is the one place an evaluator's conversion code should **not** try to interpret a value further. Once something is wrapped opaque, it's handed back out exactly as given — no recursive conversion, no float-narrowing, nothing. This is what makes it safe for a bundle to store an arbitrary cadet-supplied value (a number, a string, another data structure, or a genuinely non-representable JS object) without needing to know or care what it is.

Note that this doesn't create an exception to the "numbers are always floats" rule above — a number is converted to a float *before* it's wrapped opaque (or before it's read back out of one), not after. `OPAQUE` is a boundary for *structural* recursion, not an escape hatch from the numeric contract.

## The `binary_tree` exception

`binary_tree` is a deliberate, narrow exception to some of the above, and worth calling out explicitly so nobody "fixes" it into consistency with everything else by accident:

- It's small enough to be considered a toy/test module — if it ever needs meaningfully different behavior, it's easier to just rewrite than to carefully migrate.
- Its `is_tree`/`is_empty_tree`/`assertNonEmptyTree` internals read a tree node's own `DataType` tag directly (`value.type !== DataType.PAIR`) rather than going through a generic helper — this is exactly the kind of hardcoded check the "pairs and arrays are interchangeable" section above says to avoid, and it needed a real code change (accepting `DataType.ARRAY` as equally valid to `DataType.PAIR`) once py-slang stopped ever producing a `PAIR` chain for a round-tripped tree value.

If you're writing a new bundle with tree- or pair-chain-shaped data, prefer going through the generic helpers (`pair_head`/`pair_tail`/`list_to_vec`/etc.) rather than checking `.type` directly, precisely so you don't inherit this same fragility.

## Summary: the five module-facing primitives

Per Martin, the module interface should be thought of as offering only:

- **numbers** (always floats)
- **functions** (untyped — no declared parameter/return types beyond "it's a function")
- **arrays** (untyped, recursive — includes what SICPy/CS1101S chapter 2 calls "pairs")
- **null** (Python's `None`)
- **true/false** (booleans)

Two more exist in practice and are worth naming even though they weren't part of the original five:

- **strings** (`DataType.CONST_STRING`) — real and load-bearing (e.g. `midi`'s note names, accidentals).
- **`DataType.OPAQUE`** — for a value that isn't decomposable into the above at all (a JS object a bundle wants to hand back to the cadet as an inert handle — `rune`'s graphics objects, `binary_tree`'s stored payload, etc.), or where the module simply doesn't want the evaluator trying to interpret it.

Complex numbers are explicitly **not** supported crossing a module boundary.
