import { type RuneModuleState, isHollusionRune } from '../../bundles/rune/functions';
import { glAnimation } from '../../typings/anim_types';
import MultiItemDisplay from '../common/MultItemDisplay';
import { getModuleState, type DebuggerContext, type ModuleTab } from '../../typings/type_helpers';
import AnimationCanvas from '../common/AnimationCanvas';
import HollusionCanvas from './hollusion_canvas';
import WebGLCanvas from '../common/WebglCanvas';

export const RuneTab: ModuleTab = ({ context }) => {
  const { drawnRunes } = getModuleState<RuneModuleState>(context, 'rune');
  const runeCanvases = drawnRunes.map((rune, i) => {
    const elemKey = i.toString();

    if (glAnimation.isAnimation(rune)) {
      return (
        <AnimationCanvas animation={rune} key={elemKey} />
      );
    }
    if (isHollusionRune(rune)) {
      return (
        <HollusionCanvas rune={rune} key={elemKey} />
      );
    }
    return (
      <WebGLCanvas
        ref={(r) => {
          if (r) {
            rune.draw(r);
          }
        }}
        key={elemKey}
      />
    );
  });

  return <MultiItemDisplay elements={runeCanvases} />;
};

export default {
  /**
   * This function will be called to determine if the component will be
   * rendered. Currently spawns when there is at least one rune to be
   * displayed
   * @param {DebuggerContext} context
   * @returns {boolean}
   */
  toSpawn(context: DebuggerContext) {
    const drawnRunes = context.context?.moduleContexts?.rune?.state?.drawnRunes;
    return drawnRunes.length > 0;
  },

  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  body(context: DebuggerContext) {
    return <RuneTab context={context} />;
  },

  /**
   * The Tab's icon tooltip in the side contents on Source Academy frontend.
   */
  label: 'Runes Tab',

  /**
   * BlueprintJS IconName element's name, used to render the icon which will be
   * displayed in the side contents panel.
   * @see https://blueprintjs.com/docs/#icons
   */
  iconName: 'group-objects',
};
