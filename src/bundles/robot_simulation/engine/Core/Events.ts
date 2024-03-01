export type Listener<EventMap, EventName extends keyof EventMap> = (
  event: EventMap[EventName]
) => void | Promise<void>;

type ValueIsEvent<EventMap> = {
  [EventName in keyof EventMap]: Event;
};

export class TypedEventTarget<EventMap extends ValueIsEvent<EventMap>> {
  private listeners: {
    [EventName in keyof EventMap]?: Array<Listener<EventMap, EventName>>;
  };

  constructor() {
    this.listeners = {};
  }

  addEventListener<EventName extends keyof EventMap & string>(
    type: EventName,
    listener: Listener<EventMap, EventName>,
  ): void {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    // Non-null assertion is safe because we just checked if it's undefined
    this.listeners[type]!.push(listener);
  }

  public dispatchEvent<EventName extends keyof EventMap>(
    _type: EventName,
    event: EventMap[EventName],
  ): boolean {
    const listeners = this.listeners[_type];
    if (listeners) {
      listeners.forEach((listener) => {
        listener(event);
      });
    }
    return true;
  }
}
