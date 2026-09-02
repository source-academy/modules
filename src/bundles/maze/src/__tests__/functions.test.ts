import type { Context } from 'js-slang';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockContext = {
  moduleContexts: { maze: {} as { state?: any } }
} as unknown as Context;
vi.mock(import('js-slang/context'), () => ({ default: mockContext }));

describe('set_animation_speed', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('defaults animationSpeed to 2 before it is changed', async () => {
    const funcs = await import('../functions');
    funcs.init(500, 500, 0, 0, 0);
    expect(mockContext.moduleContexts.maze.state.animationSpeed).toBe(2);
  });

  it('updates state.animationSpeed when called before init is complete', async () => {
    const funcs = await import('../functions');
    funcs.init(500, 500, 0, 0, 0);
    funcs.set_animation_speed(10);
    expect(mockContext.moduleContexts.maze.state.animationSpeed).toBe(10);
  });

  it('throws once initialisation is complete', async () => {
    const funcs = await import('../functions');
    funcs.init(500, 500, 0, 0, 0);
    funcs.complete_init();
    expect(() => funcs.set_animation_speed(10)).toThrow(
      'May not use initialization functions after initialization is complete!'
    );
  });

  it('throws when speed is 0', async () => {
    const funcs = await import('../functions');
    funcs.init(500, 500, 0, 0, 0);
    expect(() => funcs.set_animation_speed(0)).toThrow(
      'Animation speed must be a finite number greater than 0!'
    );
  });

  it('throws when speed is negative', async () => {
    const funcs = await import('../functions');
    funcs.init(500, 500, 0, 0, 0);
    expect(() => funcs.set_animation_speed(-5)).toThrow(
      'Animation speed must be a finite number greater than 0!'
    );
  });

  it('throws when speed is NaN', async () => {
    const funcs = await import('../functions');
    funcs.init(500, 500, 0, 0, 0);
    expect(() => funcs.set_animation_speed(NaN)).toThrow(
      'Animation speed must be a finite number greater than 0!'
    );
  });
});
