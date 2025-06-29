import { connect, type MqttClient, type QoS } from 'mqtt/dist/mqtt';
// Need to use "mqtt/dist/mqtt" as "mqtt" requires global, which SA's compiler does not define.

export const STATE_CONNECTED = 'Connected';
export const STATE_DISCONNECTED = 'Disconnected';
export const STATE_RECONNECTING = 'Reconnecting';
export const STATE_OFFLINE = 'Offline';

/**
 * Abstraction of MQTT for web.
 * Simplifies connection process to allow only WebSocket, as web app does not support MQTT over TCP.
 * Combines callbacks for status change and decodes message to utf8.
 *
 * @param connectionCallback Callback when the connection state changed.
 * @param messageCallback Callback when a message has been received.
 */
export class MqttController {
  private client: MqttClient | null = null;
  private connectionCallback: (status: string) => void;
  private messageCallback: (topic: string, message: string) => void;

  address: string = '';
  port: number = 443;
  user: string = '';
  password: string = '';

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
  public async connectClient() {
    if (this.client !== null) return;
    if (this.address.length === 0) return;
    const link = `wss://${this.user}:${this.password}@${this.address}:${this.port}/mqtt`;
    this.client = connect(link);
    this.client.on('connect', () => {
      this.connectionCallback(STATE_CONNECTED);
    });
    this.client.on('disconnect', () => {
      this.connectionCallback(STATE_DISCONNECTED);
    });
    this.client.on('reconnect', () => {
      this.connectionCallback(STATE_RECONNECTING);
    });
    this.client.on('offline', () => {
      this.connectionCallback(STATE_OFFLINE);
    });
    this.client.on('message', (topic, message) => {
      const decoder = new TextDecoder('utf-8');
      this.messageCallback(topic, decoder.decode(message));
    });
  }

  /**
   * Disconnects the MQTT client.
   */
  public disconnect() {
    if (this.client) {
      this.client.end(true);
    }
    this.client = null;
    this.connectionCallback = () => {};
    this.messageCallback = () => {};
  }

  /**
   * Broadcasts message to topic.
   *
   * @param topic Identifier for group of devices to broadcast to.
   * @param message Message to broadcast.
   * @param isRetain Whether the message should be retained.
   * @param qos 0: Receiver might not receive
   *            1: Receiver might receive more than once
   *            2: Receiver will receive once and only once
   */
  public publish(
    topic: string,
    message: string,
    isRetain: boolean,
    qos: QoS = 1,
  ) {
    this.client?.publish(topic, message, {
      qos,
      retain: isRetain,
    });
  }

  /**
   * Subscribes to a topic.
   * Qos of 1 to prevent downgrading.
   *
   * @param topic Identifier for group of devices receiving the broadcast.
   * @param qos 0: Not guaranteed to receive every message
   *            1: Receive each message at least once
   *            2: Receive each message once and only once
   */
  public subscribe(topic: string, qos: QoS = 1) {
    if (this.client) {
      this.client.subscribe(topic, { qos });
    }
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
