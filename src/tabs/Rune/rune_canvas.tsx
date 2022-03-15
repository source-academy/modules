/* eslint-disable react/destructuring-assignment */
import React from 'react';
import {
  drawAnaglyph,
  drawHollusion,
  drawRune,
} from '../../bundles/rune/runes_webgl';
import { Rune } from '../../bundles/rune/types';

export default function runeCanvas(props: { rune: Rune }) {
  return (
    <canvas
      id='runesCanvas'
      ref={(r) => {
        const runeToDraw = props.rune;
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
