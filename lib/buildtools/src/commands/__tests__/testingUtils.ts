import type { Command } from '@commander-js/extra-typings';

export function getCommandRunner<T extends () => Command<any>>(getter: T) {
  return (...args: string[]) => {
    return getter().parseAsync(args, { from: 'user' });
  };
}
