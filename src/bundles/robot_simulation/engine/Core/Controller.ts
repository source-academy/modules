import { type FrameTimingInfo } from './Timer';

export interface Controller {
  start?(): Promise<void> | void;
  update?(deltaTime: FrameTimingInfo): void;
  fixedUpdate?(fixedDeltaTime: number): void;
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

  update(deltaTime: FrameTimingInfo): void {
    this.callbacks?.update?.(deltaTime);
    Object.values(this.map)
      .forEach((controller) => {
        controller.update?.(deltaTime);
      });
  }

  fixedUpdate(fixedDeltaTime: number): void {
    this.callbacks?.fixedUpdate?.(fixedDeltaTime);
    Object.values(this.map)
      .forEach((controller) => {
        controller.fixedUpdate?.(fixedDeltaTime);
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

  start(): void {
    this.controllers.forEach((controller) => {
      controller.start?.();
    });
  }

  update(deltaTime: FrameTimingInfo): void {
    this.controllers.forEach((controller) => {
      controller.update?.(deltaTime);
    });
  }

  fixedUpdate(fixedDeltaTime: number): void {
    this.controllers.forEach((controller) => {
      controller.fixedUpdate?.(fixedDeltaTime);
    });
  }

  onDestroy(): void {
    this.controllers.forEach((controller) => {
      controller.onDestroy?.();
    });
    this.controllers = [];
  }
}
