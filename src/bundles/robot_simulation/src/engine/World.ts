import { ProgramError } from '../controllers/program/error';
import { ControllerGroup, type Controller } from './Core/Controller';
import { TypedEventTarget } from './Core/Events';
import type { RobotConsole } from './Core/RobotConsole';
import type { Timer } from './Core/Timer';
import { TimeStampedEvent, type Physics } from './Physics';

export const worldStates = [
  'unintialized',
  'loading',
  'ready',
  'running',
  'error',
] as const;
export type WorldState = (typeof worldStates)[number];

type WorldEventMap = {
  worldStart: Event;
  worldStateChange: Event;
  beforeRender: TimeStampedEvent;
  afterRender: TimeStampedEvent;
};

/** Ticks the world loop at roughly the display refresh rate `requestAnimationFrame` used to
 * drive it at. A worker has no `window`/`requestAnimationFrame` (see World's doc history in
 * PR #947) - a plain interval is the direct, low-risk substitute: physics itself still steps at
 * its own configured timestep via Physics's accumulator (see Physics.ts), this just sets how
  often that accumulator gets a chance to drain. */
const TICK_INTERVAL_MS = 1000 / 60;

export class World extends TypedEventTarget<WorldEventMap> {
  state: WorldState;
  physics: Physics;
  timer: Timer;
  robotConsole: RobotConsole;
  controllers: ControllerGroup;

  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(physics: Physics, timer: Timer, robotConsole: RobotConsole) {
    super();
    this.state = 'unintialized';
    this.physics = physics;
    this.timer = timer;
    this.controllers = new ControllerGroup();
    this.robotConsole = robotConsole;
  }

  addController(...controllers: Controller[]) {
    this.controllers.addController(...controllers);

    this.addEventListener('worldStart', () => {
      controllers.forEach((controller) => {
        controller.start?.();
      });
    });

    this.addEventListener('beforeRender', (e) => {
      controllers.forEach((controller) => {
        controller.update?.(e.frameTimingInfo);
      });
    });

    this.physics.addEventListener('beforePhysicsUpdate', (e) => {
      controllers.forEach((controller) => {
        controller.fixedUpdate?.(e.frameTimingInfo);
      });
    });
  }

  async init() {
    this.setState('loading');
    await this.physics.start();
    this.dispatchEvent('worldStart', new Event('worldStart'));
    this.setState('ready');
  }

  private setState(newState: WorldState) {
    if (this.state !== newState) {
      this.dispatchEvent('worldStateChange', new Event('worldStateChange'));
      this.state = newState;
    }
  }

  pause() {
    this.setState('ready');
    this.timer.pause();
    this.stopInterval();
  }

  start() {
    if (this.state === 'ready') {
      this.setState('running');
      this.intervalId ??= setInterval(() => this.step(performance.now()), TICK_INTERVAL_MS);
    }
  }

  private stopInterval() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  step(timestamp: number) {
    try {
      const frameTimingInfo = this.timer.step(timestamp);

      const physicsTimingInfo = this.physics.step(frameTimingInfo);

      this.dispatchEvent(
        'beforeRender',
        new TimeStampedEvent('beforeRender', physicsTimingInfo)
      );
      this.dispatchEvent(
        'afterRender',
        new TimeStampedEvent('afterRender', physicsTimingInfo)
      );
    } catch (e) {
      console.log('Error caught', e);
      if (e instanceof Error) {
        this.robotConsole.log(e.message, 'error');
      } else if (e instanceof ProgramError) {
        this.robotConsole.log(e.message, 'source');
      } else {
        // e is not an error. Just log a generic error message
        this.robotConsole.log('An error occurred', 'error');
      }
      this.setState('error');
      this.stopInterval();
    }
  }
}
