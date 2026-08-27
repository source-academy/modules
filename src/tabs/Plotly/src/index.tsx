import { IconNames } from '@blueprintjs/icons';
import { PLOTLY_CHANNEL_ID, PLOTLY_TAB_ID, PLOTLY_WEB_ID, type PlotlyChannelMessage, type PlotlyRenderMessage } from '@sourceacademy/bundle-plotly/protocol';
import type { ITabService, Tab } from '@sourceacademy/common-tabs';
import { checkIsPluginClass, type IChannel, type IConduit, type IPlugin } from '@sourceacademy/conductor/conduit';
import Modal from '@sourceacademy/modules-lib/tabs/ModalDiv';
import MultiItemDisplay from '@sourceacademy/modules-lib/tabs/MultiItemDisplay';
import { createElement, useState, useSyncExternalStore } from 'react';
import Plot from 'react-plotly.js';

export const PlotlyTab = ({ messages }: { messages: readonly PlotlyRenderMessage[] }) => {
  const [selectedPlot, setSelectedPlot] = useState<PlotlyRenderMessage | null>(null);
  return <div>
    <Modal
      open={selectedPlot !== null}
      height='90vh'
      width='80vw'
      handleClose={() => setSelectedPlot(null)}
    >
      <>{selectedPlot && <Plot data={[selectedPlot.data]} layout={selectedPlot.layout} />}</>

    </Modal>
    <MultiItemDisplay
      elements={messages.map((drawnPlot, id) => {
        const key = `plot-${id}`;
        return (
          <div style={{
            height: '80vh',
            marginBottom: '5vh',
            width: '100%',
          }} key={key}>
            <div onClick={() => setSelectedPlot(drawnPlot)}
              style={{
                cursor: 'pointer',
                padding: '5px 10px',
                backgroundColor: '#474F5E',
                border: '1px solid #aaa',
                borderRadius: '4px',
                display: 'inline-block'
              }}
            >Popout plot</div>
            <>{drawnPlot && <Plot data={[drawnPlot.data]} layout={drawnPlot.layout} />}</>
          </div>
        );
      })}
    />

  </div>;
};

// eslint-disable-next-line @sourceacademy/tab-type
export default class PlotlyTabPlugin implements IPlugin {
  readonly id = PLOTLY_WEB_ID;
  static readonly channelAttach = [PLOTLY_CHANNEL_ID];

  private readonly __plotlyChannel: IChannel<PlotlyChannelMessage>;
  private readonly __tabService: ITabService;
  private readonly __listeners = new Set<() => void>();
  private __messages: readonly PlotlyRenderMessage[] = [];

  private readonly __handleMessage = (message: PlotlyChannelMessage) => {
    if (message.type === 'request') return;
    this.__messages = [...this.__messages, message];
    this.__emit();
    this.__tabService.showTab(PLOTLY_TAB_ID);
  };

  constructor(
    _conduit: IConduit,
    [plotlyChannel]: IChannel<any>[],
    tabService: ITabService
  ) {
    if (!plotlyChannel) {
      throw new Error('Plotly channel is required but was not provided.');
    }

    this.__plotlyChannel = plotlyChannel as IChannel<PlotlyChannelMessage>;
    this.__tabService = tabService;

    const subscribe = (listener: () => void) => this.subscribe(listener);
    const getMessages = () => this.getMessages();
    function PlotlyPluginTab() {
      const messages = useSyncExternalStore(subscribe, getMessages);
      return createElement(PlotlyTab, { messages });
    }

    const tab = {
      id: PLOTLY_TAB_ID,
      iconName: IconNames.SCATTER_PLOT,
      body: createElement(PlotlyPluginTab),
      label: 'Plotly Tab',
      disabled: false
    } satisfies Tab;
    this.__tabService.registerTab(tab);
    this.__plotlyChannel.subscribe(this.__handleMessage);
    this.__plotlyChannel.send({ type: 'request' });
  }

  getMessages(): readonly PlotlyRenderMessage[] {
    return this.__messages;
  }

  subscribe(listener: () => void): () => void {
    this.__listeners.add(listener);
    return () => this.__listeners.delete(listener);
  }

  destroy(): void {
    this.__plotlyChannel.unsubscribe(this.__handleMessage);
  }

  private __emit(): void {
    this.__listeners.forEach(listener => listener());
  }
}
checkIsPluginClass(PlotlyTabPlugin);
export { PLOTLY_TAB_ID };
