import { MqttController, STATE_DISCONNECTED } from "./MqttController";

export function createMultiUser() {
  return new MultiUserController();
}

/**
 * Controller with implementation of MQTT.
 * Required by both GlobalStateController and RpcController.
 */
export class MultiUserController {
  controller: MqttController | null = null;
  connectionState: string = STATE_DISCONNECTED;
  messageCallbacks: Map<string, (topic: string, message: string) => void> =
    new Map();

  /**
   * Sets up and connect to the MQTT link.
   * Uses websocket implementation.
   *
   * @param address Address to connect to.
   * @param port MQTT port number.
   */
  public setupController(address: string, port: number) {
    let currentController = this.controller;
    if (currentController !== null) {
      currentController.disconnect();
      this.connectionState = STATE_DISCONNECTED;
    } else {
      currentController = new MqttController(
        (status: string) => {
          this.connectionState = status;
        },
        (topic: string, message: string) => {
          let splitTopic = topic.split("/");
          this.messageCallbacks.forEach((callback, identifier) => {
            let splitIdentifier = identifier.split("/");
            if (splitTopic.length < splitIdentifier.length) return;
            for (let i = 0; i < splitIdentifier.length; i++) {
              if (splitIdentifier[i] !== splitTopic[i]) return;
            }
            callback(topic, message);
          });
        }
      );
      this.controller = currentController;
    }
    currentController.address = address;
    currentController.port = port;
    currentController.connectClient();
  }

  /**
   * Adds a callback for a particular topic.
   *
   * @param identifier Topic header for group.
   * @param callback Callback called when message for topic is received.
   */
  public addMessageCallback(
    identifier: string,
    callback: (topic: string, message: string) => void
  ) {
    this.controller?.subscribe(identifier + "/#");
    this.messageCallbacks.set(identifier, callback);
  }
}
