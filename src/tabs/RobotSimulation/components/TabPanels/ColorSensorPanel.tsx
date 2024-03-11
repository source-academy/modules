import { useEffect, useRef, useState } from 'react';
import { type DefaultEv3 } from '../../../../bundles/robot_simulation/controllers/ev3/ev3/default/ev3';

export const ColorSensorPanel = ({ ev3 }: { ev3: DefaultEv3 }) => {
  const colorSensor = ev3.get('colorSensor');
  const sensorVisionRef = useRef<HTMLDivElement>(null);
  const [_, update] = useState(0);
  const colorSensed = colorSensor.sense();

  useEffect(() => {
    if (sensorVisionRef.current) {
      sensorVisionRef.current.replaceChildren(colorSensor.renderer.getElement());
    }

    // Hacky
    setInterval(() => {
      update((i) => i + 1);
    }, 1000);
  }, []);

  return <>
    <div>
      <div ref={sensorVisionRef}></div>
      <p>Red: {colorSensed.r}</p>
      <p>Green: {colorSensed.g}</p>
      <p>Blue: {colorSensed.b}</p>
    </div>
  </>;
};
