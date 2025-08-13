import { isHollusionRune, type RuneModuleState } from '@sourceacademy/bundle-rune/functions';
import AnimationCanvas from '@sourceacademy/modules-lib/tabs/AnimationCanvas';
import MultiItemDisplay from '@sourceacademy/modules-lib/tabs/MultiItemDisplay/index';
import WebGLCanvas from '@sourceacademy/modules-lib/tabs/WebGLCanvas';
import { defineTab, getModuleState } from '@sourceacademy/modules-lib/tabs/utils';
import { glAnimation, type ModuleTab } from '@sourceacademy/modules-lib/types';
import HollusionCanvas from './hollusion_canvas';

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

export default defineTab({
  toSpawn(context) {
    const drawnRunes = context.context?.moduleContexts?.rune?.state?.drawnRunes;
    return drawnRunes.length > 0;
  },
  body(context) {
    return <RuneTab context={context} />;
  },
  label: 'Runes Tab',
  iconName: 'group-objects'
});
