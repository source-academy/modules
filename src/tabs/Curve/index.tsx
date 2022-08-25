import React from 'react';
import type { CurveDrawn } from '../../bundles/curve/curves_webgl';
import type { AnimatedCurve } from '../../bundles/curve/types';
import { glAnimation } from '../../typings/anim_types';
import MultiItemDisplay from '../common/multi_item_display';
import type { DebuggerContext } from '../../typings/type_helpers';
import Curve3DAnimationCanvas from './3Dcurve_anim_canvas';
import CurveCanvas3D from './curve_canvas3d';
import AnimationCanvas from '../common/animation_canvas';
import WebGLCanvas from '../common/webgl_canvas';

export default {
  toSpawn(context: DebuggerContext) {
    const drawnCurves = context.context?.moduleContexts?.curve?.state?.drawnCurves;
    return drawnCurves.length > 0;
  },
  body(context: DebuggerContext) {
    const { context: { moduleContexts: { curve: { state: { drawnCurves } } } } } = context;

    const canvases = drawnCurves.map((curve, i) => {
      const elemKey = i.toString();

      if (glAnimation.isAnimation(curve)) {
        const anim = curve as AnimatedCurve;
        return anim.is3D
          ? (
            <Curve3DAnimationCanvas animation={anim} key={elemKey} />
          )
          : (
            <AnimationCanvas animation={anim} key={elemKey} />
          );
      }
      const curveDrawn = curve as CurveDrawn;
      return curveDrawn.is3D()
        ? (
          <CurveCanvas3D curve={curveDrawn} key={elemKey} />
        )
        : (
          <WebGLCanvas
            ref={(r) => {
              if (r) {
                curveDrawn.init(r);
                curveDrawn.redraw(0);
              }
            }}
            key={elemKey}
          />
        );
    });

    return <MultiItemDisplay elements={canvases} />;
  },
  label: 'Curves Tab',
  iconName: 'media', // See https://blueprintjs.com/docs/#icons for more options
};
