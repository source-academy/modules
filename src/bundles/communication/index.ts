/**
 * Module for communication between multiple devices.
 *
 * Offers 2 modes:
 * 1. RPC - Call functions on another device.
 * 2. Global State - Maintain a global state on all devices.
 *
 * @module communication
 * @author Chong Wen Hao
 */

export {
  STATE_CONNECTED,
  STATE_DISCONNECTED,
  STATE_OFFLINE,
  STATE_RECONNECTING as STATE_RECONNECTED,
} from './MqttController';

export {
  initCommunications,
  initCommunicationsSecure,
  initCommunicationsPrivate,
  initGlobalState,
  getGlobalState,
  updateGlobalState,
  initRpc,
  expose,
  callFunction,
  keepRunning,
  stopRunning,
} from './Communications';
