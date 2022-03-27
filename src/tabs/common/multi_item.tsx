/* eslint-disable react/destructuring-assignment */
import { Button } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import React from 'react';

export default function multiItemDisplay(props: { elements: JSX.Element[] }) {
  const [currentStep, setCurrentStep] = React.useState(0);

  const firstStep = () => currentStep === 0;
  const finalStep = () => currentStep === props.elements.length - 1;
  const onPrevButtonClick = () => setCurrentStep(currentStep - 1);
  const onNextButtonClick = () => setCurrentStep(currentStep + 1);

  return (
    <div>
      {props.elements.length > 1 ? (
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
            onClick={onPrevButtonClick}
            disabled={firstStep()}
          >
            Previous
          </Button>
          <h3 className='bp3-text-large'>
            Call {currentStep + 1}/{props.elements.length}
          </h3>
          <Button
            style={{
              position: 'absolute',
              right: 0,
            }}
            large
            outlined
            icon={IconNames.ARROW_RIGHT}
            onClick={onNextButtonClick}
            disabled={finalStep()}
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
        {props.elements[currentStep]}
      </div>
    </div>
  );
}
