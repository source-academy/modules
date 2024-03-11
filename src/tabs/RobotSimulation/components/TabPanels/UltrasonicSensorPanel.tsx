import { useEffect, useState } from 'react';
import { type DefaultEv3 } from '../../../../bundles/robot_simulation/controllers/ev3/ev3/default/ev3';

export const UltrasonicSensorPanel = ({ ev3 }: { ev3: DefaultEv3 }) => {
  const ultrasonicSensor = ev3.get('ultrasonicSensor');
  const [_, update] = useState(0);

  const distanceSensed = ultrasonicSensor.sense();

  useEffect(() => {
    // Hacky
    setInterval(() => {
      update((i) => i + 1);
    }, 1000);
  }, []);

  return (
    <>
      <div>
        <p>Distance: {distanceSensed}</p>
      </div>
    </>
  );
};
