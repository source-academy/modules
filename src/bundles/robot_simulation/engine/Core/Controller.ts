import { type PhysicsTimingInfo } from '../Physics';

export interface Controller {
  name?: string;
  start?(): Promise<void> | void;
  update?(timingInfo: PhysicsTimingInfo): void;
  fixedUpdate?(timingInfo: PhysicsTimingInfo): void;
  onDestroy?(): void;
}

export class ControllerMap<M extends Record<string, Controller>>
implements Controller {
  map: M;
  callbacks?: Partial<Controller>;

  constructor(map: M, callbacks?: Partial<Controller>) {
    this.map = map;
    this.callbacks = callbacks;
  }

  get<K extends keyof M>(name: K): M[K] {
    return this.map[name];
  }

  async start(): Promise<void> {
    await this.callbacks?.start?.();
    await Promise.all(
      Object.values(this.map)
        .map(async (controller) => {
          await controller.start?.();
        }),
    );
  }

  update(timingInfo: PhysicsTimingInfo): void {
    this.callbacks?.update?.(timingInfo);
    Object.values(this.map)
      .forEach((controller) => {
        controller.update?.(timingInfo);
      });
  }

  fixedUpdate(timingInfo: PhysicsTimingInfo): void {
    this.callbacks?.fixedUpdate?.(timingInfo);
    Object.values(this.map)
      .forEach((controller) => {
        controller.fixedUpdate?.(timingInfo);
      });
  }

  onDestroy(): void {
    this.callbacks?.onDestroy?.();
    Object.values(this.map)
      .forEach((controller) => {
        controller.onDestroy?.();
      });
  }
}

export class ControllerGroup implements Controller {
  controllers: Controller[] = [];

  public addController(...controllers: Controller[]): void {
    this.controllers.push(...controllers);
  }

  async start?(): Promise<void> {
    await Promise.all(
      this.controllers.map(async (controller) => {
        await controller.start?.();
      }),
    );
  }

  update(timingInfo: PhysicsTimingInfo): void {
    this.controllers.forEach((controller) => {
      controller.update?.(timingInfo);
    });
  }

  fixedUpdate(timingInfo: PhysicsTimingInfo): void {
    this.controllers.forEach((controller) => {
      controller.fixedUpdate?.(timingInfo);
    });
  }

  onDestroy(): void {
    this.controllers.forEach((controller) => {
      controller.onDestroy?.();
    });
    this.controllers = [];
  }
}
