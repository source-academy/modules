import type { SoundModuleState } from '@sourceacademy/bundle-sound/types';
import MultiItemDisplay from '@sourceacademy/modules-lib/tabs/MultiItemDisplay/index';
import { defineTab, getModuleState } from '@sourceacademy/modules-lib/tabs/utils';
import type { ModuleTab } from '@sourceacademy/modules-lib/types';

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

export default defineTab({
  toSpawn(context) {
    const audioPlayed = context.context?.moduleContexts?.sound?.state?.audioPlayed;
    return audioPlayed.length > 0;
  },
  body(context) {
    return <SoundTab context={context} />;
  },
  label: 'Sounds',
  iconName: 'music'
});
