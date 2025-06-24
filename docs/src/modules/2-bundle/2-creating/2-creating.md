# Creating a Bundle
This page contains instructions for creating a new bundle from scratch. If you are looking to edit an existing bundle refer to [these](../editing) instructions instead.
## Running the Template Command
> [!TIP]
> If necessary, before running the `template` command, you can run 
> ```sh
> yarn workspaces focus @sourceacademy/modules
> ```
> to install **only** the dependencies required for creating your bundle.

To create a new bundle, use the `template` command.

```sh
yarn template
```
This will start an interactive prompt that will help you through the process of creating a bundle.  Enter `module` to create a new bundle.

```txt
What would you like to create? (module/tab)
module
```

Then enter the name of your new bundle. It must be in `snake_case`.
```txt
What would you like to create? (module/tab)
module

What is the name of your new module? (eg. binary_tree)
new_bundle
```

The name of your bundle is what Source users will import from to actually use your bundle:
```ts
import { function } from 'new_bundle';
```

The command should have creates a new folder `src/bundles/new_bundle` with all the necessary files for creating your bundle:

![](./new_bundle.png)

From there you can edit your bundle as necessary
