# Modules Overview
This page contains information regarding the overview of the Source Modules system. If you want to skip this overview, navigate to the bottom of the page
where the **next page** button is located.

## Terminology

The module system imitates ESM Javascript, allowing the use of `import` statements to import external code into Source programs:

```ts
import { draw_connected } from 'curve';
```
> [!NOTE]
> If you're familiar with the Javascript ecosystem, you may know that there are other module formats that are in common use. Source Modules are written in the ECMAScript _(ESM)_ format (i.e using `import` and `export`). However, there are limitations. For example, top-level await is not supported.

These are the 3 main terms the project will be using to refer to the individual components of the Source Modules system. Please follow the set of definitions below to avoid any inconsistencies. 
| **Term**   | **Description**                                                    | **Links**        |
| ---------- | ------------------------------------------------------------------ | ---------------- |
| **Module** | A set of **one** bundle and **zero or more** tabs.                 |                  |
| **Bundle** | The suite of functions that are provided by the module.            | [Docs](../2-bundle/1-overview) |
| **Tab**    | A user interface used by the module.                               | [Docs](../3-tabs/1-overview)   |

## Aims

1. Decouple Source modules from the frontend and backend of Source Academy, as well as the implementation of Source language, enhancing the flexibility of Source modules.
2. Optionally render interactive user interfaces for students to use with Source Academy to enhance their learning experience.
3. Allow ease of collaboration and promotes contribution to the modules ecosystem without a steep learning curve. 

## Motivation

The project was suggested by Professor Martin Henz who first proposed to include import statements in the Source Language in the `js-slang` issue [here](https://github.com/source-academy/js-slang/issues/399). This move aims to achieve 3 main things: 
1. To demystify module loading for students. Source would be in line with other programming languages where imported functionality is explicitly named in programs. 
2. To simplify the Source Academy user interface. There will no longer be a need for a “library” menu.
3. To simplify Source implementation tools. Imported names will all be explicitly mentioned in the Source program.

> I'm proposing to allow the following syntax in Source:
> ```txt
> program         ::= importdirective... statement...
> importdirective ::= import { importnames } from string;
> importnames     ::= importname (, importname)...
> importname      ::= name | name as name
> ```
>
> This means that we will explicitly import modules (libraries) from now on, in order to use them:
> ```ts
> import { heart as lung, sail, show as view, stack } from 'lib/runes';
> 
> view(stack(lung, sail));
> ```
> 
> For Source 2021, the path will be resolved to: https://github.com/source-academy/modules/tree/master/ This means that `from 'lib/runes'` refers to https://github.com/source-academy/modules/tree/master/lib/runes.js (the default file extension will be `.js`)
> 
> The Source Academy frontend will fetch the module from the backend, which of course will cache it. Our modules can still be written in JavaScript and loaded in the frontend in whatever way works (e.g. `eval`).
> 
> In the future, we can allow for a more flexible scheme where users can import Source programs using the same syntax.
