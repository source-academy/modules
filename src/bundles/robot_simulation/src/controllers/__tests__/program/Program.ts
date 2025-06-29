import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CallbackHandler } from '../../../engine/Core/CallbackHandler';
import { Program, program_controller_identifier } from '../../program/Program';
import { runECEvaluator } from '../../program/evaluate';

vi.mock(import('../../../engine/Core/CallbackHandler'));
vi.mock(import('../../program/evaluate'));

const mockedRunECEvaluator = vi.mocked(runECEvaluator);
const mockedCallbackHandler = vi.mocked(CallbackHandler);

describe('Program', () => {
  let program: Program;
  const mockCode = 'const x = 1;';

  beforeEach(() => {
    mockedCallbackHandler.mockClear();
    mockedRunECEvaluator.mockClear();

    program = new Program(mockCode);

    vi.spyOn(console, 'error').mockImplementation(vi.fn());
  });

  it('should initialize with default configuration if none provided', () => {
    expect(program.config.stepsPerTick).toEqual(11);
    expect(program.name).toEqual(program_controller_identifier);
    expect(program.isPaused).toBeFalsy();
  });

  it('should merge user configuration with default', () => {
    const customProgram = new Program(mockCode, { stepsPerTick: 20 });
    expect(customProgram.config.stepsPerTick).toEqual(20);
  });

  it('should start the evaluator with correct options', () => {
    const mockIterator = { next: vi.fn() } as any;
    mockedRunECEvaluator.mockReturnValue(mockIterator);

    program.start();

    expect(mockedRunECEvaluator).toHaveBeenCalledWith(mockCode, expect.anything(), expect.anything());
    expect(program.iterator).toBe(mockIterator);
  });

  it('should handle pause and resume correctly', () => {
    const mockIterator = { next: vi.fn() } as any;
    mockedRunECEvaluator.mockReturnValue(mockIterator);

    program.start();
    const tick = {stepCount:0,timestep: 1000} as any;
    program.update(tick);
    program.pause(900);
    expect(program.isPaused).toBeTruthy();
    expect(CallbackHandler.prototype.addCallback).toHaveBeenCalledWith(expect.any(Function), 900);

    program.fixedUpdate();
    expect(mockIterator.next).not.toBeCalled();
  });

  it('should process fixed number of steps per tick', () => {
    const mockIterator = { next: vi.fn() } as any;
    mockedRunECEvaluator.mockReturnValue(mockIterator);

    program.start();
    program.fixedUpdate();

    expect(mockIterator.next).toHaveBeenCalledTimes(11);
  });

  it('should catch errors during fixedUpdate', () => {
    expect(() => program.fixedUpdate()).toThrow('Error in program execution. Please check your code and try again.');
  });

  it('should check callbacks on update', () => {
    program.start();
    const mockTimingInfo = { deltaTime: 1 / 60 } as any;
    program.update(mockTimingInfo);

    expect(mockedCallbackHandler.prototype.checkCallbacks).toHaveBeenCalledWith(mockTimingInfo);
  });
});
