import { type LogEntry, type RobotConsole } from '../../../../bundles/robot_simulation/engine/Core/RobotConsole';
import { useFetchFromSimulation } from '../../hooks/fetchFromSimulation';
import { LastUpdated, getTimeString } from './tabComponents/LastUpdated';


const getLogString = (log: LogEntry) => {
  const logLevelText :Record<LogEntry['level'], string> = {
    source: 'Runtime Source Error',
    error: 'Error',
  };

  const timeString = getTimeString(new Date(log.timestamp));
  return `[${timeString}] ${logLevelText[log.level]}: ${log.message}`;
};

export const ConsolePanel = ({
  robot_console,
}: {
  robot_console?: RobotConsole;
}) => {
  const [timing, logs] = useFetchFromSimulation(() => {
    if (robot_console === undefined) {
      return null;
    }
    return robot_console.getLogs();
  }, 1000);

  if (timing === null) {
    return <div>Not fetched yet</div>;
  }

  if (logs === null) {
    return (
      <div>
        Console not found. Ensure that the world is initialized properly.
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div>
        <LastUpdated time={timing} />
        <p>There is currently no logs</p>
      </div>
    );
  }

  return (
    <div>
      <LastUpdated time={timing} />
      <ul>
        {logs.map((log, i) => <li key={i}>{getLogString(log)}</li>)}
      </ul>
    </div>
  );
};
