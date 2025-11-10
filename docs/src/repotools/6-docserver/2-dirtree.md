# Directory Trees

The idea behind this plugin was inspired by [this](https://tree.nathanfriend.com/?) ASCII tree generator.

::: details Creating a Markdown-It Plugin
The documentation for developers looking to create a Markdown-It plugin are woefully inadequate. Thus, most of this plugin was written based on the implementations of other plugins, such as the Vitepress Mermaid plugin and Vitepress Code snippet plugin.

It basically works by detecting when a code block has been assigned the `dirtree` language, parses the code block's content as YAML and converts that object into the directory structure that can then be rendered as text.

Using the `languageAlias` markdown configuration, we can get Vitepress to highlight and colour the rendered directory trees.
:::

To create your own directory tree, use the `dirtree` language with your markdown code block:

````md {1}
``` dirtree

```
````

Within the `dirtree` code block, YAML is used for configuring the output. Start by first configuring your root object:

````md {2}
``` dirtree
name: root directory
```
````

If you do not specify a name for your root directory, then it will have the default name of `"root"`. Now you can proceed to create children elements using a YAML list:

````md
``` dirtree
name: root directory
children:
  - item0
  - name: item1
    children:
      - item2
```
````

Each item can either just be a string entry (like `item0` above), in which case that entry is simply displayed as is, or it can be a compound YAML object like `item1` is. The details for such an entry are as follows:

```yml
name: item1  # You must provide the name property
comment: This is an optional comment
children:    # Optional list of items
  - item2
```

## Optional Comments

If provided, the comment is rendered on the same line, in alignment with all other comments:

```dirtree
name: root
children:
  - name: item1
    comment: This is a comment
  - name: item2
    comment: Notice how all comments are
    children:
      - name: item 3
        comment: aligned at the end
  - this_item_has_a_very_long_name
```

## Path Validation

In the case you intend for your displayed directory tree to reflect the structure of an actual directory on disk, you can specify a `path` property on the root object. This path is resolved from the file containing the markdown.

````md {4}
<!-- Located in docs/index.md -->
``` dirtree
name: root directory
path: ./root   # gets resolved to docs/root
children:
  - item0
  - name: item1
    children:
      - item2
```
````

The plugin will then traverse down the directory structure. For each item, if it has children, it checks that the item corresponds to a directory of the same name on disk. In the example above, the plugin would check that `docs/root` was a folder that contained either a file or directory called `item0`.

It would also check that `docs/root/item1` exists and that is is a directory (since it has children elements). This check is recursively performed on each subdirectory.

> [!WARNING]
> This validation is only performed for items that have been specified in the `dirtree`, i.e. it doesn't consider items that are present on disk but aren't listed as an issue.

If the check fails a warning will be printed to the console stating which files it wasn't able to locate.

Path validation is optional; Not providing a path means that no validation is performed, so `dirtree`s can reflect arbitrary directory structures.
