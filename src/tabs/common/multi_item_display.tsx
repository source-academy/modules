/* eslint-disable react/destructuring-assignment */
import { Button } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import React from 'react';

const MultiItemDisplay = (props: { elements: JSX.Element[] }) => {
  const [currentStep, setCurrentStep] = React.useState(0);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        height: '100%',
      }}
    >
      {props.elements.length > 1 ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            position: 'relative',
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
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 0}
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
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={currentStep === props.elements.length - 1}
          >
            Next
          </Button>
        </div>
      ) : null}
      <div
        style={{
          width: '100%',
          paddingLeft: '20px',
          paddingRight: '20px',
          display: 'flex',
          alignContent: 'center',
          justifyContent: 'center',
        }}
      >
        {props.elements[currentStep]}
      </div>
    </div>
  );
};

export default MultiItemDisplay;
