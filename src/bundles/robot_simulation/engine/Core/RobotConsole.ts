const logLevels = ['source', 'error'] as const;
type LogLevel = typeof logLevels[number];

export type LogEntry = {
  message: string;
  level: LogLevel;
  timestamp: number;
};

export class RobotConsole {
  logs: LogEntry[];

  constructor() {
    this.logs = [];
  }

  log(message: string, level) {
    this.logs.push({
      message,
      level,
      timestamp: Date.now(),
    });
  }

  getLogs() {
    return this.logs;
  }
}
