import { TypedEventTarget } from "../../Core/Events";

class StringEvent extends Event {
  public data: string;

  constructor(type: string, data: string) {
    super(type);
    this.data = data;
  }
}

class NumberEvent extends Event {
  public data: number;

  constructor(type: string, data: number) {
    super(type);
    this.data = data;
  }
}

interface EventMap {
  event1: StringEvent;
  event2: NumberEvent;
}

describe("TypedEventTarget", () => {
  let eventTarget: TypedEventTarget<EventMap>;

  beforeEach(() => {
    eventTarget = new TypedEventTarget<EventMap>();
  });

  test("addEventListener adds a listener for the specified event type", () => {
    const listener = jest.fn();
    eventTarget.addEventListener("event1", listener);
    const event = new StringEvent("event1", "Hello");
    eventTarget.dispatchEvent("event1", event);
    expect(listener).toHaveBeenCalledWith(event);
  });

  test("addEventListener adds multiple listeners for the same event type", () => {
    const listener1 = jest.fn();
    const listener2 = jest.fn();
    eventTarget.addEventListener("event1", listener1);
    eventTarget.addEventListener("event1", listener2);
    const event = new StringEvent("event1", "Hello");
    eventTarget.dispatchEvent("event1", event);
    expect(listener1).toHaveBeenCalledWith(event);
    expect(listener2).toHaveBeenCalledWith(event);
  });

  test("addEventListener adds listeners for different event types", () => {
    const listener1 = jest.fn();
    const listener2 = jest.fn();
    eventTarget.addEventListener("event1", listener1);
    eventTarget.addEventListener("event2", listener2);
    const event1 = new StringEvent("event1", "Hello");
    const event2 = new NumberEvent("event2", 42);
    eventTarget.dispatchEvent("event1", event1);
    eventTarget.dispatchEvent("event2", event2);
    expect(listener1).toHaveBeenCalledWith(event1);
    expect(listener2).toHaveBeenCalledWith(event2);
  });

  test("dispatchEvent dispatches the event to the registered listeners", () => {
    const listener1 = jest.fn();
    const listener2 = jest.fn();
    eventTarget.addEventListener("event1", listener1);
    eventTarget.addEventListener("event2", listener2);
    const event1 = new StringEvent("event1", "Hello");
    const event2 = new NumberEvent("event2", 42);
    eventTarget.dispatchEvent("event1", event1);
    eventTarget.dispatchEvent("event2", event2);
    expect(listener1).toHaveBeenCalledWith(event1);
    expect(listener2).toHaveBeenCalledWith(event2);
  });

  test("dispatchEvent returns true if there are listeners for the event type", () => {
    const listener = jest.fn();
    eventTarget.addEventListener("event1", listener);
    const event = new StringEvent("event1", "Hello");
    const result = eventTarget.dispatchEvent("event1", event);
    expect(result).toBe(true);
  });
});
