import type { DebuggerContext } from './types';

/* [Exports] */
export function degreesToRadians(degrees: number): number {
  return (degrees / 360) * (2 * Math.PI);
}

export function hexToColor(hex: string): [number, number, number] {
  const regex = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/igu;
  const groups = regex.exec(hex);

  if (groups == undefined) return [0, 0, 0];
  return [
    parseInt(groups[1], 16) / 0xff,
    parseInt(groups[2], 16) / 0xff,
    parseInt(groups[3], 16) / 0xff
  ];
}

export function mockDebuggerContext<T>(state: T, module: string) {
  return {
    context: {
      [module]: {
        state
      }
    }
  } as unknown as DebuggerContext;
}
