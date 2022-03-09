import { Button } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import React from 'react';
import { CurveDrawn } from '../../bundles/curve/curves_webgl';
import { CurveAnimation, CurveModuleState } from '../../bundles/curve/types';
import { DebuggerContext } from '../../typings/type_helpers';
import CurveCanvas from './curve_canvas';
import CurveCanvas3D, { AnimationCanvas } from './curve_canvas3d';

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

/* eslint-disable react/destructuring-assignment */
class WebGLCanvas extends React.Component<CurvesTabProps, CurvesTabState> {
  private curvesToDraw: (CurveAnimation | CurveDrawn)[];

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
    const curveToDraw = this.curvesToDraw[this.state.currentStep];

    let element: JSX.Element;
    if ((curveToDraw as CurveAnimation).numFrames !== undefined) {
      element = <AnimationCanvas animation={curveToDraw as CurveAnimation} />;
    } else if ((curveToDraw as CurveDrawn).is3D()) {
      element = <CurveCanvas3D curve={curveToDraw as CurveDrawn} />;
    } else {
      element = <CurveCanvas curve={curveToDraw as CurveDrawn} />;
    }

    return (
      <div>
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
          {element}
        </div>
      </div>
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
  label: 'Curves Tab',
  iconName: 'media', // See https://blueprintjs.com/docs/#icons for more options
};
