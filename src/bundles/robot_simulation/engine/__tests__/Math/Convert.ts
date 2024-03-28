import { Quaternion, Vector3, Euler } from 'three';
import { quat, vec3, euler } from '../../Math/Convert'; // Adjust the import path as necessary

describe('Three.js utility functions', () => {
  describe('quat function', () => {
    it('creates a Quaternion with the specified x, y, z, w values', () => {
      const x = 1, y = 2, z = 3, w = 4;
      const quaternion = quat({ x, y, z, w });
      expect(quaternion).toBeInstanceOf(Quaternion);
      expect(quaternion.x).toBe(x);
      expect(quaternion.y).toBe(y);
      expect(quaternion.z).toBe(z);
      expect(quaternion.w).toBe(w);
    });
  });

  describe('vec3 function', () => {
    it('creates a Vector3 with the specified x, y, z values', () => {
      const x = 5, y = 6, z = 7;
      const vector = vec3({ x, y, z });
      expect(vector).toBeInstanceOf(Vector3);
      expect(vector.x).toBe(x);
      expect(vector.y).toBe(y);
      expect(vector.z).toBe(z);
    });
  });

  describe('euler function', () => {
    it('creates an Euler with the specified x, y, z values', () => {
      const x = 0.1, y = 0.2, z = 0.3;
      const eulerInstance = euler({ x, y, z });
      expect(eulerInstance).toBeInstanceOf(Euler);
      expect(eulerInstance.x).toBeCloseTo(x);
      expect(eulerInstance.y).toBeCloseTo(y);
      expect(eulerInstance.z).toBeCloseTo(z);
    });
  });
});
