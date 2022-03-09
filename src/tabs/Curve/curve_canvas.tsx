/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { CurveDrawn } from '../../bundles/curve/curves_webgl';

/**
 * CurveCanvas used for 2D curves
 */
export default function curveCanvas(props: { curve: CurveDrawn }) {
  return (
    <canvas
      ref={(r) => {
        if (r) {
          props.curve.init(r);
          props.curve.redraw(0);
        }
      }}
      height={500}
      width={500}
    />
  );
}
