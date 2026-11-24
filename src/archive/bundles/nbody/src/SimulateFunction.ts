import { ExplicitEulerSim, LambdaSim, RungeKutta4Sim, SemiImplicitEulerSim, VelocityVerletSim, type Force, type State } from 'nbody';

/**
 * Create an explicit euler integrator to be used as the simulation function.
 * @param force The force that applies to the nbody system.
 * @returns A new explicit Euler simulation.
 * @category Simulate Functions
 */
export function createExplicitEulerSim(force?: Force): ExplicitEulerSim {
  return new ExplicitEulerSim(force);
}

/**
 * Create a numerical integrator that uses the Runge-Kutta 4 method to simulate the nbody system.
 * @param force The force that applies to the nbody system.
 * @param weights The weights to be used for the weighted sum of the k values.
 * @returns A new Runge-Kutta 4 simulation.
 * @category Simulate Functions
 */
export function createRungeKutta4Sim(force?: Force, weights?: number[]): RungeKutta4Sim {
  return new RungeKutta4Sim(force, weights);
}

/**
 * Create a numerical integrator that uses the semi-implicit Euler method to simulate the nbody system.
 * @param force The force that applies to the nbody system.
 * @returns A new semi-implicit Euler simulation.
 * @category Simulate Functions
 */
export function createSemiImplicitEulerSim(force?: Force): SemiImplicitEulerSim {
  return new SemiImplicitEulerSim(force);
}

/**
 * Create a numerical integrator that uses the velocity Verlet method to simulate the nbody system.
 * @param force The force that applies to the nbody system.
 * @returns A new velocity Verlet simulation.
 * @category Simulate Functions
 */
export function createVelocityVerletSim(force: Force): VelocityVerletSim {
  return new VelocityVerletSim(force);
}

/**
 * Create a simulate function (usually a numerical integrator) that is used to simulate the nbody system using the provided higher order/lambda/arrow/anonymous function.
 * @param fn The function to be used as the simulate function.
 * @returns A new lambda simulation.
 * @category Simulate Functions
 */
export function createLambdaSim(fn: (deltaT: number, prevState: State, currState: State) => State): LambdaSim {
  return new LambdaSim(fn);
}
