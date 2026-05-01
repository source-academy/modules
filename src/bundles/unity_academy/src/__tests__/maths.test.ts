import { describe, expect, it } from 'vitest';
import * as maths from '../UnityAcademyMaths';

describe(maths.checkVector3Parameter, () => {
  it('throws when provided object is not a Vector3', () => {
    expect(() => maths.checkVector3Parameter(0, 'foo'))
      .toThrow('foo: Expected 3D vector, got 0.');
  });

  it('doesn\'t throw when provided object is a Vector3', () => {
    expect(() => maths.checkVector3Parameter(new maths.Vector3(0, 0, 0), 'foo')).not.toThrow();
  });
});
