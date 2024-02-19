import context from "js-slang/context";
import { MultiUserController } from "./MultiUserController";
import { GlobalStateController } from "./GlobalStateController";
import { RpcController } from "./RpcController";

class CommunicationModuleState {
  multiUser: MultiUserController;
  globalState: GlobalStateController | null = null;
  rpc: RpcController | null = null;

  constructor(address: string, port: number) {
    let multiUser = new MultiUserController();
    multiUser.setupController(address, port);
    this.multiUser = multiUser;
  }
}

let moduleState = new CommunicationModuleState("broker.hivemq.com", 8884);
context.moduleContexts.communication.state = moduleState;

// Loop

let interval: number | undefined = undefined;

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
  callback: (state: any) => void
) {
  moduleState.globalState = new GlobalStateController(
    topicHeader,
    moduleState.multiUser,
    callback
  );
}

/**
 * Obtains the current global state.
 *
 * @returns Current global state.
 */
export function getGlobalState() {
  return moduleState.globalState?.globalState;
}

/**
 * Broadcasts the new states to all devices.
 * Has ability to modify only part of the JSON state.
 *
 * @param path Path within the json state.
 * @param updatedState Replacement value at specified path.
 */
export function updateGlobalState(path: string, updatedState: any) {
  moduleState.globalState?.updateGlobalState(path, updatedState);
}

// Rpc

/**
 * Initializes RPC.
 *
 * @param topicHeader MQTT topic to use for rpc.
 * @param userId Identifier for this user.
 */
export function initRpc(topicHeader: string, userId?: string) {
  moduleState.rpc = new RpcController(
    topicHeader,
    moduleState.multiUser,
    userId
  );
}

/**
 * Exposes the specified function to other users.
 * Other users can use "callFunction" to call this function.
 *
 * @param name Identifier for the function.
 * @param func Function to call when request received.
 */
export function expose(name: string, func: (...args: any[]) => any) {
  moduleState.rpc?.expose(name, func);
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
  callback: (args: any[]) => void
) {
  moduleState.rpc?.callFunction(receiver, name, args, callback);
}
