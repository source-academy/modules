import { NumericInput } from '@blueprintjs/core';
import { type CSSProperties } from 'react';
import { type DefaultEv3 } from '../../../../bundles/robot_simulation/controllers';
import { TabWrapper } from './tabComponents/Wrapper';

const RowStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: '0.6rem',
};

export const WheelPidPanel: React.FC<{ ev3?: DefaultEv3 }> = ({ ev3 }) => {
  if (!ev3) {
    return (
      <TabWrapper>
        EV3 not found in context. Did you call saveToContext('ev3', ev3);
      </TabWrapper>
    );
  }
  if (
    !ev3.get('backLeftWheel') ||
    !ev3.get('backRightWheel') ||
    !ev3.get('frontLeftWheel') ||
    !ev3.get('frontRightWheel')
  ) {
    return <TabWrapper>Wheel not found</TabWrapper>;
  }

  const onChangeProportional = (value: number) => {
    ev3.get('backLeftWheel').pid.proportionalGain = value;
    ev3.get('backRightWheel').pid.proportionalGain = value;
    ev3.get('frontLeftWheel').pid.proportionalGain = value;
    ev3.get('frontRightWheel').pid.proportionalGain = value;
  };
  const onChangeIntegral = (value: number) => {
    ev3.get('backLeftWheel').pid.integralGain = value;
    ev3.get('backRightWheel').pid.integralGain = value;
    ev3.get('frontLeftWheel').pid.integralGain = value;
    ev3.get('frontRightWheel').pid.integralGain = value;
  };
  const onChangeDerivative = (value: number) => {
    ev3.get('backLeftWheel').pid.derivativeGain = value;
    ev3.get('backRightWheel').pid.derivativeGain = value;
    ev3.get('frontLeftWheel').pid.derivativeGain = value;
    ev3.get('frontRightWheel').pid.derivativeGain = value;
  };

  return (
    <TabWrapper>
      <div style={RowStyle}>
        <span>Proportional Gain: </span>
        <NumericInput
          defaultValue={ev3.get('backLeftWheel').pid.proportionalGain}
          onValueChange={onChangeProportional}
          stepSize={1}
          minorStepSize={null}
        />
      </div>
      <div style={RowStyle}>
        <span>Integral Gain: </span>
        <NumericInput
          defaultValue={ev3.get('backLeftWheel').pid.integralGain}
          onValueChange={onChangeIntegral}
          stepSize={0.01}
          minorStepSize={null}
        />
      </div>
      <div style={RowStyle}>
        <span>Derivative Gain: </span>
        <NumericInput
          defaultValue={ev3.get('backLeftWheel').pid.derivativeGain}
          onValueChange={onChangeDerivative}
          stepSize={0.01}
          minorStepSize={null}
        />
      </div>
    </TabWrapper>
  );
};
