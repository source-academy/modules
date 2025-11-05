# Miscellanous Information

[[toc]]

## Object/Exports Identity

Consider the following bundle:

> [!INFO] TL;DR
> `js-slang` doesn't guarantee that objects exported by bundles reference the same objects defined in the bundle
> when loaded from Source.

```ts [bundle.ts]
export function foo() { return 0; }

export function bar() { return 1; }
```

Now consider a tab that wants to display something to the user depending on what function
the user passed to the tab:

```tsx [tab.tsx] {9,11}
import { foo, bar } from '@sourceacademy/modules-bundle0';

interface Props {
  func: () => number;
}

export function Tab({ func }: Props) {
  if (func === foo) {
    return <p>Foo was selected!</p>;
  } else if (func === bar) {
    return <p>Bar was selected!</p>;
  } else {
    return <p>Nothing was selected!</p>;
  }
}
```

Notice that the two comparisons (the two highlighted lines) use `===`. In Javascript, functions are compared by reference equality.

Unfortunately, `js-slang` does not guarantee this kind of object identity stability during bundle loading, so these two
comparisons might fail even if the cadet provides the `foo` or `bar` function.

A workaround for this would be to attach a symbol to your object:

```ts
export const fooSymbol = Symbol('foo');
export function foo() { return 0; }
foo[fooSymbol] = true;

export const barSymbol = Symbol('bar');
export function bar() { return 0; }
bar[barSymbol] = true;
```

and then check for the symbol on the object:

```tsx
import { foo, fooSymbol, bar, barSymbol } from '@sourceacademy/modules-bundle0';

interface Props {
  func: () => number;
}

export function Tab({ func }: Props) {
  if (fooSymbol in func) {
    return <p>Foo was selected!</p>;
  } else if (barSymbol in func) {
    return <p>Bar was selected!</p>;
  } else {
    return <p>Nothing was selected!</p>;
  }
}
```

`js-slang` will ensure that all of these properties are preserved.

> [!IMPORTANT]
> Notice that the check is being done on the value passed into the tab via its props and _NOT_ on the
> `foo` and `bar` imports which are imported from the bundle directly.
>
> This identity problem only affects exports when they are loaded via Source and not when they are
> accessed directly from Javascript.
