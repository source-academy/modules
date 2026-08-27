# `region-comment`

This rule enforces that each `// #region` comment is named and paired with a corresponding `// #endregion` comment.

## ✅ Examples of **correct** code for this rule

```ts
// #region Region1
export function foo() {}
// #endregion Region1
```

Regions can overlap:

```ts
// #region Region1
// #region Region2
export function foo() {}
// #endregion Region2
// #endregion Region1
```

## ❌ Examples of **incorrect** code for this rule

```ts
// Missing name for region
// #region
export function foo() {}
// #endregion

// Missing #region tag
export function bar() {}
// #endregion 1
```
