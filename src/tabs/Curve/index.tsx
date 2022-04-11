/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { CurveDrawn } from '../../bundles/curve/curves_webgl';
import { AnimatedCurve, CurveModuleState } from '../../bundles/curve/types';
import { glAnimation } from '../../typings/anim_types';
import MultiItemDisplay from '../common/multi_item_display';
import { DebuggerContext } from '../../typings/type_helpers';
import Curve3DAnimationCanvas from './3Dcurve_anim_canvas';
import CurveCanvas3D from './curve_canvas3d';
import AnimationCanvas from '../common/animation_canvas';
import WebGLCanvas from '../common/webgl_canvas';

export default {
  toSpawn: (context: DebuggerContext) => {
    const moduleContext = context.context?.moduleContexts.get('curve');
    if (moduleContext == null) {
      return false;
    }

    const moduleState = moduleContext.state as CurveModuleState;
    if (moduleState == null) {
      return false;
    }

    return moduleState.drawnCurves.length > 0;
  },
  body: (context: DebuggerContext) => {
    const moduleContext = context.context?.moduleContexts.get('curve');
    const moduleState = moduleContext!.state as CurveModuleState;

    const canvases = moduleState!.drawnCurves.map((curve, i) => {
      const elemKey = i.toString();

      if (glAnimation.isAnimation(curve)) {
        const anim = curve as AnimatedCurve;
        return anim.is3D ? (
          <Curve3DAnimationCanvas animation={anim} key={elemKey} />
        ) : (
          <AnimationCanvas animation={anim} key={elemKey} />
        );
      }
      const curveDrawn = curve as CurveDrawn;
      return curveDrawn.is3D() ? (
        <CurveCanvas3D curve={curveDrawn} key={elemKey} />
      ) : (
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
