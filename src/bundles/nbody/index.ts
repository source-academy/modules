/**
 * Define, configure, simulate and visualize nbody systems.
 *
 * n-body systems are notoriuosly difficult to predict due to the chaotic nature of the interactions between the bodies. While some special cases can be solved analytically, most systems require precise and complex simulations and predict their behavior. This library provides a simple interface to define, configure, simulate and visualize nbody systems using a variety of predefined numerical integrators and visualization modes.
 *
 * ```
 * import { createCelestialBody, createGravity, createRungeKutta4Sim,
 * createVelocityVerletSim, createSimulation, playSim, createState, createUniverse,
 * createVector, clone, recordSim } from 'nbody';
 *
 * const force = createGravity(1);
 * const sim = createRungeKutta4Sim(force, [1, 2, 2, 1]);
 * const a = createCelestialBody(
 *     "a",
 *     1,
 *     1,
 *     createVector(-0.97000436, 0.24308753, 0),
 *     createVector(0.466203685, 0.43236573, 0),
 *     createVector(0, 0, 0)
 *   );
 * const b = createCelestialBody(
 *     "b",
 *     1,
 *     1,
 *     createVector(0.97000436, -0.24308753, 0),
 *     createVector(0.466203685, 0.43236573, 0),
 *     createVector(0, 0, 0)
 * );
 * const c = createCelestialBody(
 *     "c",
 *     1,
 *     1,
 *     createVector(0, 0, 0),
 *     createVector(-2 * 0.466203685, -2 * 0.43236573, 0),
 *     createVector(0, 0, 0)
 * );
 *
 * const state = createState([a, b, c]);
 *
 * const universe = createUniverse(
 *     "Universe 1",
 *     "rgba(254, 209, 106, 1)",
 *     undefined,
 *     state,
 *     createVelocityVerletSim(force),
 *     []
 * );
 * const universe2 = createUniverse(
 *     "Universe 2",
 *     "rgba(254, 0, 0, 1)",
 *     undefined,
 *     clone(state),
 *     createRungeKutta4Sim(force, [1, 2, 2, 1]),
 *     []
 * );
 *
 * const simulation = createSimulation([universe, universe2], "3D", false, undefined, true, 100);
 * playSim(simulation);
 * ```
 *
 * @module nbody
 * @author Yeluri Ketan
 */

export { createCelestialBody } from './CelestialBody';
export { createForce, createCentripetalForce, createCombinedForce, createGravity } from './Force';
export { createExplicitEulerSim, createRungeKutta4Sim, createSemiImplicitEulerSim, createVelocityVerletSim, createLambdaSim } from './SimulateFunction';
export { createSimulation, playSim, recordSim } from './Simulation';
export { createState, getBodies } from './State';
export { createBodyCenterTransformation, createCoMTransformation, createLambdaTransformation, createRotateTransformation, createPinTransformation, createTimedRotateTransformation } from './Transformation';
export { createUniverse } from './Universe';
export {
  createVector, getX, getY, getZ, setX, setY, setZ, addVectors, subVectors, multiplyScalar
} from './Vector';
export { clone } from './Misc';

// import { createCelestialBody, createForce, createCentripetalForce, createCombinedForce, createGravity, createExplicitEulerSim, createRungeKutta4Sim, createSemiImplicitEulerSim, createVelocityVerletSim, createLambdaSim, createSimulation, playSim, createState, getBodies, createBodyCenterTransformation, createCoMTransformation, createLambdaTransformation, createRotateTransformation, createUniverse, createVector, getX, getY, getZ, setX, setY, setZ, clone, addVectors, subVectors, multiplyScalar, createPinTransformation, createTimedRotateTransformation } from 'nbody';
