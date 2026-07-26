/* [Imports] */
import {
  CSG_CHANNEL_ID,
  CSG_WEB_ID,
  deserializeSolid,
  type CsgChannelMessage,
  type CsgDownloadMessage,
  type CsgRenderMessage
} from '@sourceacademy/bundle-csg/protocol';
import type { ITabService, Tab } from '@sourceacademy/common-tabs';
import {
  checkIsPluginClass,
  type IChannel,
  type IConduit,
  type IPlugin
} from '@sourceacademy/conductor/conduit';
import MultiItemDisplay from '@sourceacademy/modules-lib/tabs/MultiItemDisplay/index';
import { createElement, useMemo, useSyncExternalStore } from 'react';
import save from 'save-file';
import CanvasHolder from './canvas_holder';
import type { RenderedScene } from './jscad/renderer';

/* [Main] */
function RenderedCsg({ message, componentNumber }: { message: CsgRenderMessage, componentNumber: number }) {
  const scene = useMemo((): RenderedScene => ({
    solids: message.solids.map(deserializeSolid),
    hasGrid: message.hasGrid,
    hasAxis: message.hasAxis
  }), [message]);

  return <CanvasHolder componentNumber={componentNumber} scene={scene} />;
}

export function CsgTab({ messages }: { messages: readonly CsgRenderMessage[] }) {
  const canvases = messages.map((message, index) => (
    <RenderedCsg
      message={message}
      componentNumber={index + 1}
      key={index.toString()}
    />
  ));

  return <MultiItemDisplay elements={canvases} />;
}

export const CSG_TAB_ID = 'csg';

/* [Exports] */
// eslint-disable-next-line @sourceacademy/tab-type
export default class CsgTabPlugin implements IPlugin {
  readonly id = CSG_WEB_ID;
  static readonly channelAttach = [CSG_CHANNEL_ID];

  private readonly __csgChannel: IChannel<CsgChannelMessage>;
  private readonly __tabService: ITabService;
  private readonly __listeners = new Set<() => void>();
  private __messages: readonly CsgRenderMessage[] = [];

  private readonly __handleMessage = (message: CsgChannelMessage) => {
    if (message.type === 'request') return;

    if (message.type === 'download') {
      // Triggering a download needs an anchor element to click, which only
      // exists here on the browser's main thread - the runner serializes the
      // STL and hands us the buffers.
      void this.__download(message);
      return;
    }

    this.__messages = [...this.__messages, message];
    this.__emit();
    this.__tabService.showTab(CSG_TAB_ID);
  };

  constructor(
    _conduit: IConduit,
    [csgChannel]: IChannel<any>[],
    tabService: ITabService
  ) {
    if (!csgChannel) {
      throw new Error('CSG channel is required but was not provided.');
    }

    this.__csgChannel = csgChannel as IChannel<CsgChannelMessage>;
    this.__tabService = tabService;

    const subscribe = (listener: () => void) => this.subscribe(listener);
    const getMessages = () => this.getMessages();
    function CsgPluginTab() {
      const messages = useSyncExternalStore(subscribe, getMessages);
      return createElement(CsgTab, { messages });
    }

    const tab = {
      id: CSG_TAB_ID,
      iconName: 'shapes',
      body: createElement(CsgPluginTab),
      label: 'CSG Tab',
      disabled: false
    } satisfies Tab;

    this.__tabService.registerTab(tab);
    this.__csgChannel.subscribe(this.__handleMessage);
    // Ask the runner to replay anything it displayed before we existed
    this.__csgChannel.send({ type: 'request' });
  }

  getMessages(): readonly CsgRenderMessage[] {
    return this.__messages;
  }

  subscribe(listener: () => void): () => void {
    this.__listeners.add(listener);
    return () => this.__listeners.delete(listener);
  }

  destroy(): void {
    this.__csgChannel.unsubscribe(this.__handleMessage);
  }

  private async __download(message: CsgDownloadMessage): Promise<void> {
    await save(new Blob(message.data), message.filename);
  }

  private __emit(): void {
    this.__listeners.forEach(listener => listener());
  }
}
checkIsPluginClass(CsgTabPlugin);
