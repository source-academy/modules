import { generateCurve, type Curve } from "../curves_webgl";

function evalCurve(curve: Curve, numPoints: number) {
  generateCurve('none', 'points', numPoints, curve, '2D', false)
}

test('Ensure that invalid curves error gracefully', () => {
  expect(() => evalCurve(t => 1 as any, 200))
    .toThrowErrorMatchingInlineSnapshot(`"Expected curve to return a point, got '1' at t=0"`);
})
