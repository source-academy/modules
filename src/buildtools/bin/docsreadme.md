# Overview

The Source Academy allows programmers to import functions and constants from a module, using JavaScript's `import` directive. For example, the programmer may decide to import the function `thrice` from the module `repeat` by starting the program with
```
import { thrice } from "repeat";
```

When evaluating such a directive, the Source Academy looks for a module with the matching name, here `repeat`, in a preconfigured modules site. The Source Academy at https://sourceacademy.org uses the default modules site (located at https://source-academy.github.io/modules).

After importing functions or constants from a module, they can be used as usual.
```
thrice(display)(8); // displays 8 three times
```
if `thrice` is declared in the module `repeat` as follows:
```
const thrice = f => x => f(f(f(x)));
```
[List of modules](modules.html) available at the default modules site.