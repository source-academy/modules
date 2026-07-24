import { DrawnAnaglyphRune, DrawnHollusionRune, isHollusionRune } from '@sourceacademy/bundle-rune/functions';
import {
  RUNE_CHANNEL_ID,
  RUNE_WEB_ID,
  type RuneChannelMessage,
  type RuneDisplayMessage,
  type SerializedRune
} from '@sourceacademy/bundle-rune/protocol';
import { DrawnNormalRune, Rune } from '@sourceacademy/bundle-rune/rune';
import type { ITabService, Tab } from '@sourceacademy/common-tabs';
import {
  checkIsPluginClass,
  type IChannel,
  type IConduit,
  type IPlugin
} from '@sourceacademy/conductor/conduit';
import AnimationCanvas from '@sourceacademy/modules-lib/tabs/AnimationCanvas';
import MultiItemDisplay from '@sourceacademy/modules-lib/tabs/MultiItemDisplay/index';
import WebGLCanvas from '@sourceacademy/modules-lib/tabs/WebGLCanvas';
import { glAnimation, type AnimFrame } from '@sourceacademy/modules-lib/types';
import type { mat4 } from 'gl-matrix';
import { createElement, useMemo, useSyncExternalStore } from 'react';

import HollusionCanvas from './hollusion_canvas';

function imageFromUrl(url: string): HTMLImageElement {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = url;
  return image;
}

function deserializeRune(serialized: SerializedRune): Rune {
  return Rune.of({
    vertices: new Float32Array(serialized.vertices),
    colors: serialized.colors === null ? null : new Float32Array(serialized.colors),
    transformMatrix: new Float32Array(serialized.transformMatrix) as unknown as mat4,
    subRunes: serialized.subRunes.map(deserializeRune),
    texture: serialized.textureUrl === null ? null : imageFromUrl(serialized.textureUrl),
    hollusionDistance: serialized.hollusionDistance
  });
}

class SerializedRuneAnimation extends glAnimation {
  constructor(private readonly message: Extract<RuneDisplayMessage, { type: 'animation' }>) {
    super(message.duration, message.fps);
  }

  getFrame(timestamp: number): AnimFrame {
    if (this.message.frames.length === 0) {
      return {
        draw: new DrawnNormalRune(Rune.of()).draw
      };
    }

    const frame = Math.min(
      Math.floor(timestamp * this.message.fps),
      this.message.frames.length - 1
    );
    const rune = deserializeRune(this.message.frames[frame]);
    const drawnRune = this.message.mode === 'anaglyph'
      ? new DrawnAnaglyphRune(rune)
      : new DrawnNormalRune(rune);

    return {
      draw: drawnRune.draw
    };
  }
}

function RenderedRune({ message }: { message: Extract<RuneDisplayMessage, { type: 'render' }> }) {
  const rune = useMemo(() => deserializeRune(message.rune), [message]);
  const drawnRune = useMemo(() => {
    if (message.mode === 'anaglyph') return new DrawnAnaglyphRune(rune);
    if (message.mode === 'hollusion') return new DrawnHollusionRune(rune, message.magnitude ?? 0.1);
    return new DrawnNormalRune(rune);
  }, [message, rune]);

  if (isHollusionRune(drawnRune)) {
    return <HollusionCanvas rune={drawnRune} />;
  }

  return (
    <WebGLCanvas
      ref={canvas => {
        if (canvas) {
          drawnRune.draw(canvas);
        }
      }}
    />
  );
}

function RenderedAnimation({ message }: { message: Extract<RuneDisplayMessage, { type: 'animation' }> }) {
  const animation = useMemo(() => new SerializedRuneAnimation(message), [message]);
  return <AnimationCanvas animation={animation} />;
}

export function RuneTab({ messages }: { messages: readonly RuneDisplayMessage[] }) {
  const runeCanvases = messages.map((message, index) => {
    const key = index.toString();
    if (message.type === 'animation') {
      return <RenderedAnimation message={message} key={key} />;
    }
    return <RenderedRune message={message} key={key} />;
  });

  return <MultiItemDisplay elements={runeCanvases} />;
}

export const RUNE_TAB_ID = 'rune';

// eslint-disable-next-line @sourceacademy/tab-type
export default class RuneTabPlugin implements IPlugin {
  readonly id = RUNE_WEB_ID;
  static readonly channelAttach = [RUNE_CHANNEL_ID];

  private readonly __runeChannel: IChannel<RuneChannelMessage>;
  private readonly __tabService: ITabService;
  private readonly __listeners = new Set<() => void>();
  private __messages: readonly RuneDisplayMessage[] = [];

  private readonly __handleMessage = (message: RuneChannelMessage) => {
    if (message.type === 'request') return;
    this.__messages = [...this.__messages, message];
    this.__emit();
    this.__tabService.showTab(RUNE_TAB_ID);
  };

  constructor(
    _conduit: IConduit,
    [runeChannel]: IChannel<any>[],
    tabService: ITabService
  ) {
    if (!runeChannel) {
      throw new Error('Rune channel is required but was not provided.');
    }

    this.__runeChannel = runeChannel as IChannel<RuneChannelMessage>;
    this.__tabService = tabService;

    const subscribe = (listener: () => void) => this.subscribe(listener);
    const getMessages = () => this.getMessages();
    function RunePluginTab() {
      const messages = useSyncExternalStore(subscribe, getMessages);
      return createElement(RuneTab, { messages });
    }

    const tab = {
      id: RUNE_TAB_ID,
      iconName: 'group-objects',
      body: createElement(RunePluginTab),
      label: 'Runes Tab',
      disabled: false
    } satisfies Tab;

    this.__tabService.registerTab(tab);
    this.__runeChannel.subscribe(this.__handleMessage);
    this.__runeChannel.send({ type: 'request' });
  }

  getMessages(): readonly RuneDisplayMessage[] {
    return this.__messages;
  }

  subscribe(listener: () => void): () => void {
    this.__listeners.add(listener);
    return () => this.__listeners.delete(listener);
  }

  destroy(): void {
    this.__runeChannel.unsubscribe(this.__handleMessage);
  }

  private __emit(): void {
    this.__listeners.forEach(listener => listener());
  }
}
checkIsPluginClass(RuneTabPlugin);
