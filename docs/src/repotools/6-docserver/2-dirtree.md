# Directory Trees

The idea behind this plugin was inspired by [this](https://tree.nathanfriend.com/?) ASCII tree generator.



## Plugin Structure

The plugin itself consists of 3 components:

### 1. `markdown-it` plugin

This component hooks into the Markdown code block renderer, allowing us to replace the rendering logic for code blocks when we detect the `dirtree` language.

The directory plugin is located in the `markdown-tree` folder under the `lib` directory. Because of some of the `lodash` dependencies that get bundled, the plugin needs to be built to CJS rather than ESM.

::: details Creating a Markdown-It Plugin

The documentation for developers looking to create a Markdown-It plugin are woefully inadequate. Thus, most of this plugin was written based on the implementations of other plugins, such as the Vitepress Mermaid plugin and Vitepress Code snippet plugin.

:::

In this case, we first parse the YAML configuration, then render the directory tree as a string before passing it back to the Markdown code renderer so that the
directory tree gets rendered as a code block.

### 2. Textmate grammar for the `dirtree` language

To provide the colouring for the rendered directory trees, we first need to instruct Vitepress' builtin highlighter `shiki` on how to parse our rendered directory trees so that it can figure out what elements
need to be highlighted.

`shiki` relies on [Textmate Grammars](https://macromates.com/manual/en/language_grammars) for parsing, so the plugin defines a grammar so that `shiki` can identify the different components of the directory tree:

<table>
  <thead>
    <tr>
      <th>Component</th>
      <th>Explanation</th>
      <th>Examples</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Branch</td>
      <td>Groups of 4 characters that together make up the graphic part of the "tree"</td>
      <td>
        <ul>
          <li><code>&nbsp;&nbsp;&nbsp;&nbsp;</code></li>
          <li><code>│&nbsp;&nbsp;&nbsp;</code></li>
          <li><code>├──&nbsp;</code></li>
          <li><code>└──&nbsp;</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Identifier</td>
      <td>The name of a file or directory</td>
      <td>
        <ul>
          <li><code>filename.js</code></li>
          <li><code>bin</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Comment</td>
      <td>Optional comment describing the entry, beginning with two forward slashes <code>//</code> that gets rendered at the end the line</td>
      <td><nobr><code>// This is a comment</code></nobr></td>
    </tr>
  </tbody>
</table>

Each line in the directory must consist of at least 1 branch (if it's not the root) and exactly 1 identifier. The comment is optional.

Passing `shiki` this grammar also registers the `dirtree` langauge with `shiki`, so it doesn't get confused when trying to find highlighters.

### 3. Highlighter for `shiki`

`shiki` uses the grammar to parse each line of the directory tree, which then breaks that line into an array of tokens that gets passed to the code transformer.
Each token contains one of the aforementioned components.

Since each branch component has a length of 4, we can determine the level to which each token belongs by dividing its position from the start of the line by 4 (i.e a branch token at
8 characters offset from line start is at level 2). Then we simply assign the colour corresponding to that indent level to that token.

Vitepress uses the themes from Github by default, so the transformer is configured to select from a set of colours chosen from the `github-dark` and `github-light` themes.

## Using the plugin within Markdown

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
      - name: item3
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

## Highlighting

Each level of nesting is given its own colour retrieved from the Github set of colours. Code highlighting in Vitepress is powered by [`shiki`](https://shiki.style).
After the initial YML gets parsed and transformed into the raw uncoloured directory tree, the rendered code block gets passed to a code transformer, which parses
the directory tree according to its own Textmate Grammar. Then, colours are applied to each line.

The grammar and code transformer are also exported from the Markdown Tree plugin and are applied in the Vitepress configuration. Refer to the
`codeTransformers` and `languages` under the `markdown` set of options.

Do note that directory trees are intended to reflect actual structures within an actual file system. Therefore, if you use names for items that aren't valid
as file names you might get incorrect highlighting.
