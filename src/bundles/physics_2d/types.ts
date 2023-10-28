/* eslint-disable new-cap */
// We have to disable linting rules since Box2D functions do not
// follow the same guidelines as the rest of the codebase.

import { b2Vec2 } from '@box2d/core';
import { type ReplResult } from '../../typings/type_helpers';

export const ACCURACY = 2;
export class Vector2 extends b2Vec2 implements ReplResult {
  public toReplString = () => `Vector2D: [${this.x}, ${this.y}]`;
}

export type Force = {
  direction: b2Vec2;
  magnitude: number;
  duration: number;
  start_time: number;
};

export type ForceWithPos = {
  force: Force;
  pos: b2Vec2;
};

export class Timer {
  private time: number;

  constructor() {
    this.time = 0;
  }

  public step(dt: number) {
    this.time += dt;
    return this.time;
  }

  public getTime() {
    return this.time;
  }

  public toString() {
    return `${this.time.toFixed(4)}`;
  }
}
