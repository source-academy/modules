import { beforeEach, describe, expect, it } from 'vitest';
import * as funcs from '../functions';

beforeEach(() => {
  funcs.resetWorld();
});

describe(funcs.add_box_object, () => {
  it('throws when no world has been created', () => {
    expect(() => funcs.add_box_object(
      funcs.make_vector(1, 1),
      0,
      funcs.make_vector(1, 1),
      funcs.make_vector(1, 1),
      true
    )).toThrow(
      'add_box_object: Please call set_gravity first!'
    );
  });
});

describe(funcs.add_circle_object, () => {
  it('throws when no world has been created', () => {
    expect(() => funcs.add_circle_object(
      funcs.make_vector(1, 1),
      0,
      funcs.make_vector(1, 1),
      1,
      true
    )).toThrow(
      'add_circle_object: Please call set_gravity first!'
    );
  });
});

describe(funcs.add_triangle_object, () => {
  it('throws when no world has been created', () => {
    expect(() => funcs.add_triangle_object(
      funcs.make_vector(1, 1),
      0,
      funcs.make_vector(1, 1),
      1,
      1,
      true
    )).toThrow(
      'add_triangle_object: Please call set_gravity first!'
    );
  });
});

describe(funcs.add_wall, () => {
  it('throws when no world has been created', () => {
    expect(() => funcs.add_wall(
      funcs.make_vector(1, 1),
      0,
      funcs.make_vector(1, 1),
    )).toThrow(
      'add_wall: Please call set_gravity first!'
    );
  });
});

describe(funcs.impact_start_time, () => {
  it('throws when no world has been created', () => {
    expect(() => funcs.impact_start_time({} as any, {} as any)).toThrow(
      'impact_start_time: Please call set_gravity first!'
    );
  });
});

describe(funcs.make_ground, () => {
  it('throws when no world has been created', () => {
    expect(() => funcs.make_ground(0, 0)).toThrow(
      'make_ground: Please call set_gravity first!'
    );
  });
});

describe(funcs.scale_size, () => {
  it('throws when no world has been created', () => {
    expect(() => funcs.scale_size({} as any, 0)).toThrow(
      'scale_size: Please call set_gravity first!'
    );
  });
});

describe(funcs.set_gravity, () => {
  it('throws when called multiple times', () => {
    expect(funcs.set_gravity(funcs.make_vector(0, -9.8))).toBeUndefined();
    expect(() => funcs.set_gravity(funcs.make_vector(0, -9.8))).toThrow('set_gravity: You may only call set_gravity once!');
  });
});

describe(funcs.simulate_world, () => {
  it('throws when no world has been created', () => {
    expect(() => funcs.simulate_world(0)).toThrow(
      'simulate_world: Please call set_gravity first!'
    );
  });
});

describe(funcs.update_world, () => {
  it('throws when no world has been created', () => {
    expect(() => funcs.update_world(0)).toThrow(
      'update_world: Please call set_gravity first!'
    );
  });
});
