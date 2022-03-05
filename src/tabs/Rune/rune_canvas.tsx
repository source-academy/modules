/* eslint-disable react/destructuring-assignment */
import React from 'react';
import {
  drawAnaglyph,
  drawHollusion,
  drawRune,
} from '../../bundles/rune/runes_webgl';
import { Rune } from '../../bundles/rune/types';

type State = {};

type Props = {
  rune: Rune;
};

export default class RuneCanvas extends React.Component<Props, State> {
  private canvas: HTMLCanvasElement | null;

  constructor(props) {
    super(props);

    this.canvas = null;
  }

  public render() {
    return (
      <canvas
        id='runesCanvas'
        ref={(r) => {
          this.canvas = r;

          const runeToDraw = this.props.rune;
          if (r) {
            if (runeToDraw.drawMethod === 'anaglyph') {
              drawAnaglyph(r, runeToDraw);
            } else if (runeToDraw.drawMethod === 'hollusion') {
              drawHollusion(r, runeToDraw);
            } else if (runeToDraw.drawMethod === 'normal') {
              drawRune(r, runeToDraw);
            } else {
              throw Error(`Unexpected Drawing Method ${runeToDraw.drawMethod}`);
            }
          }
        }}
        width={512}
        height={512}
      />
    );
  }
}
