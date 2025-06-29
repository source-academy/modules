import { State, type CelestialBody } from 'nbody';

/**
 * Create a new state snapshot of the universe.
 * @param bodies The bodies in the state.
 * @returns A new state.
 * @category State
 */
export function createState(bodies: CelestialBody[]): State {
  return new State(bodies);
}

/**
 * Get the bodies in a state.
 * @param state The state.
 * @returns The bodies in the state.
 * @category State
 */
export function getBodies(state: State): CelestialBody[] {
  return state.bodies;
}
