/* eslint-disable react/destructuring-assignment */
import { Button } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import React from 'react';

type Props = {
  elements: JSX.Element[];
};

type State = {
  currentStep: number;
};

export default class MultiItemDisplay extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.state = {
      currentStep: 0,
    };
  }

  private firstStep = () => this.state.currentStep === 0;

  private finalStep = () =>
    this.state.currentStep === this.props.elements.length - 1;

  private onPrevButtonClick = () => {
    this.setState((state) => ({ currentStep: state.currentStep - 1 }));
  };

  private onNextButtonClick = () => {
    this.setState((state) => ({ currentStep: state.currentStep + 1 }));
  };

  public render() {
    const elementToDraw = this.props.elements[this.state.currentStep];

    return (
      <div>
        {this.props.elements.length > 1 ? (
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
              Call {this.state.currentStep + 1}/{this.props.elements.length}
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
          {elementToDraw}
        </div>
      </div>
    );
  }
}
