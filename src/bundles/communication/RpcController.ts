import { type MultiUserController } from './MultiUserController';
import uniqid from 'uniqid';

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
    userId?: string,
  ) {
    this.topicHeader = topicHeader;
    this.multiUser = multiUser;
    this.userId = userId ?? uniqid();
    this.returnTopic = this.topicHeader + '_return/' + this.userId;
    this.multiUser.addMessageCallback(this.returnTopic, (topic, message) => {
      let messageJson = JSON.parse(message);
      let callId = messageJson.callId;
      let callback = this.pendingReturns.get(callId);
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
   * @param value Return value for function call.
   */
  private returnResponse(sender: string, callId: string, value: any) {
    let message = {
      callId: callId,
      result: value,
    };
    let topic = this.topicHeader + '_return/' + sender;
    this.multiUser.controller?.publish(topic, JSON.stringify(message), false);
  }

  /**
   * Exposes a function to other callers.
   *
   * @param name Name for the function, cannot include '/'.
   * @param func Function to run.
   */
  public expose(name: string, func: (...args: any[]) => any) {
    let item = {
      name: name,
      func: func,
    };
    this.functions.set(name, item);
    let functionTopic = this.topicHeader + '/' + this.userId + '/' + name;
    this.multiUser.addMessageCallback(functionTopic, (topic, message) => {
      let splitTopic = topic.split('/');
      if (splitTopic.length !== 3) {
        return;
      }
      let parsedMessage = JSON.parse(message);
      let callId = parsedMessage.callId;
      let sender = parsedMessage.sender;
      if (!callId || !sender) return;
      let calledName = splitTopic[2];
      let calledFunc = this.functions.get(calledName);
      if (!calledFunc) {
        this.returnResponse(sender, callId, null);
        return;
      }
      try {
        let args = parsedMessage.args;
        let result = calledFunc?.func(...args);
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
    callback: (args: any[]) => void,
  ) {
    let topic = this.topicHeader + '/' + receiver + '/' + name;
    let callId = uniqid();
    this.pendingReturns.set(callId, callback);
    let messageJson = {
      sender: this.userId,
      callId: callId,
      args: args,
    };
    let messageString = JSON.stringify(messageJson);
    this.multiUser.controller?.publish(topic, messageString, false);
  }
}
