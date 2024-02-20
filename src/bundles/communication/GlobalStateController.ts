import { type MultiUserController } from './MultiUserController';

/**
 * Controller for maintaining a global state across all devices.
 * Depends on MQTT implementation in MultiUserController.
 *
 * @param topicHeader Identifier for all global state messages, must not include '/'.
 * @param multiUser Instance of multi user controller.
 * @param callback Callback called when the global state changes.
 */
export class GlobalStateController {
  private topicHeader: string;
  private multiUser: MultiUserController;
  private callback: (state: any) => void;
  globalState: any;

  constructor(
    topicHeader: string,
    multiUser: MultiUserController,
    callback: (state: any) => void,
  ) {
    this.topicHeader = topicHeader;
    this.multiUser = multiUser;
    this.callback = callback;
    this.setupGlobalState();
  }

  /**
   * Sets up callback for global state messages.
   * Parses received message and stores it as global state.
   */
  private setupGlobalState() {
    if (this.topicHeader.length <= 0) return;
    this.multiUser.addMessageCallback(this.topicHeader, (topic, message) => {
      let shortenedTopic = topic.substring(
        this.topicHeader.length,
        topic.length,
      );
      this.parseGlobalStateMessage(shortenedTopic, message);
    });
  }

  public parseGlobalStateMessage(shortenedTopic: string, message: string) {
    let preSplitTopic = shortenedTopic.trim();
    if (preSplitTopic.length === 0) {
      try {
        this.setGlobalState(JSON.parse(message));
      } catch {
        this.setGlobalState(undefined);
      }
      return;
    }
    if (!preSplitTopic.startsWith('/')) {
      preSplitTopic = '/' + preSplitTopic;
    }
    let splitTopic = preSplitTopic.split('/');
    try {
      let newGlobalState = { ...this.globalState };
      if (
        this.globalState instanceof Array ||
        typeof this.globalState === 'string'
      ) {
        newGlobalState = {};
      }
      let currentJson = newGlobalState;
      for (let i = 1; i < splitTopic.length - 1; i++) {
        let subTopic = splitTopic[i];
        if (
          !(currentJson[subTopic] instanceof Object) ||
          currentJson[subTopic] instanceof Array ||
          typeof currentJson[subTopic] === 'string'
        ) {
          currentJson[subTopic] = {};
        }
        currentJson = currentJson[subTopic];
      }
      if (message === undefined || message.length === 0) {
        delete currentJson[splitTopic[splitTopic.length - 1]];
      } else {
        let jsonMessage = JSON.parse(message);
        currentJson[splitTopic[splitTopic.length - 1]] = jsonMessage;
      }
      this.setGlobalState(newGlobalState);
    } catch {}
  }

  /**
   * Sets the new global state and calls the callback to notify changes.
   *
   * @param newState New state received.
   */
  private setGlobalState(newState: any) {
    this.globalState = newState;
    this.callback(newState);
  }

  /**
   * Broadcasts the new states to all devices.
   * Has ability to modify only part of the JSON state.
   *
   * @param path Path within the json state.
   * @param updatedState Replacement value at specified path.
   */
  public updateGlobalState(path: string, updatedState: any) {
    if (this.topicHeader.length === 0) return;
    let topic = this.topicHeader;
    if (path.length !== 0 && !path.startsWith('/')) {
      topic += '/';
    }
    topic += path;
    this.multiUser.controller?.publish(
      topic,
      JSON.stringify(updatedState),
      false,
    );
  }
}
