import type { Command } from '@commander-js/extra-typings';
import { expect } from 'vitest';

export function expectCommandSuccess(promise: Promise<any>) {
  return expect(promise).resolves.not.toThrow();
}

export function expectCommandExit(promise: Promise<any>) {
  return expect(promise).rejects.toThrow('process.exit called with 1');
}
export function getCommandRunner<T extends () => Command<any>>(getter: T) {
  return (...args: string[]) => {
    return getter().parseAsync(args, { from: 'user' });
  };
}
