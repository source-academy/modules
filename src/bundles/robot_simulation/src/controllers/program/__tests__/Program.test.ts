import { Context as PyContext } from '@sourceacademy/py-slang';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CallbackHandler } from '../../../engine/Core/CallbackHandler';
import { Program, program_controller_identifier } from '../Program';
import { runPythonECEvaluator } from '../evaluate';

/**
 * Generic Controller-shaped behaviour (config defaults, pause/resume, error handling), against a
 * mocked evaluator - what a pre-migration Program.test.ts covered against a mocked js-slang
 * evaluator, now against py-slang's instead (Program is Python-only - see Program.ts's doc
 * comment for why a Source path isn't wired up). Program.python.test.ts complements this with an
 * end-to-end run against the real py-slang CSE machine.
 */
vi.mock(import('../../../engine/Core/CallbackHandler'));
vi.mock(import('../evaluate'));

const mockedRunPythonECEvaluator = vi.mocked(runPythonECEvaluator);
const mockedCallbackHandler = vi.mocked(CallbackHandler);

describe(Program, () => {
  let program: Program;
  const mockCode = 'x = 1';
  const mockPyContext = new PyContext();

  beforeEach(() => {
    mockedCallbackHandler.mockClear();
    mockedRunPythonECEvaluator.mockClear();

    program = new Program(mockCode, undefined, mockPyContext);

    vi.spyOn(console, 'error').mockImplementation(vi.fn());
  });

  it('should initialize with default configuration if none provided', () => {
    expect(program.config.stepsPerTick).toEqual(11);
    expect(program.name).toEqual(program_controller_identifier);
    expect(program.isPaused).toBeFalsy();
  });

  it('should merge user configuration with default', () => {
    const customProgram = new Program(mockCode, { stepsPerTick: 20 }, mockPyContext);
    expect(customProgram.config.stepsPerTick).toEqual(20);
  });

  it('throws GeneralRuntimeError when constructed without a pyContext', () => {
    expect(() => new Program(mockCode)).toThrow('pyContext is required');
  });

  it('should start the evaluator with correct options', () => {
    const mockIterator = { next: vi.fn().mockResolvedValue({ done: false }) } as any;
    mockedRunPythonECEvaluator.mockReturnValue(mockIterator);

    program.start();

    expect(mockedRunPythonECEvaluator).toHaveBeenCalledWith(mockCode, mockPyContext, expect.anything());
    expect(program.iterator).toBe(mockIterator);
  });

  it('should handle pause and resume correctly', () => {
    const mockIterator = { next: vi.fn().mockResolvedValue({ done: false }) } as any;
    mockedRunPythonECEvaluator.mockReturnValue(mockIterator);

    program.start();
    const tick = { stepCount: 0, timestep: 1000 } as any;
    program.update(tick);
    program.pause(900);
    expect(program.isPaused).toBeTruthy();
    expect(CallbackHandler.prototype.addCallback).toHaveBeenCalledWith(expect.any(Function), 900);

    program.fixedUpdate();
    expect(mockIterator.next).not.toBeCalled();
  });

  it('throws when fixedUpdate is called before start', () => {
    expect(() => program.fixedUpdate()).toThrow('Program not started');
  });

  it('should check callbacks on update', () => {
    program.start();
    const mockTimingInfo = { deltaTime: 1 / 60 } as any;
    program.update(mockTimingInfo);

    expect(mockedCallbackHandler.prototype.checkCallbacks).toHaveBeenCalledWith(mockTimingInfo);
  });
});
