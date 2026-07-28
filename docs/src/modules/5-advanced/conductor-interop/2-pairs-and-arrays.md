---
title: Pairs and Arrays Are the Same Thing
---

# Pairs and arrays: there is no "pair" type

> "there is nothing called a pair anymore. Pairs are just arrays of length 2." — Martin Henz

Conductor's `DataType.PAIR` still exists at the protocol level as of this writing (`pair_make`/`pair_head`/`pair_tail`/`pair_assert` are real `IDataHandler` methods, and plenty of already-migrated bundles call them), but it is **not a separate concept from `DataType.ARRAY`** as far as an evaluator's own conversion layer is concerned. The only places "pair" survives as a distinct idea at all:

- The *name* of Python builtins (`pair()`, `is_pair()`, etc.) — a chapter-2/SICPy vocabulary choice, not a protocol-level distinction. (In Python §2/SICPy/CS1101S Unit 2, "pair" is the name given to a 2-element Python list, precisely because Python lists as a general concept aren't introduced until §3/Unit 3.)
- Chapter 1-2 error-message wording ("expected pair", not "expected list") — purely cosmetic, the same value either way.

::: warning DataType.PAIR is on track for full removal from py-slang
On the PR that settled this ([py-slang#307](https://github.com/source-academy/py-slang/pull/307)), Martin went further than "treat them as interchangeable":

> "We still have DataType.PAIR in the code base. I suggest we remove the datatype entirely from py-slang. [...] I don't see value in DataType.PAIR in py-slang. It just leads to confusion. Implementers will ask: what is the difference between a PAIR and an ARRAY with two elements?"

A follow-up PR has been claimed to actually remove `DataType.PAIR` from py-slang's own code, rather than merely bridging both representations the way [py-slang#307](https://github.com/source-academy/py-slang/pull/307) currently does. Once that lands, py-slang will never construct or expect a `DataType.PAIR` value itself — a bundle that still calls `pair_make`/`pair_head`/`pair_tail` internally should keep working (module implementers remain free to define their own `head`/`tail`-style functions), but should not expect py-slang's *own* engines to ever hand it something tagged `DataType.PAIR`.
:::

Until that follow-up lands, everywhere in py-slang's own conversion code, a pair *is* treated as a 2-element array, interchangeably:

- A `DataType.ARRAY`-tagged value can be read via `pair_head`/`pair_tail` (reading index 0/1) exactly as a genuine `DataType.PAIR` can — bundle code that calls these for clarity keeps working unchanged, whichever representation the value actually carries at runtime.
- The generic list helpers (`is_list`/`list_to_vec`/`length`/`accumulate`) accept both a `DataType.PAIR`/`EMPTY_LIST` chain and a flat `DataType.ARRAY` — a bundle that only ever calls these needs no changes at all.
- An evaluator's Python-list-literal-to-module conversion builds a flat `DataType.ARRAY` for **any** Python list, regardless of length — including length 2, and including an empty list (which becomes a genuine 0-length array, not `EMPTY_LIST` — see the warning below on why that distinction matters). There is no length-based special case, and no need to track "was this value a genuine list literal, or the result of `pair()`/`llist()`, or a module value round-tripped back through the language" the way earlier code did.

## Untyped and recursive

`DataType.ARRAY` should be treated as **untyped** by the evaluator's own conversion code: don't gate behavior on what an array claims its element type is. An array can be heterogeneous — `sound`'s `Sound` is exactly `(wave, duration)`, a 2-element pair whose first element is a function and second is a number, and there's no reason an evaluator's generic array-handling code should assume otherwise. Convert recursively, element by element, with no assumptions about homogeneity.

## The bug this was fixing

Before this, py-slang's Python-list-to-module conversion built a linked `PAIR`/`EMPTY_LIST` chain for a list literal, and used a same-length ambiguity heuristic (was this value tagged as "a genuine list literal" at construction time, or not?) to decide whether a 2-element value should become a proper terminated chain or a raw dotted pair. That heuristic is fundamentally unreliable once a value round-trips out to the language and back in: a generic, untyped module function (one with no declared `LIST`/`ARRAY` parameter type to hint at the right shape — e.g. `repeat`'s `identity`/`composition`, which just relay whatever they're given) had no way to distinguish the two cases either, and `identity([0])` printed `[0.0, None]` instead of `[0.0]` — an extra `None` from the chain terminator being misread as a real list element.

Building every Python list as a flat `ARRAY` (rather than ever building a `PAIR` chain for one) removes the ambiguity at the source: an array's length is explicit, never inferred by walking a chain to a terminator, so there's nothing left to misread.

> [!WARNING] Empty list vs None
> `DataType.EMPTY_LIST` is *also* what a module function's `None`/void return maps to (see [Numbers are always floats](./1-numbers)'s neighbouring cases, or any engine's `moduleToPython`). An empty Python list must **not** become `EMPTY_LIST` on the way into a module — that makes `[]` and `None` indistinguishable on the way back out. It should become a genuine 0-length `DataType.ARRAY` instead, exactly like any other length. This was caught by live testing after an initial version of the fix got this wrong (see the "was `None`, now `[]`" regression tests in py-slang's `pvml-modules.test.ts`).
