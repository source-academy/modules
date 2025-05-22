import { stringify } from 'js-slang/dist/utils/stringify';
import { test, expect } from 'vitest';
import { generateCurve, type Curve } from '../curves_webgl';
import { animate_3D_curve, animate_curve, draw_3D_connected, draw_connected, make_point } from '../functions';

function evalCurve(curve: Curve, numPoints: number) {
  generateCurve('none', 'points', numPoints, curve, '2D', false);
}

test('Ensure that invalid curves error gracefully', () => {
  expect(() => evalCurve(() => 1 as any, 200))
    .toThrow('Expected curve to return a point, got \'1\' at t=0');
});

test('Using 3D render functions with animate_curve should throw errors', () => {
  expect(() => animate_curve(1, 60, draw_3D_connected(200), (t0) => (t1) => make_point(t0, t1)))
    .toThrow('animate_curve cannot be used with 3D draw function!');
});

test('Using 2D render functions with animate_3D_curve should throw errors', () => {
  expect(() => animate_3D_curve(1, 60, draw_connected(200), (t0) => (t1) => make_point(t0, t1)))
    .toThrow('animate_3D_curve cannot be used with 2D draw function!');
});

test('Render functions have nice string representations', () => {
  expect(stringify(draw_connected(200))).toEqual('<RenderFunction(200)>');
});
