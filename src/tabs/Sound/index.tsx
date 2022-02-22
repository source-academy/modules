/* eslint-disable @typescript-eslint/no-unused-vars, jsx-a11y/media-has-caption */
import React from 'react';
import { AudioPlayed, SoundsModuleState } from '../../bundles/sound/types';
import { DebuggerContext } from '../../type_helpers';
// import sounds from '../../bundles/sounds';

/**
 * Tab for Source Academy Sounds Module
 * @author Koh Shang Hui
 * @author Samyukta Sounderraman
 */

/**
 * React Component props for the Tab.
 */
type SoundsTabProps = {
  children?: never;
  className?: never;
  debuggerContext: DebuggerContext;
};

/**
 * React Component state for the Tab.
 */
type State = {};

/**
 * The main React Component of the Tab.
 */
class Sounds extends React.Component<SoundsTabProps, State> {
  private $audio: HTMLAudioElement | null = null;

  constructor(props: SoundsTabProps | Readonly<SoundsTabProps>) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    if (this.$audio) {
      // eslint-disable-next-line react/destructuring-assignment
      const moduleContext = this.props.debuggerContext.context.moduleContexts.get(
        'sound'
      );
      if (moduleContext == null) {
        return;
      }

      const audioToPlay = (moduleContext.state as SoundsModuleState)
        .audioPlayed[0];

      audioToPlay.init(this.$audio);
    }
  }

  public render() {
    return (
      <div>
        <p id='sound-default-text'>
          The sound tab gives you control over your custom sounds. You can play,
          pause, adjust the volume and download your sounds.
          <br />
          <br />
          <audio
            ref={(r) => {
              this.$audio = r;
            }}
            src=''
            controls
            id='sound-tab-player'
            style={{ width: '100%' }}
          />
          <br />
        </p>
      </div>
    );
  }
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
  body: (context: DebuggerContext) => <Sounds debuggerContext={context} />,

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
