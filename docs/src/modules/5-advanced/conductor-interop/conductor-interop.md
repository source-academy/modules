---
title: Conductor Module Interface Design
---

# Conductor Module Interface Design

This section records *why* the Conductor module interface (the `IDataHandler`/`TypedValue<DataType>` protocol between an evaluator and a module) is shaped the way it is - as distinct from the [Bundle Conventions](../../2-bundle/4-conventions/) section, which covers *how* to actually write bundle code against it.

Most of these decisions came out of a design discussion between Martin Henz and the py-slang team while fixing [py-slang#307](https://github.com/source-academy/py-slang/pull/307). The short version, if you only read one line: **keep it simple on the module side**. A module should never have to think about integers vs floats, or pairs vs arrays, as distinct concepts - the evaluator (py-slang, js-slang, ...) is responsible for presenting a clean, minimal interface, and a module just consumes it.

- [Numbers are always floats](./1-numbers)
- [Pairs and arrays are the same thing](./2-pairs-and-arrays)
- [`DataType.OPAQUE`: where recursion stops](./3-opaque)
- [The `binary_tree` exception](./4-binary-tree-exception)
- [`closure_call_sync`: an optional fast path for hot callback loops](./5-closure-call-sync)
