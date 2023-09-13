import type { SoundModuleState } from '../../bundles/sound/types';
import { getModuleState, type DebuggerContext, type ModuleTab } from '../../typings/type_helpers';
import MultiItemDisplay from '../common/MultItemDisplay';

/**
 * Tab for Source Academy Sounds Module
 * @author Koh Shang Hui
 * @author Samyukta Sounderraman
 */
const SoundTab: ModuleTab = ({ context }) => {
  const { audioPlayed } = getModuleState<SoundModuleState>(context, 'sound');

  const elements = audioPlayed.map((audio) => (
    <audio
      src={audio.dataUri}
      controls
      id="sound-tab-player"
      style={{ width: '100%' }}
    />
  ));

  return (
    <div>
      <p id="sound-default-text">
          The sound tab gives you control over your custom sounds. You can play,
          pause, adjust the volume and download your sounds.
      </p>
      <br />
      <br />
      <MultiItemDisplay elements={elements} />
      <br />
    </div>
  );
};

export default {
  /**
   * This function will be called to determine if the component will be
   * rendered.
   * @returns {boolean}
   */
  toSpawn(context: DebuggerContext) {
    const audioPlayed = context.context?.moduleContexts?.sound?.state?.audioPlayed;
    return audioPlayed.length > 0;
  },
  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  body(context: DebuggerContext) {
    return <SoundTab context={context} />;
  },

  /**
   * The Tab's icon tooltip in the side contents on Source Academy frontend.
   */
  label: 'Sounds',

  /**
   * BlueprintJS IconName element's name, used to render the icon which will be
   * displayed in the side contents panel.
   * @see https://blueprintjs.com/docs/#icons
   */
  iconName: 'music',
};
