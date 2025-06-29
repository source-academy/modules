---
title: FAQ
---
# Frequently Asked Questions

* [**Infrastructure**](https://github.com/source-academy/modules/wiki/FAQs#infrastructure)
  * [Could you explain more on the infrastructure of the modules system? Especially regarding how the bundle and tabs communicate.](#could-you-explain-more-on-the-infrastructure-of-the-modules-system-especially-regarding-how-the-bundle-and-tabs-communicate)
* [**Set Up and Configuration**](#set-up-and-configuration)
  * [How do we use our own local version of the js-slang interpreter with the modules?](#how-do-we-use-our-own-local-version-of-the-js-slang-interpreter-with-the-modules)
  * [Is it possible to be using modules served from more than one location simultaneously?](#is-it-possible-to-be-using-modules-served-from-more-than-one-location-simultaneously)
* [**Language Specifications**](#language-specifications)
  * [Can a user on Source Academy import more than one module at once?](https://github.com/source-academy/modules/wiki/FAQs#can-a-user-on-source-academy-import-more-than-one-module-at-once)
* [**Tabs**](#tabs)
  * [Why is my Tab not spawning on Source Academy?](#why-is-my-tab-not-spawning-on-source-academy)
  * [How does the modules system handles css for the tabs?](#how-does-the-modules-system-handles-css-for-the-tabs)
* [**Interaction with `js-slang`**](#interaction-with-js-slang)
  * [How can we switch to the Source interpreter rather than the Source transpiler?](#how-can-we-switch-to-the-source-interpreter-rather-than-the-source-transpiler)

## Infrastructure

### Could you explain more on the infrastructure of the modules system? Especially regarding how the bundle and tabs communicate.
> Could you perhaps explain more on the program structure? Especially on how they communicate to achieve what I need. 
> And from what I currently understand, 
> 1. `bundle/**/*.ts` is where we store all logical functions 
> 2. `tabs/**/*.tsx` is where we use all the react and jsx which will be shown in the frontend

A brief overview of the current infrastructure is explained [here](../4-advanced/flow/flow). However, I would like to explain in more detail how the `bundle` and `tab` interacts with `js-slang` and `cadet-frontend` respectively. 

Firstly, a `bundle` is defined as the suite of functions that are provided by the module. More specifically, what we mean by this is that the bundle will provide all the functions and constants that are intended to be available for use by the cadet when programming in the Source language. 
```ts
import { install_filter, video_height, video_width, init } from "pix_n_flix";

install_filter((src, dest) => { ... });
init();
```
An example of the code that makes use of a module written in the Source language is given above. The main objective of the `bundle` is to provide the behind the scenes implementation of the `install_filter`, `video_height`, `video_width` and `init` functions so that the cadet programming in Source language can use it as a black box. In the above example, you can find the implementations of the said functions [here](https://github.com/source-academy/modules/blob/master/src/bundles/pix_n_flix/index.ts). The `bundle` however, does not store all logical functions that is required by your module like those needed only by the tab that are not provided to the cadets.

A `tab` on the other hand is more formally defined as an _optional_ user interface used by the module. A module can exist without a tab. The tab exists for developers of modules to make use of Source Academy's side content tabs to display user interfaces that are used with the module's bundle. The tab can optionally choose to make use of the result returned from the evaluation of the Source code. The tab can also even be entirely not dependent on the result from the evaluation of the Source code. So how then does the `tab` make use of information from the `bundle`? The tab does this through the use of an object from `cadet-frontend` called the `debuggerContext`. When constructing the side content tabs, we would occasionally want to make use of front-end data like the code that was evaluated, the result of the code evaluated and Source version used. On `cadet-frontend`, all these information is stored within the `debuggerContext` object which is defined [here](https://github.com/source-academy/cadet-frontend/blob/master/src/commons/workspace/WorkspaceTypes.ts). Hence, all tabs will receieve the object `debuggerContext` as a component prop. 

An example of an implementation of this is from the `pix_n_flix` module. The implementation can be found [here](https://github.com/source-academy/modules/blob/master/src/bundles/pix_n_flix/index.ts). In the module, a function `init()` is provided to the Source programmer. The specifications of the `pix_n_flix` module requires this `init()` function to be applied as the last statement of the Source program. As a result, the `js-slang` evaluator will return the return value of the `init()` function which is a JavaScript object with the type signature shown below. 
```ts
{
  toReplString: () => string;
  init: (video: HTMLVideoElement, canvas: HTMLCanvasElement, _errorLogger: () => void) => void; 
}
```
As described in the paragraphs above, this return value of the `init()` function will be stored within the `debuggerContext` in `debuggerContext.result.value`. The `tab` associated with the rendering of the video and canvas element will then render the HTMLVideoElement and HTMLCanvasElement, before creating references to the respective elements and applying the `init()` function in `debuggerContext.result.value` in the component's `componentDidMount()` method. 

## Set Up and Configuration

### How do we use our own local version of the js-slang interpreter with the modules?
> I have made some code changes to js-slang library and I want to test them out with my own local modules. 

To use your local `js-slang` interpreter with your local modules, you will need to follow the steps below. 
1. Serve your modules on a local server, done by transpiling your modules into JavaScript (`yarn build`) and then serving them as static assets (`yarn serve`). The default url for the local server is `http://localhost:8022`. Note that `yarn serve` serves the contents of the `build` folder. 
2. Ensure that your local version of `js-slang` is linked to your local `cadet-frontend`. This is achieved by `yarn link` at the local `js-slang` root folder and `yarn link js-slang` at the local `cadet-frontend` root folder.
3. Ensure that your `cadet-frontend` environment variable `REACT_APP_MODULE_BACKEND_URL` is set to the address of your locally served modules server (from step 1). Again, the default url for the local server is `http://localhost:8022`.
4. Start your `cadet-frontend` web server locally to test your module.

### Is it possible to be using modules served from more than one location simultaneously?
> I want to use my own modules served from `http://localhost:8022` and the official modules from `https://source-academy.github.io/modules` at the same time. Is it going to be possible?

It is not possible to be retrieving the modules' JavaScript files from more than one place simultaneously. The endpoint to retrieve the modules' JavaScript files from is the one in `cadet-frontend` evironment variable `REACT_APP_MODULE_BACKEND_URL` in the `.env` file. If you are using the `js-slang` library without `cadet-frontend`, the default source will be `https://source-academy.github.io/modules`.

## Language Specifications

### Can a user on Source Academy import more than one module at once?
> Am I able to run the following code in Source?
```ts
import { function_a } from "module_a";
import { function_b } from "module_b";

function_a();
function_b();
```

Yes this is possible.

## Tabs

### Why is my Tab not spawning on Source Academy?
> Why is my tab not spawning on Source Academy? It is importing the functions but not spawning the tab.

* Check that the `toSpawn()` function in the Tab's `index.ts` returns `true` in your context.
* Check that the environment variable `REACT_APP_MODULE_BACKEND_URL` of the running `cadet-frontend` web server is set to the correct url.
* Check that `modules.json` in the root folder of the modules repository contains your module and your tab and that it is spelled correctly (eg. `{ module: { tabs: [ "Tab" ] } }`).
* Refresh your browser with empty cache and hard reload. 
* Build and restart your modules static server again with `yarn build` and `yarn serve`.

### How does the modules system handles css for the tabs?
> How to include css styles in the module tabs?

Currently, two options are supported. 
* [Inline styles](https://www.w3schools.com/react/react_css.asp), where styles are added as an object to the react component's `style` prop
* CSS inside JavaScript (eg. [Styled Components](https://styled-components.com/))

## Interaction with `js-slang`

### How can we switch to the Source interpreter rather than the Source transpiler?
> I am modifying `js-slang`'s Source interpreter and need to change the mode of evaluation from the Source transpiler (default) to the Source interpreter. 

Include `"enable verbose";` as the first line of your program. Other functions of this setting can be found [here](https://github.com/source-academy/js-slang/blob/master/README.md#error-messages).

Note that the Source Academy frontend also switches to the interpreter as soon as a breakpoint is set. An example of a system that requires that the interpreter is run instead of the transpiler is the environment model visualizer.
