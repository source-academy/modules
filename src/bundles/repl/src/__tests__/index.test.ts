import * as slang from 'js-slang';
import { stringify } from 'js-slang/dist/utils/stringify';
import { describe, expect, it, vi } from 'vitest';
import * as funcs from '../functions';
import { ProgrammableRepl } from '../programmable_repl';

describe(ProgrammableRepl, () => {
  const replIt = it.extend<{ repl: ProgrammableRepl }>({
    repl: ({}, use) => {
      const repl = new ProgrammableRepl();
      repl.setTabReactComponentInstance({
        setState: () => {}
      });
      return use(repl);
    }
  });

  replIt('calls js-slang when default_js_slang is the evaluator', ({ repl }) => {
    vi.spyOn(slang, 'runFilesInContext').mockResolvedValueOnce({
      status: 'error'
    });

    repl.InvokeREPL_Internal(funcs.default_js_slang);
    repl.runCode();

    expect(slang.runFilesInContext).toHaveBeenCalledOnce();
  });

  replIt('calls the evaluator when another evaluator is provided', ({ repl }) => {
    const evaller = vi.fn(() => 0);
    repl.InvokeREPL_Internal(evaller);
    repl.runCode();

    expect(evaller).toHaveBeenCalledOnce();
  });

  replIt('calls the easter egg function when no evaluator is provided', ({ repl }) => {
    vi.spyOn(repl, 'easterEggFunction');
    repl.runCode();

    expect(repl.easterEggFunction).toHaveBeenCalledOnce();
  });
});

describe(funcs.default_js_slang, () => {
  it('default_js_slang throws when called', () => {
    expect(() => funcs.default_js_slang(''))
      .toThrowError('Invaild Call: Function "default_js_slang" can not be directly called by user\'s code in editor. You should use it as the parameter of the function "set_evaluator"');
  });
});

describe(funcs.set_evaluator, () => {
  it('returns a value that indicates that the repl is initialized', () => {
    expect(stringify(funcs.set_evaluator(() => 0))).toEqual('<Programmable Repl Initialized>');
  });

  it('throws when the parameter isn\'t a function', () => {
    expect(() => funcs.set_evaluator(0 as any))
      .toThrowError('set_evaluator expects a function as parameter');
  });
});
