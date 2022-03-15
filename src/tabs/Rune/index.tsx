import React from 'react';
import { Button } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import { DebuggerContext } from '../../typings/type_helpers';
import { Rune, RuneAnimation, RunesModuleState } from '../../bundles/rune/rune';

/**
 * tab for displaying runes
 * @author Hou Ruomu
 */

/**
 * React Component props for the Tab.
 */
type RunesTabProps = {
  children?: never;
  className?: never;
  debuggerContext: DebuggerContext;
};

/**
 * React Component state for the Tab.
 */
type State = {
  currentStep: number;
};

/**
 * The main React Component of the Tab.
 */
/* eslint-disable react/destructuring-assignment */
class WebGLCanvas extends React.Component<RunesTabProps, State> {
  private runesToDraw: (Rune | RuneAnimation)[];

  constructor(props: RunesTabProps | Readonly<RunesTabProps>) {
    super(props);
    this.state = {
      currentStep: 0,
    };

    const moduleContext = this.props.debuggerContext.context.moduleContexts.get(
      'rune'
    );
    if (moduleContext == null) {
      this.runesToDraw = [];
    } else {
      this.runesToDraw = (moduleContext.state as RunesModuleState).drawnRunes;
    }
  }

  private firstStep = () => this.state.currentStep === 0;

  private finalStep = () =>
    this.state.currentStep === this.runesToDraw.length - 1;

  private onPrevButtonClick = () => {
    this.setState((state) => ({ currentStep: state.currentStep - 1 }));
  };

  private onNextButtonClick = () => {
    this.setState((state) => ({ currentStep: state.currentStep + 1 }));
  };

  /**
   * This function sets the layout of the React Component in HTML
   * @returns HTMLComponent
   */
  public render() {
    const runeToDraw = this.runesToDraw[this.state.currentStep];

    return (
      <div>
        {this.runesToDraw.length > 1 ? (
          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <Button
              style={{
                position: 'absolute',
                left: 0,
              }}
              large
              outlined
              icon={IconNames.ARROW_LEFT}
              onClick={this.onPrevButtonClick}
              disabled={this.firstStep()}
            >
              Previous
            </Button>
            <h3 className='bp3-text-large'>
              Call {this.state.currentStep + 1}/{this.runesToDraw.length}
            </h3>
            <Button
              style={{
                position: 'absolute',
                right: 0,
              }}
              large
              outlined
              icon={IconNames.ARROW_RIGHT}
              onClick={this.onNextButtonClick}
              disabled={this.finalStep()}
            >
              Next
            </Button>
          </div>
        ) : null}
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
            ref={(r) => {
              if (r) {
                runeToDraw.draw(r);
              }
            }}
            width={512}
            height={512}
          />
        </div>
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
