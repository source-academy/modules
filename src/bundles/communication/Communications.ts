import context from 'js-slang/context';
import { MultiUserController } from './MultiUserController';
import { GlobalStateController } from './GlobalStateController';
import { RpcController } from './RpcController';

class CommunicationModuleState {
  multiUser: MultiUserController;
  globalState: GlobalStateController | null = null;
  rpc: RpcController | null = null;

  constructor(address: string, port: number) {
    const multiUser = new MultiUserController();
    multiUser.setupController(address, port);
    this.multiUser = multiUser;
  }
}

/**
 * Initializes connection with MQTT broker.
 * Currently only supports WebSocket.
 *
 * @param address Address of broker.
 * @param port WebSocket port number for broker.
 */
export function initCommunications(address: string, port: number) {
  if (getModuleState() instanceof CommunicationModuleState) {
    return;
  }
  const newModuleState = new CommunicationModuleState(address, port);
  context.moduleContexts.communication.state = newModuleState;
}

function getModuleState() {
  return context.moduleContexts.communication.state;
}

// Loop

let interval: number | undefined;

/**
 * Keeps the program running so that messages can come in.
 */
export function keepRunning() {
  interval = window.setInterval(() => {}, 20000);
}

/**
 * Removes interval that keeps the program running.
 */
export function stopRunning() {
  if (interval) {
    window.clearInterval(interval);
    interval = undefined;
  }
}

// Global State

/**
 * Initializes global state.
 *
 * @param topicHeader MQTT topic to use for global state.
 * @param callback Callback to receive updates of global state.
 */
export function initGlobalState(
  topicHeader: string,
  callback: (state: any) => void,
) {
  const moduleState = getModuleState();
  if (moduleState instanceof CommunicationModuleState) {
    if (moduleState.globalState instanceof GlobalStateController) {
      return;
    }
    moduleState.globalState = new GlobalStateController(
      topicHeader,
      moduleState.multiUser,
      callback,
    );
    return;
  }
  throw new Error('Error: Communication module not initialized.');
}

/**
 * Obtains the current global state.
 *
 * @returns Current global state.
 */
export function getGlobalState() {
  const moduleState = getModuleState();
  if (moduleState instanceof CommunicationModuleState) {
    return moduleState.globalState?.globalState;
  }
  throw new Error('Error: Communication module not initialized.');
}

/**
 * Broadcasts the new states to all devices.
 * Has ability to modify only part of the JSON state.
 *
 * @param path Path within the json state.
 * @param updatedState Replacement value at specified path.
 */
export function updateGlobalState(path: string, updatedState: any) {
  const moduleState = getModuleState();
  if (moduleState instanceof CommunicationModuleState) {
    moduleState.globalState?.updateGlobalState(path, updatedState);
    return;
  }
  throw new Error('Error: Communication module not initialized.');
}

// Rpc

/**
 * Initializes RPC.
 *
 * @param topicHeader MQTT topic to use for rpc.
 * @param userId Identifier for this user.
 */
export function initRpc(topicHeader: string, userId?: string) {
  const moduleState = getModuleState();
  if (moduleState instanceof CommunicationModuleState) {
    moduleState.rpc = new RpcController(
      topicHeader,
      moduleState.multiUser,
      userId,
    );
    return;
  }
  throw new Error('Error: Communication module not initialized.');
}

/**
 * Exposes the specified function to other users.
 * Other users can use "callFunction" to call this function.
 *
 * @param name Identifier for the function.
 * @param func Function to call when request received.
 */
export function expose(name: string, func: (...args: any[]) => any) {
  const moduleState = getModuleState();
  if (moduleState instanceof CommunicationModuleState) {
    moduleState.rpc?.expose(name, func);
    return;
  }
  throw new Error('Error: Communication module not initialized.');
}

/**
 * Calls a function exposed by another user.
 *
 * @param receiver Identifier for the user whose function we want to call.
 * @param name Identifier for function to call.
 * @param args Array of arguments to pass into the function.
 * @param callback Callback with return value.
 */
export function callFunction(
  receiver: string,
  name: string,
  args: any[],
  callback: (args: any[]) => void,
) {
  const moduleState = getModuleState();
  if (moduleState instanceof CommunicationModuleState) {
    moduleState.rpc?.callFunction(receiver, name, args, callback);
    return;
  }
  throw new Error('Error: Communication module not initialized.');
}
