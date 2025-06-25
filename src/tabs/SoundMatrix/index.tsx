import { Button, Classes } from '@blueprintjs/core';
import { defineTab } from '@sourceacademy/modules-lib/tabs';
import classNames from 'classnames';
import React from 'react';

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
              Classes.BUTTON_GROUP
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

export default defineTab({
  toSpawn: (context) => context.result.value === 'test',
  body: (context) => <SoundMatrix context={context} />,
  label: 'Sound Matrix',
  iconName: 'music'
});
