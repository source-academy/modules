import uniqid from 'uniqid';
import { type MultiUserController } from './MultiUserController';

type DeclaredFunction = {
  name: string;
  func: (...args: any[]) => any;
};

/**
 * Controller for RPC communication between 2 devices.
 *
 * @param topicHeader Topic header for all RPC communication, must not include '/'.
 * @param multiUser Instance of multi user controller.
 * @param userId ID of the user, used for identifying caller/callee.
 */
export class RpcController {
  private topicHeader: string;
  private multiUser: MultiUserController;
  private userId: string;
  private functions = new Map<string, DeclaredFunction>();
  private pendingReturns = new Map<string, (args: any[]) => void>();
  private returnTopic: string;

  constructor(
    topicHeader: string,
    multiUser: MultiUserController,
    userId?: string
  ) {
    this.topicHeader = topicHeader;
    this.multiUser = multiUser;
    this.userId = userId ?? uniqid();
    this.returnTopic = `${this.topicHeader}_return/${this.userId}`;
    this.multiUser.addMessageCallback(this.returnTopic, (topic, message) => {
      const messageJson = JSON.parse(message);
      const callId = messageJson.callId;
      const callback = this.pendingReturns.get(callId);
      if (callback) {
        this.pendingReturns.delete(callId);
        callback(messageJson.result);
      }
    });
  }

  /**
   * Sends return value back to caller.
   *
   * @param sender ID of caller.
   * @param callId ID of function call.
   * @param result Return value for function call.
   */
  private returnResponse(sender: string, callId: string, result: any) {
    const message = {
      callId,
      result
    };
    const topic = `${this.topicHeader}_return/${sender}`;
    this.multiUser.controller?.publish(topic, JSON.stringify(message), false);
  }

  /**
   * Obtains user ID for RPC.
   *
   * @returns String user ID for the device.
   */
  public getUserId() {
    return this.userId;
  }

  /**
   * Exposes a function to other callers.
   *
   * @param name Name for the function, cannot include '/'.
   * @param func Function to run.
   */
  public expose(name: string, func: (...args: any[]) => any) {
    const item = {
      name,
      func
    };
    this.functions.set(name, item);
    const functionTopic = `${this.topicHeader}/${this.userId}/${name}`;
    this.multiUser.addMessageCallback(functionTopic, (topic, message) => {
      const splitTopic = topic.split('/');
      if (splitTopic.length !== 3) {
        return;
      }
      const parsedMessage = JSON.parse(message);
      const callId = parsedMessage.callId;
      const sender = parsedMessage.sender;
      if (!callId || !sender) return;
      const calledName = splitTopic[2];
      const calledFunc = this.functions.get(calledName);
      if (!calledFunc) {
        this.returnResponse(sender, callId, null);
        return;
      }
      try {
        const result = calledFunc?.func(...parsedMessage.args);
        this.returnResponse(sender, callId, result);
      } catch {
        this.returnResponse(sender, callId, null);
      }
    });
  }

  /**
   * Calls a function on another device.
   *
   * @param receiver ID of the callee.
   * @param name Name of the function to call.
   * @param args Argument values of the function.
   * @param callback Callback for return value received.
   */
  public callFunction(
    receiver: string,
    name: string,
    args: any[],
    callback: (args: any[]) => void
  ) {
    const topic = `${this.topicHeader}/${receiver}/${name}`;
    const callId = uniqid();
    this.pendingReturns.set(callId, callback);
    const messageJson = {
      sender: this.userId,
      callId,
      args
    };
    const messageString = JSON.stringify(messageJson);
    this.multiUser.controller?.publish(topic, messageString, false);
  }
}
