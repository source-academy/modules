/**
 * Bundle for Source Academy Arcade2D module.
 *
 * Arcade2D allows users to create their own games.
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
}

/**
 * Displays sample game canvas. For testing purposes.
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
