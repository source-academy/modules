/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { HollusionRune } from '../../bundles/rune/functions';

type Props = {
  rune: HollusionRune;
};

type State = {};

export default class HollusionCanvas extends React.Component<Props, State> {
  private canvas: HTMLCanvasElement | null;

  constructor(props) {
    super(props);

    this.canvas = null;
  }

  public componentDidMount() {
    if (this.canvas) {
      this.props.rune.draw(this.canvas);
    }
  }

  public render() {
    return (
      <canvas
        height={512}
        width={512}
        ref={(r) => {
          this.canvas = r;
        }}
      />
    );
  }
}
