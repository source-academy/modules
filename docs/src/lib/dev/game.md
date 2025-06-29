---
title: game
---

# Introduction

The `game` module is wrapper of the Phaser 3 API, that allows users to program their own game rooms in the Source Academy game. Students are able to use the `game` module functions inside the Phaser lifecycle functions (`preload()`, `create()` and `update()`), to define the room behaviour they want. Student room code is later fetched and run in-game.

## Documentation

You can check out the module's [documentation](https://source-academy.github.io/modules/documentation/modules/game.html) for more information on each exposed function's specifications.

## Module Files

### 1. `index.ts`

This is the entry point to the module and contains a single default export that returns the module's exposed functions. It does this by passing GameParams into `gameFuncs` in functions.ts.  

### 2. `functions.ts`

`gameFuncs` in functions.ts contains implementation details for the module's private and public functions, and returns the public ones.

### 3. `types.ts`

Game module types are defined here and generally wrap Phaser GameObject types that are typically used in similar ways in the module.

1) `RawGameElement`: Phaser Sprite or Phaser Text
2) `RawGameShape`: Phaser Rectangle or Phaser Ellipse
3) `RawGameObject`: RawGameElement or RawGameShape
4) `RawContainer`: Phaser Container
5) `RawInputObject`: Phaser InputPlugin or Phaser Keyboard.Key
6) `GameObject`: the GameObject's type string, together with a RawGameObject or RawInputObject or RawContainer
7) `GameParams`: Contains fields that will be passed in from frontend that are required for the module's functions
8) `__Params`: The module params passed into the module (from frontend) with a GameParams field

## Game Tabs

The Game Tab currently only displays a reminder for the student to save their work and see the effect of the roomcode in-game, and links to the API documentation and User Guide.
