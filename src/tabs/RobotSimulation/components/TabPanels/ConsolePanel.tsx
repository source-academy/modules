import { type RobotConsole } from '../../../../bundles/robot_simulation/engine/Core/RobotConsole';

export const ConsolePanel = ({ console: robot_console }: { console: RobotConsole }) => {
  if (robot_console === undefined) {
    return <div>
      <p>No console found in the context</p>
      <p>Instantiate a console and save it to context</p>
      <pre>const robot_console = createConsole();</pre>
      <pre>savetoContext("console", robot_console);</pre>
    </div>;
  }

  return <>hi</>;
};
