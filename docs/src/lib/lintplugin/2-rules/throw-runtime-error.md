# `throw-runtime-error`

This rule is similar to ESLint's [`no-throw-literal`](https://eslint.org/docs/latest/rules/no-throw-literal) and Typescript ESLint's [`only-throw-error`](https://typescript-eslint.io/rules/only-throw-error/) to
enforce that errors thrown by bundles must be assignable to the `RuntimeSourceError` type exported by `js-slang`.

The rule allows you to configure a set of ignored names, as well as to ignore rethrown variables:

```ts
interface RuleOptions {
  ignoredNames?: string[];
  allowRethrow?: boolean;
}
```

## ✅ Examples of **correct** code for this rule

Directly throwing a `GeneralRuntimeError` or `InternalRuntimeError` is fine:

```ts
import { GeneralRuntimeError } from 'js-slang/dist/errors/base';

function foo() {
  throw new GeneralRuntimeError();
}
```

Re-exports are also considered valid:

```ts
// modules-lib re-exports the error from js-slang
import { GeneralRuntimeError } from '@sourceacademy/modules-lib/errors';

function foo() {
  throw new GeneralRuntimeError();
}
```

Custom error types that inherit from `RuntimeSourceError` are valid:

```ts
// modules-lib re-exports the error from js-slang
import { RuntimeSourceError } from '@sourceacademy/modules-lib/errors';

class NewError extends RuntimeSourceError {}

function foo() {
  throw new NewError();
}
```

## ❌ Examples of **incorrect** code for this rule

The rule will highlight throwing any one of the builtin `Error` types or any other type that doesn't
inherit from `RuntimeSourceError`:

```js
throw new Error();
throw new TypeError();
```

## ✅ Examples of **correct** code for this rule with <nobr><code>allowRethrow: true</code></nobr>

If you set `allowRethrow` to `true`, then the rule will avoid highlighting when you rethrow
the error caught in a catch clause:

```js
try {
  doWork();
} catch (error) {
  // do things
  throw error;
}
```

## ✅ Examples of **correct** code for this rule with <nobr><code>ignoredNames</code></nobr>

Where possible, errors thrown by bundles should inherit from `RuntimeSourceError`. If an exception is really needed,
the rule can be configured to ignore specific names:

```ts
// '@sourceacademy/throw-runtime-error': ['error', { ignoredNaemes: ['typeError' ] }]
function foo() {
  throw new TypeError();
}
```
