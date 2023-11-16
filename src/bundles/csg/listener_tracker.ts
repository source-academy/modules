/* [Exports] */
export default class ListenerTracker {
  private listeners: [string, Function][] = [];

  constructor(private element: Element) {}

  addListener(
    eventType: string,
    listener: Function,
    options?: AddEventListenerOptions,
  ) {
    this.listeners.push([eventType, listener]);
    this.element.addEventListener(
      eventType,
      listener as EventListenerOrEventListenerObject,
      options,
    );
  }

  removeListeners() {
    this.listeners.forEach(([eventType, listener]) => {
      this.element.removeEventListener(
        eventType,
        listener as EventListenerOrEventListenerObject,
      );
    });
  }
}
