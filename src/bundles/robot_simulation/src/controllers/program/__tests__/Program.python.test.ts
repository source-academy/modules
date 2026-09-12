import { Context as PyContext } from '@sourceacademy/py-slang';
import { describe, expect, it, vi } from 'vitest';
import { Program } from '../Program';

/**
 * Exercises the Python path end-to-end (real py-slang CSE machine, not mocked), proving that
 * Program's async pump actually drives py-slang's async generator correctly across several
 * simulated physics ticks. Complements Program.test.ts, which only exercises the mocked path.
 */
describe('Program (real py-slang CSE machine)', () => {
  it('steps a Python program to completion across several fixedUpdate ticks', async () => {
    const pyContext = new PyContext();
    const program = new Program('x = 1\nx = x + 1\ny = x * 3\n', { stepsPerTick: 3 }, pyContext);

    program.start();
    expect(program.iterator).not.toBeNull();

    // Drain the program across several ticks the way World's physics-tick loop would, waiting
    // a macrotask between ticks so each tick's fire-and-forget async pump gets a chance to
    // actually run (mirrors real ticks being spaced out over time, not back-to-back synchronously).
    for (let tick = 0; tick < 20; tick++) {
      program.fixedUpdate();
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    // No error should have been surfaced.
    expect(() => program.fixedUpdate()).not.toThrow();

    // The global environment should now hold the final bindings.
    const globalEnv = pyContext.runtime.environments[0];
    expect(globalEnv.head['x']).toEqual({ type: 'bigint', value: BigInt(2) });
    expect(globalEnv.head['y']).toEqual({ type: 'bigint', value: BigInt(6) });
  });

  it('throws GeneralRuntimeError when constructed without a pyContext', () => {
    expect(() => new Program('x = 1')).toThrow('pyContext is required');
  });

  it('surfaces a Python evaluation error on the next tick without throwing synchronously', async () => {
    const pyContext = new PyContext();
    // Name error: `z` is never defined.
    const program = new Program('print(z)', { stepsPerTick: 5 }, pyContext);
    vi.spyOn(console, 'error').mockImplementation(vi.fn());

    program.start();
    program.fixedUpdate(); // kicks off the pump; the analyze()-time error surfaces async
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(() => program.fixedUpdate()).toThrow(
      'Error in program execution. Please check your code and try again.'
    );
  });
});
