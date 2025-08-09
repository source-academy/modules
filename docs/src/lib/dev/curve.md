---
title: Curve Bundle
---

# Introduction
The `curves` module allow user to create, transform and render curves of various shapes and colours onto a `canvas` element. This `canvas` spawns in a dedicated tab when the program is run.

<table>
  <tbody>
    <tr>
      <td valign="top">
        <ul>
          <li><a href="#introduction">Introduction</a></li>
          <ul>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#documentation">Documentation</a></li>
            <li><a href="#pre-requisites">Pre-requisites</a></li>
          </ul>
        </ul>
      </td>
      <td valign="top">
        <ul>
          <li><a href="#repository">Repository</a></li>
          <ul>
            <li><a href="#library">Library</a></li>
            <ul>
              <li><a href="#documentation-style">Documentation Style</a></li>
            </ul>
          </ul>
          <ul>
            <li><a href="#tab-component">Tab Component</a></li>
            <ul>
              <li><a href="#spawning-mechanism">Spawning Mechanism</a></li>
              <li><a href="#user-interface">User Interface</a></li>
              <li><a href="#propstate-handling">Prop/State Handling</a></li>
            </ul>
          </ul>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Gallery
<p align="center">
  <a href="https://share.sourceacademy.nus.edu.sg/curve"><img width="274" src="https://i.imgur.com/wdCQwgR.gif" title="Heart"/></a>
</p>

Click the images for the sample code.

## Documentation
Refer to the module's [documentation](https://source-academy.github.io/modules/documentation/modules/curve.html) for more information on each exposed function's specifications.

## Pre-requisites
- The project requires some basic knowledge about **React**, including the usage of props/state.
- The current API that `curves` uses is **WebGL**. WebGL is a powerful tool for drawing on canvas elements, though limited by its primitive nature. Refer to the [online tutorials](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial) for more information.
- While going through the tutorial, you may come across a few matrix manipulation and constructor functions, such as `mat4.create()` and `rotate`. All these functions come from package called **glMatrix**, one of the most important dependencies in dealing with WebGL. More info can be found [here](https://glmatrix.net/).
- If there is an interest in doing fancier and cooler things for 3D graphics (e.g. surface rendering, orbit control, lighting, shadow casting etc.), the recommended way forward is to study [ThreeJS](https://threejs.org/). Since Source Academy is built on react, **React Three Fiber** is also a relevant package to look into.

# Repository
## Library
All functions (private and exposed) are stored within `src/bundles/curves`. The folder contains the following files:
1. `curves_webgl.ts` - Contains any utility function used in regards to handling WebGL contexts, but not exposed to the user. Create new files if there is a need to handle usage of other graphic libraries in the future (e.g. `polyhedra_threejs.ts`). It is recommended to document all functions within the file.
2. `function.ts` - Contains only the implementation and documentation of all exposed functions of the module. Provide credits for contributing any functions into the library in the file tsdoc using `@author` tag. Every exposed function must be documented.
3. `index.ts` - The only use of index.ts is to export functions meant to be exposed to the user.
4. `types.ts` - Contains all declarations for types used in other files in the folder. Avoid using `any` for type parameters, or a general types for enumerable types (e.g. using `space : string` when `space : '2D' | '3D'`). Consider enum types for enumerable types containing more than 3 constants. It is recommended to provide tsdoc for declared types in this file.

### Documentation Style
- All tsdoc description should start with capital letters and end with a full stop.
- Include `@param` and `@return` if any. Provide the corresponding description but do not end with a full-stop.
- It is recommended to include `@example` for exposed functions. Use code blocks to write the examples.
- Avoid going pass 80 character mark for each line. This is to facilitate split screen editing.

Guidelines are subjected to changes, update the above accordingly and ensure they are followed.

## Tab Component
The repository currently contains only the `index.ts` file. Feel free to add any files if there is a need to add more complex sub-components to the tab.

### Spawning Mechanism
The canvas tab spawns when all the following conditions are fulfilled:
1. `curves` module is imported.
2. A call to a render function is executed (e.g. `draw_connected(100)(t => make_point(t, t));`).
3. The entire program finishes running successfully.

### User Interface
The user interface consists of the following:
1. A html5 canvas element that displays the rendered curves.
2. A slider that controls the rotation of the rendered curves.
3. A play button that resumes the automated animation of the rotation.

The slider's value ranges from `0` to `2*PI` inclusively. At the first instance when the program is run, 3D rendered curves are set to auto-rotate by themselves. The slider's value also updates according to the current curve's rotation. The animation stops when the user interacts with the slider and manually changes its value. To resume auto-rotation, click the play button. Spam clicking the play button should take no effect.

The slider and the button will be disabled in cases where curves are rendered in 2D.

### Prop/State Handling
Understanding the use of slider and button requires some basic knowledge on [Blueprint](https://blueprintjs.com/docs/). Provide event handlers for these component as separate private functions if they are too complex, such as performing other executions other than modifying the state. Note that `setState` is executed asynchronously. Provide statements, which you want to execute only after the state is updated, as a callback function passed as an argument (e.g. `setState((prevState) => ({...}), () => {callback();})`). If there are common statements to be evaluated/executed after any update on the state, consider putting them under `componentDidUpdate()`.

Part of the tradeoffs of allowing the user to control the rotation of rendered curves is that the react tab component must have a way to retrieve information about the curve, and have the liberty to re-render it whenever needed by state changes. This has been done through calling `.result.value` on the context given through props. This effectively restricts the user to write the render statement as the last statement of the program as mentioned in [Spawning Mechanism](#spawning-mechanism).
