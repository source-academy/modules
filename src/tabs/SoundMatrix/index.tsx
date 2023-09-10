import classNames from 'classnames';
import React from 'react';
import { Button, Classes } from '@blueprintjs/core';

/**
 * Tab for Sound Matrix
 * @author Samyukta Sounderraman
 * @author Koh Shang Hui
 */

/**
 * React Component props for the Tab.
 */
type Props = {
  children?: never;
  className?: never;
  context?: any;
};

/**
 * React Component state for the Tab.
 */
type State = {};

/**
 * The main React Component of the Tab.
 */
class SoundMatrix extends React.Component<Props, State> {
  private $container: HTMLElement | null = null;

  constructor(props) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    if ((window as any).ToneMatrix) {
      (window as any).ToneMatrix.initialise_matrix(this.$container!);
    }
  }

  public shouldComponentUpdate() {
    return false;
  }

  public handleClear = () => {
    (window as any).ToneMatrix.clear_matrix();
  };

  public handleRandomise = () => {
    (window as any).ToneMatrix.randomise_matrix();
  };

  public render() {
    return (
      <div className="sa-tone-matrix">
        <div className="row">
          <div
            className={classNames(
              'controls',
              'col-xs-12',
              Classes.DARK,
              Classes.BUTTON_GROUP,
            )}
          >
            <Button id="clear-matrix" onClick={this.handleClear}>
              Clear
            </Button>
            <Button id="randomise-matrix" onClick={this.handleRandomise}>
              Randomise
            </Button>
          </div>
        </div>
        <div className="row">
          <div
            className="col-xs-12"
            ref={(r) => {
              this.$container = r;
            }}
          />
        </div>
      </div>
    );
  }
}

export default {
  /**
   * This function will be called to determine if the component will be
   * rendered. Currently spawns when the result in the REPL is "test".
   * @param {DebuggerContext} context
   * @returns {boolean}
   */
  toSpawn: (context: any) => context.result.value === 'test',

  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  body: (context: any) => <SoundMatrix context={context} />,

  /**
   * The Tab's icon tooltip in the side contents on Source Academy frontend.
   */
  label: 'Sound Matrix',

  /**
   * BlueprintJS IconName element's name, used to render the icon which will be
   * displayed in the side contents panel.
   * @see https://blueprintjs.com/docs/#icons
   */
  iconName: 'music',
};
