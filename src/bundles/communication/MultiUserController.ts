import { MqttController, STATE_DISCONNECTED } from './MqttController';

/**
 * Controller with implementation of MQTT.
 * Required by both GlobalStateController and RpcController.
 */
export class MultiUserController {
  controller: MqttController | null = null;
  connectionState: string = STATE_DISCONNECTED;
  messageCallbacks: Map<string, (topic: string, message: string) => void> = new Map();

  /**
   * Sets up and connect to the MQTT link.
   * Uses websocket implementation.
   *
   * @param isPrivate Whether to use NUS private broker.
   * @param address Address to connect to.
   * @param port MQTT port number.
   * @param user Username of account, leave empty if not required.
   * @param password Password of account, leave empty if not required.
   */
  public setupController(
    address: string,
    port: number,
    user: string,
    password: string,
  ) {
    let currentController = this.controller;
    if (currentController) {
      currentController.disconnect();
      this.connectionState = STATE_DISCONNECTED;
    } else {
      currentController = new MqttController(
        (status: string) => {
          this.connectionState = status;
          console.log(status);
        },
        (topic: string, message: string) => {
          this.handleIncomingMessage(topic, message);
        },
      );
      this.controller = currentController;
    }
    currentController.address = address;
    currentController.port = port;
    currentController.user = user;
    currentController.password = password;
    currentController.connectClient();
  }

  /**
   * Parses topic and calls relevant callbacks with message.
   *
   * @param topic Topic of incoming message.
   * @param message Contents of incoming message.
   */
  handleIncomingMessage(topic: string, message: string) {
    const splitTopic = topic.split('/');
    this.messageCallbacks.forEach((callback, identifier) => {
      const splitIdentifier = identifier.split('/');
      if (splitTopic.length < splitIdentifier.length) return;
      for (let i = 0; i < splitIdentifier.length; i++) {
        if (splitIdentifier[i] !== splitTopic[i]) return;
      }
      callback(topic, message);
    });
  }

  /**
   * Adds a callback for a particular topic.
   *
   * @param identifier Topic header for group.
   * @param callback Callback called when message for topic is received.
   */
  public addMessageCallback(
    identifier: string,
    callback: (topic: string, message: string) => void,
  ) {
    this.controller?.subscribe(`${identifier}/#`);
    this.messageCallbacks.set(identifier, callback);
  }
}
