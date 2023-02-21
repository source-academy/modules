/**
 * A single sentence summarising the module (this sentence is displayed larger).
 *
 * Sentences describing the module. More sentences about the module.
 *
 * @module arcade_two_d
 * @author Xenos Fiorenzo Anong
 * @author Titus Chew Xuan Jun
 */
import HelloWorld from './example_games/helloWorld';
/*
  To access things like the context or module state you can just import the context
  using the import below
 */
import { context } from 'js-slang/moduleHelpers';

/**
 * Sample function. Increments a number by 1.
 *
 * @param x The number to be incremented.
 * @returns The incremented value of the number.
 */
export function sample_function(x: number): number {
  return ++x;
} // Then any functions or variables you want to expose to the user is exported from the bundle's index.ts file

/**
 * Sample function. Displays sample game canvas.
 */
export function display_hello_world(): void {
  const gameConfig = {
    type: Phaser.AUTO,
    parent: 'phaser-game',
    width: 600,
    height: 600,
    scene: HelloWorld,
  };
  context.moduleContexts.arcade_two_d.state = {
    gameConfig,
  };
}
