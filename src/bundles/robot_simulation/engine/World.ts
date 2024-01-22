import { type Controller, ControllerGroup } from './Core/Controller';
import { TimeStampedEvent, TypedEventTarget } from './Core/Events';
import { type Physics } from './Physics';
import { type Renderer } from './Render/Renderer';
import { type Timer } from './Core/Timer';

export const worldStates = [
  'unintialized',
  'loading',
  'ready',
  'running',
] as const;
export type WorldState = (typeof worldStates)[number];

type WorldEventMap = {
  worldStart: Event;
  worldStateChange: Event;
  beforePhysicsUpdate: TimeStampedEvent;
  afterPhysicsUpdate: TimeStampedEvent;
  beforeRender: TimeStampedEvent;
  afterRender: TimeStampedEvent;
};

export class World extends TypedEventTarget<WorldEventMap> {
  state: WorldState;
  physics: Physics;
  render: Renderer;
  timer: Timer;
  controllers: ControllerGroup;

  constructor(physics: Physics, render: Renderer, timer: Timer) {
    super();
    this.state = 'unintialized';
    this.physics = physics;
    this.render = render;
    this.timer = timer;
    this.controllers = new ControllerGroup();
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

    this.addEventListener('beforePhysicsUpdate', (e) => {
      controllers.forEach((controller) => {
        controller.fixedUpdate?.(this.physics.configuration.timestep);
      });
    });
  }

  async init() {
    this.setState('loading');
    await this.physics.start();
    this.dispatchTypedEvent('worldStart', new Event('worldStart'));
    this.setState('ready');
  }

  private setState(newState: WorldState) {
    if (this.state !== newState) {
      this.dispatchTypedEvent(
        'worldStateChange',
        new Event('worldStateChange'),
      );
      this.state = newState;
    }
  }

  pause() {
    this.setState('ready');
    this.timer.pause();
  }

  start() {
    if (this.state === 'ready') {
      this.setState('running');
      window.requestAnimationFrame(this.step.bind(this));
    }
  }

  step(timestamp: number) {
    const frameTimingInfo = this.timer.step(timestamp);

    // Update physics
    this.dispatchTypedEvent(
      'beforePhysicsUpdate',
      new TimeStampedEvent('beforePhysicsUpdate', frameTimingInfo),
    );

    this.physics.step(frameTimingInfo);
    this.dispatchTypedEvent(
      'afterPhysicsUpdate',
      new TimeStampedEvent('afterPhysicsUpdate', frameTimingInfo),
    );


    // Update render
    this.dispatchTypedEvent(
      'beforeRender',
      new TimeStampedEvent('beforeRender', frameTimingInfo),
    );
    this.render.step(frameTimingInfo);
    this.dispatchTypedEvent(
      'afterRender',
      new TimeStampedEvent('afterRender', frameTimingInfo),
    );


    if (this.state === 'running') {
      window.requestAnimationFrame(this.step.bind(this));
    }
  }
}
