import { Button } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import React from 'react';
/*
 * Cannot import directly from react-hotkeys for some unknown reason
 * Referring to the fix posted here: https://github.com/evanw/esbuild/issues/1455
 */
import {
  configure,
  GlobalHotKeys,
  // eslint-disable-next-line import/extensions
} from 'react-hotkeys/es/react-hotkeys.production.min.js';
import { CurveModuleState, ShapeDrawn } from '../../bundles/curve/types';
import { DebuggerContext } from '../../type_helpers';
import CurveCanvas from './curve_canvas';
import CurveCanvas3D from './curve_canvas3d';

/**
 * Currently used for rendering HTML canvas element for curves.
 * The same tab will be used if we are trying ThreeJS Canvas in
 * the future.
 * @author Lee Zheng Han
 * @author Ng Yong Xiang
 */

type CurvesTabProps = {
  children?: never;
  className?: never;
  context: DebuggerContext;
};

type CurvesTabState = {
  currentStep: number;
};

const visualizerKeyMap = {
  PREVIOUS_STEP: 'left',
  NEXT_STEP: 'right',
};

/* eslint-disable react/destructuring-assignment */
class WebGLCanvas extends React.Component<CurvesTabProps, CurvesTabState> {
  private curvesToDraw: ShapeDrawn[];

  constructor(props: CurvesTabProps | Readonly<CurvesTabProps>) {
    super(props);

    this.state = {
      currentStep: 0,
    };

    const moduleContext = props.context.context.moduleContexts.get('curve');
    if (moduleContext == null) {
      this.curvesToDraw = [];
    } else {
      this.curvesToDraw = (moduleContext.state as CurveModuleState).drawnCurves;
    }
  }

  public componentDidMount() {
    // Set up GlobalHotKeys
    configure({
      ignoreEventsCondition: (event) =>
        (event.key === 'ArrowLeft' && this.firstStep()) ||
        (event.key === 'ArrowRight' && this.finalStep()),
      ignoreRepeatedEventsWhenKeyHeldDown: false,
      stopEventPropagationAfterIgnoring: false,
    });
  }

  private firstStep = () => this.state.currentStep === 0;

  private finalStep = () =>
    this.state.currentStep === this.curvesToDraw.length - 1;

  private onPrevButtonClick = () => {
    this.setState((state) => ({ currentStep: state.currentStep - 1 }));
  };

  private onNextButtonClick = () => {
    this.setState((state) => ({ currentStep: state.currentStep + 1 }));
  };

  public render() {
    const visualizerHandlers = {
      PREVIOUS_STEP: this.onPrevButtonClick,
      NEXT_STEP: this.onNextButtonClick,
    };

    const curveToDraw = this.curvesToDraw[this.state.currentStep];

    return (
      <GlobalHotKeys keyMap={visualizerKeyMap} handlers={visualizerHandlers}>
        {this.curvesToDraw.length > 1 ? (
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
              Call {this.state.currentStep + 1}/{this.curvesToDraw.length}
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
          {curveToDraw.is3D() ? (
            <CurveCanvas3D curve={curveToDraw} />
          ) : (
            <CurveCanvas curve={curveToDraw} />
          )}
        </div>
      </GlobalHotKeys>
    );
  }
}

export default {
  toSpawn: (context: DebuggerContext) => {
    const moduleContext = context.context?.moduleContexts.get('curve');
    if (moduleContext == null) {
      return false;
    }

    const moduleState = moduleContext.state as CurveModuleState;
    if (moduleState == null) {
      return false;
    }

    return moduleState.drawnCurves.length > 0;
  },
  body: (context: DebuggerContext) => <WebGLCanvas context={context} />,
  label: 'Curve Canvas',
  iconName: 'media', // See https://blueprintjs.com/docs/#icons for more options
};
