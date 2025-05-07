import { RobotConsole } from '../../Core/RobotConsole'; // Adjust the import path as necessary

describe('RobotConsole', () => {
  let robotConsole: RobotConsole;

  beforeEach(() => {
    robotConsole = new RobotConsole();
  });

  test('initially has an empty log array', () => {
    expect(robotConsole.getLogs()).toEqual([]);
  });

  test('adds a log entry with correct structure', () => {
    const message = 'Test message';
    const level = 'error';
    robotConsole.log(message, level);

    const logs = robotConsole.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0]).toHaveProperty('message', message);
    expect(logs[0]).toHaveProperty('level', level);
    expect(logs[0]).toHaveProperty('timestamp');
    expect(typeof logs[0].timestamp).toBe('number');
  });

  test('adds multiple log entries', () => {
    robotConsole.log('First message', 'source');
    robotConsole.log('Second message', 'error');

    const logs = robotConsole.getLogs();
    expect(logs.length).toBe(2);
    expect(logs[0].message).toBe('First message');
    expect(logs[1].message).toBe('Second message');
  });

  test('log entries have a timestamp in increasing order', () => {
    robotConsole.log('First message', 'source');
    const firstTimestamp = Date.now();
    robotConsole.log('Second message', 'error');

    const logs = robotConsole.getLogs();
    expect(logs[0].timestamp).toBeLessThanOrEqual(firstTimestamp);
    expect(logs[1].timestamp).toBeGreaterThanOrEqual(logs[0].timestamp);
  });
});
