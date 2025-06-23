# Creating a Tab
This page contains instructions for creating a new bundle from scratch. If you are looking to edit an existing bundle refer to [these](./editing) instructions instead.

All tabs require at least one parent bundle. Before you create your tab, make sure you identify which bundle(s) are
supposed to be the parent of your tab.

## Running the Template Command
> [!TIP]
> If necessary, before running the `template` command, you can run 
> ```sh
> yarn workspaces focus @sourceacademy/modules
> ```
> to install **only** the dependencies required for creating your tab.

To create a new tab, use the `template` command:

```sh
yarn template
```

This will start an interactive prompt that will help you through the process of creating a tab.  Enter `tab` to create a new tab.

```txt
What would you like to create? (module/tab)
tab
```
Then enter the name of the parent bundle. It must be a bundle that already exists.
```txt
What would you like to create? (module/tab)
tab

Add a new tab to which module?
new_module
```

Then enter the name of your new tab. It must be in `PascalCase`.
```txt
What would you like to create? (module/tab)
tab

Add a new tab to which module?
new_module

What is the name of your new tab? (eg. BinaryTree)
NewTab
```

This will create a new folder `src/tab/NewTab` with all the necessary files for creating your tab.

When you are ready to compile you can refer to [this](../compiling) page.
