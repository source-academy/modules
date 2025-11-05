import { Button, EditableText } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import clamp from 'lodash/clamp';
import { useState } from 'react';

export interface MultiItemDisplayProps {
  elements: JSX.Element[];
  onStepChange?: (newIndex: number, oldIndex: number) => void;
};

/**
 * React Component for displaying multiple items
 * ![image](./image.png)
 */
export default function MultiItemDisplay(props: MultiItemDisplayProps) {
  // The actual index of the currently selected element
  const [currentStep, setCurrentStep] = useState(0);

  function changeStep(newIndex: number) {
    setCurrentStep(newIndex);
    if (props.onStepChange) {
      props.onStepChange(newIndex, currentStep);
    }
  }

  // State for managing the value of the editor
  const [stepEditorValue, setStepEditorValue] = useState('1');
  const [stepEditorFocused, setStepEditorFocused] = useState(false);

  const resetStepEditor = () => setStepEditorValue((currentStep + 1).toString());
  const elementsDigitCount = Math.floor(Math.log10(Math.max(1, props.elements.length))) + 1;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        // justifyContent: 'center',
        alignContent: 'center',
        height: '100vh',
        // transform: 'scale(0.75)',
        // marginTop: '-12vh'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          position: 'relative',
          marginBottom: 10
        }}
      >
        <Button
          style={{
            position: 'absolute',
            left: 0
          }}
          tabIndex={0}
          large
          outlined
          icon={IconNames.ARROW_LEFT}
          onClick={() => {
            changeStep(currentStep - 1);
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
              justifyContent: 'space-around'
            }}>
            Call&nbsp;
            {/* When the text box is focused, it shows a little up and down bar, which needs a little bit
              * more space to be shown
              */}
            <div style={{ width: `${stepEditorFocused ? elementsDigitCount + 2 : elementsDigitCount}ch` }}>
              <EditableText
                value={stepEditorValue}
                disabled={props.elements.length === 1}
                placeholder={undefined}
                selectAllOnFocus
                customInputAttributes={{
                  tabIndex: 0,
                }}
                onChange={(newValue) => {
                  // Disallow non numeric inputs
                  if (newValue && !/^[0-9]+$/u.test(newValue)) return;

                  // Disallow numbers that have too many digits
                  if (newValue.length > elementsDigitCount) return;
                  setStepEditorValue(newValue);
                } }
                onConfirm={(value) => {
                  if (value) {
                    const newStep = parseInt(value);
                    const clampedStep = clamp(newStep, 1, props.elements.length);

                    if (clampedStep - 1 !== currentStep) {
                      changeStep(clampedStep - 1);
                    }

                    setStepEditorFocused(false);
                    setStepEditorValue(clampedStep.toString());
                    return;
                  }

                  // If the input element is blank
                  // then reset it
                  resetStepEditor();

                  // Indicate that the editor is no longer focused
                  setStepEditorFocused(false);
                } }
                onCancel={() => {
                  resetStepEditor();
                  setStepEditorFocused(false);
                } }
                onEdit={() => setStepEditorFocused(true)} />
            </div>
            {stepEditorFocused && <>&nbsp;</>}/{props.elements.length}
          </div>
        </h3>
        <Button
          style={{
            position: 'absolute',
            right: 0
          }}
          large
          outlined
          icon={IconNames.ARROW_RIGHT}
          tabIndex={0}
          onClick={() => {
            changeStep(currentStep + 1);
            setStepEditorValue((currentStep + 2).toString());
          } }
          disabled={currentStep === props.elements.length - 1}
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
          justifyContent: 'center'
        }}
      >
        {props.elements[currentStep]}
      </div>
    </div>
  );
}
