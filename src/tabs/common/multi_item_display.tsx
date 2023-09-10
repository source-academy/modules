import { Button, EditableText } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { clamp } from 'lodash';
import { useState } from 'react';

type MultiItemDisplayProps = {
  elements: JSX.Element[]
};

const MultiItemDisplay = ({ elements }: MultiItemDisplayProps) => {
  // The actual index of the currently selected element
  const [currentStep, setCurrentStep] = useState(0);

  // State for managing the value of the editor
  const [stepEditorValue, setStepEditorValue] = useState('1');
  const [stepEditorFocused, setStepEditorFocused] = useState(false);

  const resetStepEditor = () => setStepEditorValue((currentStep + 1).toString());
  const elementsDigitCount = Math.floor(Math.log10(Math.max(1, elements.length))) + 1;

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
          onClick={() => {
            setCurrentStep(currentStep - 1);
            setStepEditorValue(currentStep.toString());
          }}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <h3 className="bp3-text-large">
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            Call&nbsp;
            {/* When the text box is focused, it shows a little up and down bar, which needs a little bit
              * more space to be shown
              */}
            <div style={{ width: `${stepEditorFocused ? elementsDigitCount + 2 : elementsDigitCount}ch` }}>
              <EditableText
                value={stepEditorValue}
                disabled={elements.length === 1}
                placeholder={undefined}
                type="number"
                onChange={(newValue) => {
                  // Disallow non numeric inputs
                  if (newValue && !/^[0-9]+$/u.test(newValue)) return;

                  // Disallow numbers that have too many digits
                  if (newValue.length > elementsDigitCount) return;
                  setStepEditorValue(newValue);
                }}
                onConfirm={(value) => {
                  if (value) {
                    const newStep = Number.parseFloat(value);
                    const clampedStep = clamp(newStep, 1, elements.length);
                    setCurrentStep(clampedStep - 1);
                    setStepEditorFocused(false);
                    setStepEditorValue(clampedStep.toString());
                    return;
                  }

                  // If the input element is blank
                  // then reset it
                  resetStepEditor();

                  // Indicate that the editor is no longer focused
                  setStepEditorFocused(false);
                }}
                onCancel={() => {
                  resetStepEditor();
                  setStepEditorFocused(false);
                }}
                onEdit={() => setStepEditorFocused(true)}
              />
            </div>
            {stepEditorFocused && <>&nbsp;</>}/{elements.length}
          </div>
        </h3>
        <Button
          style={{
            position: 'absolute',
            right: 0,
          }}
          large
          outlined
          icon={IconNames.ARROW_RIGHT}
          onClick={() => {
            setCurrentStep(currentStep + 1);
            setStepEditorValue((currentStep + 2).toString());
          }}
          disabled={currentStep === elements.length - 1}
        >
          Next
        </Button>
      </div>
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
        {elements[currentStep]}
      </div>
    </div>
  );
};

export default MultiItemDisplay;
