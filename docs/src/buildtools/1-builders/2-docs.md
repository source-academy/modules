# Documentation Generation

There are two types of documentation used by Source, which are the jsons and the HTML documentation. Both are built using the [`typedoc`](typedoc.org) tool. By reading comments and type annotations, `typedoc` is able to generate both human readable documentation and documentation in the form of JSON.

## Typedoc Overview
Typedoc has been configured to use the [`package` entry point strategy](https://typedoc.org/documents/Options.Input.html#packages). To make sure that each bundle's documentation is generated with the proper name, each bundle's `tsconfig.json` contains
a `typedocOptions` section which minimally, has the name of the bundle. Using the `package` strategy allows each bundle to customize its own `typedoc` options this way.

Typedoc is initialized with the following options:

<<< ../../../../lib/buildtools/src/build/docs/docsUtils.ts#commonOpts

The package options are applied to each bundle, while the common options are used overall.

Initializing `typedoc` returns an [`Application`](https://typedoc.org/api/classes/Application.html) object, which can then be used to generate a [`ProjectReflection`](https://typedoc.org/api/classes/Models.ProjectReflection.html). The reflection always contains more reflection models
as its children, each of which represents a different bundle.

> [!NOTE]
> Since type checking is supposed to be performed by `tsc`, `skipErrorChecking` has been set to true. This means that if there are type errors in the source files being processed,
> `typedoc` simply returns `undefined` when `Application.convert` is called.

## HTML Generation
It is not possible to generate the HTML documentation on a per-bundle basis. Thus, when HTML documentation needs to be regenerated, the source files of every single bundle gets processed.

## JSON Generation
`typedoc` represents each bundle as a [`DeclarationReflection`](https://typedoc.org/api/classes/Models.DeclarationReflection.html) internally. Each of these `DeclarationReflection`s contains an array of "children" elements which
represents that bundle's exports. Each of these elements is parsed by various parsers to produce the desired documentation object, which is then written to disk after converted into a JSON string.

It is possible to generate the JSON documentation of each bundle separately. Hence, the JSON builder doesn't initialize `typedoc`, leaving the caller to choose between initializing `typedoc` for all bundles at once
or just for that single bundle.
