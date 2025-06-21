import { type State, Universe, type SimulateFunction, type Transformation } from 'nbody';

/**
 * Create a new universe.
 * @param label The label of the universe.
 * @param color The color of the universe. Can be a string or an array of strings of the same length as the number of bodies in the universe.
 * @param prevState The previous state of the universe.
 * @param currState The current state of the universe.
 * @param simFunc The simulation function of the universe.
 * @param transformations The transformations of the universe.
 * @returns A new universe.
 * @category Universe
 */
export function createUniverse(
  label: string,
  color: string[] | string,
  prevState: State | undefined,
  currState: State,
  simFunc: SimulateFunction,
  transformations: Transformation[],
): Universe {
  return new Universe({
    label,
    color,
    prevState,
    currState,
    simFunc,
    transformations,
  });
}
