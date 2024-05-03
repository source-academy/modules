import { NumericInput } from '@blueprintjs/core';
import { type CSSProperties } from 'react';
import { type DefaultEv3 } from '../../../../bundles/robot_simulation/controllers';
import { TabWrapper } from './tabComponents/Wrapper';

const RowStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: '0.6rem',
};

export const MotorPidPanel: React.FC<{ ev3?: DefaultEv3 }> = ({ ev3 }) => {
  if (!ev3) {
    return (
      <TabWrapper>
        EV3 not found in context. Did you call saveToContext('ev3', ev3);
      </TabWrapper>
    );
  }

  const leftMotor = ev3.get('leftMotor');
  const rightMotor = ev3.get('rightMotor');

  if (!leftMotor || !rightMotor) {
    return <TabWrapper>Motor not found</TabWrapper>;
  }

  const onChangeProportional = (value: number) => {
    ev3.get('leftMotor').pid.proportionalGain = value;
    ev3.get('rightMotor').pid.proportionalGain = value;
  };
  const onChangeIntegral = (value: number) => {
    ev3.get('leftMotor').pid.integralGain = value;
    ev3.get('rightMotor').pid.integralGain = value;
  };
  const onChangeDerivative = (value: number) => {
    ev3.get('leftMotor').pid.derivativeGain = value;
    ev3.get('rightMotor').pid.derivativeGain = value;
  };

  return (
    <TabWrapper>
      <div style={RowStyle}>
        <span>Proportional Gain: </span>
        <NumericInput
          defaultValue={ev3.get('leftMotor').pid.proportionalGain}
          onValueChange={onChangeProportional}
          stepSize={0.01}
          minorStepSize={null}
        />
      </div>
      <div style={RowStyle}>
        <span>Integral Gain: </span>
        <NumericInput
          defaultValue={ev3.get('leftMotor').pid.integralGain}
          onValueChange={onChangeIntegral}
          stepSize={0.01}
          minorStepSize={null}
        />
      </div>
      <div style={RowStyle}>
        <span>Derivative Gain: </span>
        <NumericInput
          defaultValue={ev3.get('leftMotor').pid.derivativeGain}
          onValueChange={onChangeDerivative}
          stepSize={0.01}
          minorStepSize={null}
        />
      </div>
    </TabWrapper>
  );
};
