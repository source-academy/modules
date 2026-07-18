import { IconNames } from '@blueprintjs/icons';
import { CurveDrawn } from '@sourceacademy/bundle-curve/curves_webgl';
import {
  CURVE_CHANNEL_ID,
  CURVE_TAB_ID,
  CURVE_WEB_ID,
  type CurveChannelMessage,
  type CurveDisplayMessage,
  type SerializedCurveDrawn
} from '@sourceacademy/bundle-curve/protocol';
import type { ITabService, Tab } from '@sourceacademy/common-tabs';
import {
  checkIsPluginClass,
  type IChannel,
  type IConduit,
  type IPlugin
} from '@sourceacademy/conductor/conduit';
import AnimationCanvas from '@sourceacademy/modules-lib/tabs/AnimationCanvas';
import MultiItemDisplay from '@sourceacademy/modules-lib/tabs/MultiItemDisplay';
import WebGLCanvas from '@sourceacademy/modules-lib/tabs/WebGLCanvas';
import { glAnimation, type AnimFrame } from '@sourceacademy/modules-lib/types';
import { createElement, useMemo, useSyncExternalStore } from 'react';

import CurveCanvas3D from './canvas_3d_curve';
import Curve3DAnimationCanvas from './curve_3d_animation_canvas';

function deserializeCurveDrawn(serialized: SerializedCurveDrawn): CurveDrawn {
  return new CurveDrawn(
    serialized.drawMode,
    serialized.numPoints,
    serialized.space,
    serialized.drawCubeArray,
    serialized.curvePosArray,
    serialized.curveColorArray
  );
}

class SerializedCurveAnimation extends glAnimation {
  public angle = 0;
  public readonly is3D: boolean;

  constructor(private readonly message: Extract<CurveDisplayMessage, { type: 'animation' }>) {
    super(message.duration, message.fps);
    this.is3D = message.is3D;
  }

  getFrame(timestamp: number): AnimFrame {
    if (this.message.frames.length === 0) {
      return {
        draw: () => undefined
      };
    }

    const frame = Math.min(
      Math.floor(timestamp * this.message.fps),
      this.message.frames.length - 1
    );
    const curve = deserializeCurveDrawn(this.message.frames[frame]);

    return {
      draw: (canvas: HTMLCanvasElement) => {
        curve.init(canvas);
        curve.redraw(this.angle);
      }
    };
  }
}

function RenderedCurve({ message }: { message: Extract<CurveDisplayMessage, { type: 'render' }> }) {
  const curve = useMemo(() => deserializeCurveDrawn(message.curve), [message]);

  if (curve.is3D) {
    return <CurveCanvas3D curve={curve} />;
  }

  return (
    <WebGLCanvas
      ref={canvas => {
        if (canvas) {
          curve.init(canvas);
          curve.redraw(0);
        }
      }}
    />
  );
}

function RenderedAnimation({ message }: { message: Extract<CurveDisplayMessage, { type: 'animation' }> }) {
  const animation = useMemo(() => new SerializedCurveAnimation(message), [message]);
  return message.is3D
    ? <Curve3DAnimationCanvas animation={animation} />
    : <AnimationCanvas animation={animation} />;
}

export function CurveTab({ messages }: { messages: readonly CurveDisplayMessage[] }) {
  const canvases = messages.map((message, index) => {
    const key = index.toString();
    if (message.type === 'animation') {
      return <RenderedAnimation message={message} key={key} />;
    }
    return <RenderedCurve message={message} key={key} />;
  });

  return <MultiItemDisplay elements={canvases} />;
}

// eslint-disable-next-line @sourceacademy/tab-type
export default class CurveTabPlugin implements IPlugin {
  readonly id = CURVE_WEB_ID;
  static readonly channelAttach = [CURVE_CHANNEL_ID];

  private readonly __curveChannel: IChannel<CurveChannelMessage>;
  private readonly __tabService: ITabService;
  private readonly __listeners = new Set<() => void>();
  private __messages: readonly CurveDisplayMessage[] = [];

  private readonly __handleMessage = (message: CurveChannelMessage) => {
    if (message.type === 'request') return;
    this.__messages = [...this.__messages, message];
    this.__emit();
    this.__tabService.showTab(CURVE_TAB_ID);
  };

  constructor(
    _conduit: IConduit,
    [curveChannel]: IChannel<any>[],
    tabService: ITabService
  ) {
    if (!curveChannel) {
      throw new Error('Curve channel is required but was not provided.');
    }

    this.__curveChannel = curveChannel as IChannel<CurveChannelMessage>;
    this.__tabService = tabService;

    const subscribe = (listener: () => void) => this.subscribe(listener);
    const getMessages = () => this.getMessages();
    function CurvePluginTab() {
      const messages = useSyncExternalStore(subscribe, getMessages);
      return createElement(CurveTab, { messages });
    }

    const tab = {
      id: CURVE_TAB_ID,
      iconName: IconNames.MEDIA,
      body: createElement(CurvePluginTab),
      label: 'Curves Tab',
      disabled: false
    } satisfies Tab;

    this.__tabService.registerTab(tab);
    this.__curveChannel.subscribe(this.__handleMessage);
    this.__curveChannel.send({ type: 'request' });
  }

  getMessages(): readonly CurveDisplayMessage[] {
    return this.__messages;
  }

  subscribe(listener: () => void): () => void {
    this.__listeners.add(listener);
    return () => this.__listeners.delete(listener);
  }

  destroy(): void {
    this.__curveChannel.unsubscribe(this.__handleMessage);
    this.__tabService.unregisterTab(CURVE_TAB_ID);
  }

  private __emit(): void {
    this.__listeners.forEach(listener => listener());
  }
}
checkIsPluginClass(CurveTabPlugin);
export { CURVE_TAB_ID };
