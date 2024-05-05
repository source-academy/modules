import React, { useEffect, useRef } from 'react';
import { type DefaultEv3 } from '../../../../bundles/robot_simulation/controllers/ev3/ev3/default/ev3';
import { useFetchFromSimulation } from '../../hooks/fetchFromSimulation';
import { LastUpdated } from './tabComponents/LastUpdated';
import { TabWrapper } from './tabComponents/Wrapper';

export const ColorSensorPanel: React.FC<{ ev3?: DefaultEv3 }> = ({ ev3 }) => {
  const colorSensor = ev3?.get('colorSensor');
  const sensorVisionRef = useRef<HTMLDivElement>(null);

  const [timing, color] = useFetchFromSimulation(() => {
    if (colorSensor === undefined) {
      return null;
    }
    return colorSensor.sense();
  }, 1000);

  useEffect(() => {
    if (colorSensor && sensorVisionRef.current) {
      sensorVisionRef.current.replaceChildren(
        colorSensor.renderer.getElement()
      );
    }
  }, [timing]);

  if (!ev3) {
    return <TabWrapper>EV3 not found in context. Did you call saveToContext('ev3', ev3);</TabWrapper>;
  }

  if (timing === null) {
    return <TabWrapper>Loading color sensor</TabWrapper>;
  }

  if (color === null) {
    return <TabWrapper>Color sensor not found</TabWrapper>;
  }

  return (
    <TabWrapper>
      <LastUpdated time={timing} />
      <div ref={sensorVisionRef}></div>
      <p>Red: {color.r}</p>
      <p>Green: {color.g}</p>
      <p>Blue: {color.b}</p>
    </TabWrapper>
  );
};
