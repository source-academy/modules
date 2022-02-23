/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { CurveCanvasProps } from './types';

type State = {};

/**
 * CurveCanvas used for 2D curves
 */
export default class CurveCanvas extends React.Component<
  CurveCanvasProps,
  State
> {
  public render() {
    return (
      <canvas
        ref={(r) => {
          if (r) {
            this.props.curve.init(r);
            this.props.curve.redraw(0);
          }
        }}
        height={500}
        width={500}
      />
    );
  }
}
