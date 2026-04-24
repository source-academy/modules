# Twoslash

Twoslash is the plugin that helps to provide type information inside of Typescript code blocks. Twoslash's
reference documentation can be found [here](https://twoslash.netlify.app)

The plugin enables type information to be shown when the user hovers over an identifier and even
display pop-outs that highlight a given identifier:

```ts twoslash
declare const page_count: number;
// ---cut---
export function get_current_page(n: number) {
  return page_count + 1;
};

const y = get_current_page(2);
//    ^?

console.log(y);
```

To use twoslash, simply add it to the code block's language specifier:

````md {1}
```ts twoslash

```
````

Then, within the code block, you can use twoslash's notations to do the magic. For example,
the actual code for the first code block looks like this:

````md
```ts twoslash
declare const page_count: number;
// ---cut---
export function get_current_page(n: number) {
  return page_count + 1;
};

const y = get_current_page(2);
//    ^?

console.log(y);
```
````

Twoslash can also be used with TSX. You will need to include the `jsx` configuration option, since
Typescript doesn't set that by default:

````md {2}
```tsx twoslash
// @jsx: react-jsx
function Component(props: {}) {
  return <p>Text</p>;
}
```
````

## Twoslash with Imports

You can import any package that is resolvable by Typescript. For example, if we wanted to display the features of `defineTab` from `modules-lib`,
we can import it using the package name:

````md
```ts twoslash
import { defineTab } from '@sourceacademy/modules-lib/tabs/utils';
```
````

which renders all of `defineTab`'s documentation and type information:

```ts twoslash
// @noErrors: 2345
import { defineTab } from '@sourceacademy/modules-lib/tabs/utils';
//         ^?






export default defineTab({ });
```

## Twoslash with Multiple files

Unfortunately, Twoslash isn't directly compatible with Vitepress's [code groups](https://vitepress.dev/guide/markdown#code-groups), so
you'll have to write the boilerplate for each file separately. For example, consider the code group below:

::: code-group
```ts [functions.ts]
export function foo(): number {
  return 0;
}
```

```ts [index.ts]
import { foo } from './functions';

export function bar() {
  return foo() + 1;
}
```
:::

The raw markdown for this code group looks like this:

````md
::: code-group
```ts [functions.ts]
export function foo(): number {
  return 0;
}
```

```ts [index.ts]
import { foo } from './functions';

export function bar() {
  return foo() + 1;
}
```
:::
````

To get this to work with Twoslash, we need to let Twoslash know the contents of `functions.ts` inside of `index.ts`.
We do this using the `// @filename` directive:

````md
```ts twoslash [index.ts]
// @filename: functions.ts
export function foo(): number {
  return 0;
}
// @filename: index.ts
// ---cut---
import { foo } from './functions';

export function bar() {
  return foo() + 1;
}
```
````

The `// ---cut---` directive hides all the code above it, thus only displaying the code that is actually supposed
to be inside `index.ts`. The final markdown looks like this:


````md
::: code-group
```ts twoslash [functions.ts]
export function foo(): number {
  return 0;
}
```

```ts twoslash [index.ts]
// @filename: functions.ts
export function foo(): number {
  return 0;
}
// @filename: index.ts
// ---cut---
import { foo } from './functions';

export function bar() {
  return foo() + 1;
}
```
:::
````

which then results in:

::: code-group
```ts twoslash [functions.ts]
export function foo(): number {
  return 0;
}
```

```ts twoslash [index.ts]
// @filename: functions.ts
export function foo(): number {
  return 0;
}
// @filename: index.ts
// ---cut---
import { foo } from './functions';

export function bar() {
  return foo() + 1;
}
```
:::
