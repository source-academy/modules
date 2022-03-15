/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars, jsx-a11y/media-has-caption */
import React from 'react';
import { SoundsModuleState } from '../../bundles/sound/types';
import MultiItemDisplay from '../../typings/multi_item';
import { DebuggerContext } from '../../typings/type_helpers';

/**
 * Tab for Source Academy Sounds Module
 * @author Koh Shang Hui
 * @author Samyukta Sounderraman
 */

type Props = {
  elements: JSX.Element[];
};

/**
 * React component for the Sounds Tab
 */
function soundsTab(props: Props) {
  return (
    <div>
      <p id='sound-default-text'>
        The sound tab gives you control over your custom sounds. You can play,
        pause, adjust the volume and download your sounds.
        <br />
        <br />
        <MultiItemDisplay elements={props.elements} />
        <br />
      </p>
    </div>
  );
}

export default {
  /**
   * This function will be called to determine if the component will be
   * rendered. Currently spawns when the result in the REPL is "test".
   * @returns {boolean}
   */
  toSpawn: (context: DebuggerContext) => {
    const moduleContext = context.context?.moduleContexts.get('sound');
    if (moduleContext == null) {
      return false;
    }

    const moduleState = moduleContext.state as SoundsModuleState;
    if (moduleState == null) {
      return false;
    }

    return moduleState.audioPlayed.length > 0;
  },
  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  body: (context: DebuggerContext) => {
    const moduleContext = context.context?.moduleContexts.get('sound');
    const moduleState = (moduleContext!.state as SoundsModuleState).audioPlayed;
    const elements = moduleState.map((audio) => (
      <audio
        src={audio.dataUri}
        controls
        id='sound-tab-player'
        style={{ width: '100%' }}
      />
    ));

    return soundsTab({ elements });
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
