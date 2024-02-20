import { connect, MqttClient } from 'mqtt/dist/mqtt';

export const STATE_CONNECTED = 'Connected';
export const STATE_DISCONNECTED = 'Disconnected';
export const STATE_RECONNECTED = 'Reconnected';
export const STATE_OFFLINE = 'Offline';

/**
 * Abstraction of MQTT.
 *
 * @param connectionCallback Callback when the connection state changed.
 * @param messageCallback Callback when a message has been received.
 */
export class MqttController {
  private client: MqttClient | null = null;
  private connected: boolean = false;
  private connectionCallback: (status: string) => void;
  private messageCallback: (topic: string, message: string) => void;

  address: string = '';
  port: number = 8080;

  constructor(
    connectionCallback: (status: string) => void,
    messageCallback: (topic: string, message: string) => void,
  ) {
    this.connectionCallback = connectionCallback;
    this.messageCallback = messageCallback;
  }

  /**
   * Sets up MQTT client link and connects to it.
   * Also handles connection status callbacks.
   */
  public connectClient() {
    if (this.connected || this.address.length === 0) return;
    let link = 'wss://' + this.address + ':' + this.port + '/mqtt';
    this.client = connect(link);
    this.connected = true;
    this.client.on('connect', () => {
      this.connectionCallback(STATE_CONNECTED);
    });
    this.client.on('disconnect', () => {
      this.connectionCallback(STATE_DISCONNECTED);
    });
    this.client.on('reconnect', () => {
      this.connectionCallback(STATE_RECONNECTED);
    });
    this.client.on('offline', () => {
      this.connectionCallback(STATE_OFFLINE);
    });
    this.client.on('message', (topic, message) => {
      this.messageCallback(topic, new TextDecoder('utf-8').decode(message));
    });
  }

  /**
   * Disconnects the MQTT client.
   */
  public disconnect() {
    if (this.client == null) return;
    this.client.end(true);
    this.connectionCallback = () => {};
    this.messageCallback = () => {};
  }

  /**
   * Broadcasts message to topic.
   * QoS of 1, all listening devices receive the message at least once.
   *
   * @param topic Identifier for group of devices to broadcast to.
   * @param message Message to broadcast.
   * @param isRetain Whether the message should be retained.
   */
  public publish(topic: string, message: string, isRetain: boolean) {
    this.client?.publish(topic, message, {
      qos: 1,
      retain: isRetain,
    });
  }

  /**
   * Subscribes to a topic.
   *
   * @param topic Identifier for group of devices receiving the broadcast.
   */
  public subscribe(topic: string) {
    if (this.client == null) return;
    this.client.subscribe(topic);
  }

  /**
   * Unsubscribes from a topic.
   *
   * @param topic Identifier for group of devices receiving the broadcast.
   */
  public unsubscribe(topic: string) {
    this.client?.unsubscribe(topic);
  }
}
