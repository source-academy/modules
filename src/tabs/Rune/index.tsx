import React from 'react';
import {
  drawAnaglyph,
  drawHollusion,
  drawRune,
} from '../../bundles/rune/runes_webgl';
import { RunesModuleState } from '../../bundles/rune/types';
import { DebuggerContext } from '../../type_helpers';

/**
 * tab for displaying runes
 * @author Hou Ruomu
 */

/**
 * React Component props for the Tab.
 * Provided by the template, nothing was changed.
 */
type RunesTabProps = {
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
/* eslint-disable react/destructuring-assignment */
class WebGLCanvas extends React.Component<RunesTabProps, State> {
  private $canvas: HTMLCanvasElement | null = null;

  constructor(props: RunesTabProps | Readonly<RunesTabProps>) {
    super(props);
    this.state = {};
  }

  /**
   * This function is called when the tab is created.
   * This is the entrypoint for the tab.
   */
  public componentDidMount() {
    if (this.$canvas) {
      const moduleContext = this.props.debuggerContext.context.moduleContexts.get(
        'rune'
      );
      if (moduleContext == null) {
        return;
      }

      const runeToDraw = (moduleContext.state as RunesModuleState)
        .drawnRunes[0];

      if (runeToDraw.drawMethod === 'anaglyph') {
        drawAnaglyph(this.$canvas, runeToDraw);
      } else if (runeToDraw.drawMethod === 'hollusion') {
        drawHollusion(this.$canvas, runeToDraw);
      } else if (runeToDraw.drawMethod === 'normal') {
        drawRune(this.$canvas, runeToDraw);
      } else {
        throw Error(`Unexpected Drawing Method ${runeToDraw.drawMethod}`);
      }
    }
  }

  /**
   * This function sets the layout of the React Component in HTML
   * Notice the the Canvas hook in "ref" property.
   * @returns HTMLComponent
   */
  public render() {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          paddingLeft: '20px',
          paddingRight: '20px',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <canvas
          id='runesCanvas'
          ref={(r) => {
            this.$canvas = r;
          }}
          width={512}
          height={512}
        />
      </div>
    );
  }
}

export default {
  /**
   * This function will be called to determine if the component will be
   * rendered. Currently spawns when there is at least one rune to be
   * displayed
   * @param {DebuggerContext} context
   * @returns {boolean}
   */
  toSpawn: (context: DebuggerContext) => {
    const moduleContext = context.context?.moduleContexts.get('rune');
    if (moduleContext == null) {
      return false;
    }

    const moduleState = moduleContext.state as RunesModuleState;
    if (moduleState == null) {
      return false;
    }

    return moduleState.drawnRunes.length > 0;
  },

  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  body: (context: DebuggerContext) => <WebGLCanvas debuggerContext={context} />,

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
