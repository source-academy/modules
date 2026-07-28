---
title: The binary_tree Exception
---

# The `binary_tree` exception

`binary_tree` is a deliberate, narrow exception to the ["pairs and arrays are the same thing"](./2-pairs-and-arrays) rule, and worth calling out explicitly so nobody "fixes" it into consistency with everything else by accident:

- It's small enough to be considered a toy/test module — if it ever needs meaningfully different behavior, it's easier to just rewrite than to carefully migrate.
- Its `is_tree`/`is_empty_tree`/`assertNonEmptyTree` internals read a tree node's own `DataType` tag directly (`value.type !== DataType.PAIR`) rather than going through a generic helper — this is exactly the kind of hardcoded check the "pairs and arrays are interchangeable" rule says to avoid, and it needed a real code change once py-slang stopped ever producing a `PAIR` chain for a round-tripped tree value (see [source-academy/modules#813](https://github.com/source-academy/modules/pull/813)).

The actual bug this caused: `t = make_tree(1, make_empty_tree(), make_empty_tree())` builds a real `PAIR` structure and hands it back out to Python (converted to a native Python list). Calling `entry(t)` afterward requires `t` to convert *back* into a module value — and once a Python list always becomes a flat `DataType.ARRAY`, `binary_tree`'s hardcoded `value.type !== DataType.PAIR` check rejected it outright, on the very first call after construction, not just on nested trees as originally assumed.

The fix ([source-academy/modules#813](https://github.com/source-academy/modules/pull/813)) accepts `DataType.ARRAY` as equally valid to `DataType.PAIR` wherever a tree node's own tag is checked, without touching `make_tree`'s own construction (`pair_make` calls) — only the *validation* of an incoming, possibly round-tripped value needed to widen.

If you're writing a new bundle with tree- or pair-chain-shaped data, prefer going through the generic helpers (`pair_head`/`pair_tail`/`list_to_vec`/etc.) rather than checking `.type` directly, precisely so you don't inherit this same fragility.
