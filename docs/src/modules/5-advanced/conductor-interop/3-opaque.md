---
title: 'DataType.OPAQUE: Where Recursion Stops'
---

# `DataType.OPAQUE`: where recursion stops

`DataType.OPAQUE` is the one place an evaluator's conversion code should **not** try to interpret a value further. Once something is wrapped opaque, it's handed back out exactly as given — no recursive conversion, no float-narrowing, nothing. This is what makes it safe for a bundle to store an arbitrary cadet-supplied value (a number, a string, another data structure, or a genuinely non-representable JS object) without needing to know or care what it is.

Note that this doesn't create an exception to the ["numbers are always floats"](./1-numbers) rule — a number is converted to a float *before* it's wrapped opaque (or before it's read back out of one), not after. `OPAQUE` is a boundary for *structural* recursion, not an escape hatch from the numeric contract.

## Summary: the module-facing primitives

Per Martin, the module interface should be thought of as offering only:

- **numbers** (always floats)
- **functions** (untyped — no declared parameter/return types beyond "it's a function")
- **arrays** (untyped, recursive — includes what SICPy/CS1101S chapter 2 calls "pairs", see [Pairs and arrays are the same thing](./2-pairs-and-arrays))
- **null** (Python's `None`)
- **true/false** (booleans)

Two more exist in practice and are worth naming even though they weren't part of the original five:

- **strings** (`DataType.CONST_STRING`) — real and load-bearing (e.g. `midi`'s note names, accidentals).
- **`DataType.OPAQUE`** — for a value that isn't decomposable into the above at all (a JS object a bundle wants to hand back to the cadet as an inert handle — `rune`'s graphics objects, `binary_tree`'s stored payload, etc.), or where the module simply doesn't want the evaluator trying to interpret it.

> [!NOTE] Complex numbers
> Complex numbers are explicitly **not** supported crossing a module boundary. This is really an aside specific to Python — of the languages Conductor currently supports, only Python has complex numbers as a primitive at all.
