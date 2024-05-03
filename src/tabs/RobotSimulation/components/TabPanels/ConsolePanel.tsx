import {
  type LogEntry,
  type RobotConsole,
} from '../../../../bundles/robot_simulation/engine/Core/RobotConsole';
import { useFetchFromSimulation } from '../../hooks/fetchFromSimulation';
import { LastUpdated, getTimeString } from './tabComponents/LastUpdated';
import { TabWrapper } from './tabComponents/Wrapper';

const getLogString = (log: LogEntry) => {
  const logLevelText: Record<LogEntry['level'], string> = {
    source: 'Runtime Source Error',
    error: 'Error',
  };

  const timeString = getTimeString(new Date(log.timestamp));
  return `[${timeString}] ${logLevelText[log.level]}: ${log.message}`;
};

export const ConsolePanel: React.FC<{
  robot_console: RobotConsole;
}> = ({ robot_console }) => {
  const [timing, logs] = useFetchFromSimulation(() => {
    if (robot_console === undefined) {
      return null;
    }
    return robot_console.getLogs();
  }, 1000);

  if (timing === null) {
    return <TabWrapper>Not fetched yet</TabWrapper>;
  }

  if (logs === null) {
    return (
      <TabWrapper>
        Console not found. Ensure that the world is initialized properly.
      </TabWrapper>
    );
  }

  if (logs.length === 0) {
    return (
      <TabWrapper>
        <LastUpdated time={timing} />
        <p>There is currently no logs</p>
      </TabWrapper>
    );
  }

  return (
    <TabWrapper>
      <LastUpdated time={timing} />
      <ul>
        {logs.map((log, i) => (
          <li key={i}>{getLogString(log)}</li>
        ))}
      </ul>
    </TabWrapper>
  );
};
