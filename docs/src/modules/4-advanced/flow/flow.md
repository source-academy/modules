# Flow of the Module System

![image](./fig1.png)
> Figure 1: The flow of Source Modules in `js-slang`

1. Source code begins in an editor on the Source Academy frontend in a workspace (eg. playground) or as files on a file-system. To execute a Source program, `js-slang` exposes a function `runInContext` which first parses the code into an [Abstract Syntax Tree (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree).
2. The AST will is checked for syntax errors and other logical errors.
3. `js-slang` then analyzes all the import nodes in the program, filtering out for the ones that load Source Modules and determines which Source modules to load.
4. `js-slang` then loads the modules manifest (`modules.json`) to check that the specified modules do indeed exist and retrieve information about the modules it needs to load (such as what tabs need to be loaded).
5. `js-slang` will evaluate the code in all the modules its suppose to load. At this point, code in the bundle that initializes the module context is executed.
6. Any tabs that need to be loaded will then be loaded, ready for display by the frontend.

## In the Frontend
![image](./fig2.png)
> Figure 2: The Flow of the Source Modules system in the frontend

The imported tabs will make use of the `debuggerContext` provided by the Source Academy frontend (which includes the result of the evaluation and the modules’ tabs) to display content.  

The most up-to-date definition of `debuggerContext` is defined [here](https://github.com/source-academy/cadet-frontend/blob/master/src/commons/workspace/WorkspaceTypes.ts).

```ts
export type DebuggerContext = {
  result: any;
  lastDebuggerResult: any;
  code: string;
  context: Context;
  workspaceLocation?: WorkspaceLocation;
};
```
