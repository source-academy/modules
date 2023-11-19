import type { CurveModuleState } from '../../bundles/curve/types';
import { glAnimation } from '../../typings/anim_types';
import MultiItemDisplay from '../common/MultItemDisplay';
import { getModuleState, type DebuggerContext, type ModuleTab } from '../../typings/type_helpers';
import Curve3DAnimationCanvas from './animation_canvas_3d_curve';
import CurveCanvas3D from './canvas_3d_curve';
import AnimationCanvas from '../common/AnimationCanvas';
import WebGLCanvas from '../common/WebglCanvas';

export const CurveTab: ModuleTab = ({ context }) => {
  const { drawnCurves } = getModuleState<CurveModuleState>(context, 'curve');
  const canvases = drawnCurves.map((curve, i) => {
    const elemKey = i.toString();

    if (glAnimation.isAnimation(curve)) {
      return curve.is3D
        ? (
          <Curve3DAnimationCanvas animation={curve} key={elemKey} />
        )
        : (
          <AnimationCanvas animation={curve} key={elemKey} />
        );
    }
    return curve.is3D()
      ? (
        <CurveCanvas3D curve={curve} key={elemKey} />
      )
      : (
        <WebGLCanvas
          ref={(r) => {
            if (r) {
              curve.init(r);
              curve.redraw(0);
            }
          }}
          key={elemKey}
        />
      );
  });

  return <MultiItemDisplay elements={canvases} />;
};

export default {
  toSpawn(context: DebuggerContext) {
    const drawnCurves = context.context?.moduleContexts?.curve?.state?.drawnCurves;
    return drawnCurves.length > 0;
  },
  body(context: DebuggerContext) {
    return <CurveTab context={context} />;
  },
  label: 'Curves Tab',
  iconName: 'media', // See https://blueprintjs.com/docs/#icons for more options
};
