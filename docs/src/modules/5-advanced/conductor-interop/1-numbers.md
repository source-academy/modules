---
title: Numbers Are Always Floats
---

# Numbers: always floats, no exceptions

> "numerical values coming from modules (including from functions that are passed to/from modules) are always floats. Values passed to modules (including to functions that are passed to/from modules) can be floats and ints; ints are silently converted to floats." — Martin Henz

Concretely:

- A module's `DataType.NUMBER`-declared parameter always receives a JS `number` (a float), never a `bigint`, even if the cadet passed a Python `int` literal. The evaluator converts it before the module ever sees it.
- A module's `DataType.NUMBER`-declared return value is likewise always treated as a float on the way back out.
- This holds **regardless of where the number is** — a bare scalar argument, an element inside a list, or a value stored via `DataType.OPAQUE` and handed back out later. There is no per-position exception.

## Why "1.0 instead of 1" is a feature, not a bug

`binary_tree`'s `entry()` on a tree built with `make_tree(1, ...)` prints `1.0`, not `1`, in every evaluator. It's tempting to see this as something to fix — an earlier iteration of py-slang's work did exactly that, teaching the evaluator to tag Python ints distinctly and round-trip them through modules unchanged. Martin's final call reversed this:

> "'would print 1.0, not 1' is a feature, not a bug. We should keep integers out of modules."

The reasoning is practical, not aesthetic:

- **Simplicity.** A module never needs an "is this an int or a float?" branch anywhere in its own code.
- **Performance.** If modules had to support real integers, module code (all plain JS/TS) would have no choice but to use `bigint` arithmetic wherever a value *might* be an int — and `bigint` arithmetic is meaningfully slower than `number` arithmetic. Supporting a rare case (a module caring about integer-vs-float) would tax the common case (every numeric computation a module does).
- **Portability.** py-slang isn't the only evaluator a bundle talks to, and future evaluators for other languages may have no `bigint`-equivalent primitive at all. An interface contract that only ever promises "a float" works for all of them; one that promises "sometimes a real distinct integer type" doesn't.

If you're writing a bundle and want a value to visibly stay an integer across a module round-trip, that's not something to build — the interface deliberately doesn't offer it.

::: details Follow-up: full removal of DataType.PAIR
While reviewing the PR that settled this, Martin also flagged that `DataType.PAIR` shouldn't exist in py-slang at all going forward (see [Pairs and arrays are the same thing](./2-pairs-and-arrays)) - a follow-up PR has been claimed to remove it entirely, rather than just treat it as interchangeable with `DataType.ARRAY`.
:::
