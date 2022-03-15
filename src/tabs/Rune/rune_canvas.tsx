import React from 'react';
import { AnaglyphRune } from '../../bundles/rune/functions';
import { NormalRune } from '../../bundles/rune/rune';

export default function runeCanvas(props: { rune: NormalRune | AnaglyphRune }) {
  return (
    <canvas
      height={512}
      width={512}
      ref={(r) => {
        if (r) {
          props.rune.draw(r);
        }
      }}
    />
  );
}
