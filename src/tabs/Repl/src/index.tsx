/**
 * Tab for Source Academy Programmable REPL module - host-side (browser main thread) counterpart
 * of `ReplModulePlugin` (in the repl bundle). Owns the actual editor/output DOM (AceEditor only
 * works here, not inside Conductor's runner Worker) and relays `run` requests back to the bundle
 * over {@link REPL_CHANNEL_ID}. Mirrors Sound/Matrix's tab shape (one plugin instance is both the
 * channel's subscriber and the tab's real state owner; the rendered React component is a thin
 * view over it) but uses a raw subscribe/send channel rather than `makeRpc`, since the bundle
 * pushes output/editor-props/program-text updates unprompted rather than replying to calls - see
 * the repl bundle's protocol.ts doc comment.
 * @module repl
 */
import { Button } from '@blueprintjs/core';
import {
  REPL_CHANNEL_ID,
  REPL_WEB_ID,
  type ReplChannelMessage,
  type ReplOutputEntry
} from '@sourceacademy/bundle-repl/protocol';
import type { ITabService, Tab } from '@sourceacademy/common-tabs';
import { checkIsPluginClass, type IChannel, type IConduit, type IPlugin } from '@sourceacademy/conductor/conduit';
import { throttle } from 'es-toolkit';
import { createElement, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-twilight';
import type { IAceEditor } from 'react-ace/lib/types';

export const REPL_TAB_ID = 'repl';

const BOX_PADDING_VALUE = 4;
const DEFAULT_EDITOR_HEIGHT = 375;
const MINIMUM_EDITOR_HEIGHT = 40;
const SAVED_CODE_STORAGE_KEY = 'programmable_repl_saved_editor_code';

const FONT_MESSAGE = {
  fontFamily: 'Inconsolata, Consolas, monospace',
  fontSize: '16px',
  fontWeight: 'normal'
};

// Module-level (not per-plugin-instance) throttle, same as the pre-Conductor implementation -
// a fresh ReplTabPlugin is constructed every Run, but there's no reason for that to reset the
// throttle window for a save that's purely about the browser's localStorage.
const saveProgramText = throttle((text: string) => {
  localStorage.setItem(SAVED_CODE_STORAGE_KEY, text);
}, 100);

interface ReplViewState {
  outputs: ReplOutputEntry[];
  backgroundImageUrl: string | null;
  backgroundColorAlpha: number;
  fontSize: number;
  programText: string;
}

/**
 * Host-side (browser main thread) counterpart of `ReplModulePlugin`. Actual AceEditor/DOM access
 * only works here, not inside Conductor's runner Worker.
 */
// eslint-disable-next-line @sourceacademy/tab-type
export default class ReplTabPlugin implements IPlugin {
  readonly id = REPL_WEB_ID;
  static readonly channelAttach = [REPL_CHANNEL_ID];

  private readonly __tabService: ITabService;
  private readonly __channel: IChannel<ReplChannelMessage>;
  private readonly __listeners = new Set<() => void>();

  private __state: ReplViewState;

  constructor(_conduit: IConduit, [channel]: IChannel<any>[], tabService: ITabService) {
    if (!channel) {
      throw new Error('Repl channel is required but was not provided.');
    }

    this.__tabService = tabService;
    this.__channel = channel as IChannel<ReplChannelMessage>;
    this.__state = {
      outputs: [],
      backgroundImageUrl: null,
      backgroundColorAlpha: 1,
      fontSize: 17,
      programText: localStorage.getItem(SAVED_CODE_STORAGE_KEY) ?? ''
    };

    this.__channel.subscribe(this.__handleMessage);
    // Asks the bundle to replay its backlog (output history, plus the latest editor_props/
    // set_program_text, if any) - without this, output produced before this tab was constructed
    // (or a tab recreated after unmount) would show nothing until the next interaction.
    this.__channel.send({ type: 'request' });

    const subscribe = (listener: () => void) => this.__subscribe(listener);
    const getState = () => this.__state;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const plugin = this;
    function ReplPluginTab() {
      const state = useSyncExternalStore(subscribe, getState);
      return createElement(ReplView, { plugin, state });
    }

    const tab = {
      id: REPL_TAB_ID,
      iconName: 'code',
      body: createElement(ReplPluginTab),
      label: 'Programmable Repl Tab',
      disabled: false
    } satisfies Tab;

    this.__tabService.registerTab(tab);
    this.__tabService.showTab(REPL_TAB_ID);
  }

  destroy(): void {
    // Called on every Run's teardown, well before the student is necessarily done reading output
    // or editing code in the tab - unregistering here would yank the tab away immediately. The
    // tab is left registered and gets replaced naturally when the next Run's ReplTabPlugin
    // re-registers under the same id, same as sound/matrix's tabs.
  }

  private __subscribe(listener: () => void): () => void {
    this.__listeners.add(listener);
    return () => this.__listeners.delete(listener);
  }

  private __emit(): void {
    this.__listeners.forEach(listener => listener());
  }

  private __setState(patch: Partial<ReplViewState>): void {
    this.__state = { ...this.__state, ...patch };
    this.__emit();
  }

  private readonly __handleMessage = (message: ReplChannelMessage): void => {
    switch (message.type) {
      case 'output':
        this.__setState({ outputs: [...this.__state.outputs, message.entry] });
        break;
      case 'editor_props':
        this.__setState({
          backgroundImageUrl: message.backgroundImageUrl,
          backgroundColorAlpha: message.backgroundColorAlpha,
          fontSize: message.fontSize
        });
        break;
      case 'set_program_text':
        this.__setProgramText(message.text);
        break;
      default:
        // 'run'/'request' are tab -> bundle messages, never received here - ReplChannelMessage's
        // union just describes the channel's full traffic in both directions (see protocol.ts).
        break;
    }
  };

  // Exposed for the view component - not part of the wire protocol, since typing doesn't push to
  // the bundle at all (only Run does); this only updates local view state and the localStorage
  // cache, matching the pre-Conductor implementation exactly.
  __setProgramText(text: string): void {
    this.__setState({ programText: text });
    saveProgramText(text);
  }

  // Exposed for the view component's Run button.
  __runCode(): void {
    this.__channel.send({ type: 'run', code: this.__state.programText });
  }
}
checkIsPluginClass(ReplTabPlugin);

interface ReplViewProps {
  plugin: ReplTabPlugin;
  state: ReplViewState;
}

function ReplView({ plugin, state }: ReplViewProps) {
  const [editorHeight, setEditorHeight] = useState(DEFAULT_EDITOR_HEIGHT);
  const editorAreaRef = useRef<HTMLDivElement | null>(null);
  const editorInstanceRef = useRef<IAceEditor | null>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !editorAreaRef.current) return;
      const rect = editorAreaRef.current.getBoundingClientRect();
      const height = Math.max(e.clientY - rect.top - BOX_PADDING_VALUE * 2, MINIMUM_EDITOR_HEIGHT);
      setEditorHeight(height);
      editorInstanceRef.current?.resize();
    };
    const onMouseUp = () => {
      isDraggingRef.current = false;
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const outputDivs = state.outputs.map((entry, index): React.ReactElement => {
    if (entry.outputMethod === 'richtext') {
      const style = entry.color === '' ? FONT_MESSAGE : { ...FONT_MESSAGE, color: entry.color };
      // eslint-disable-next-line react/no-array-index-key -- entries are only ever appended, never reordered/removed
      return <div key={index} style={style} dangerouslySetInnerHTML={{ __html: entry.content }} />;
    }

    const style = entry.color === '' ? FONT_MESSAGE : { ...FONT_MESSAGE, color: entry.color };
    // eslint-disable-next-line react/no-array-index-key -- entries are only ever appended, never reordered/removed
    return <div key={index} style={style}>{entry.content}</div>;
  });

  return (
    <div>
      <Button
        className="programmable-repl-button"
        icon="play"
        active
        onClick={() => plugin.__runCode()}
        text="Run"
      />
      <div
        ref={editorAreaRef}
        style={{
          padding: `${BOX_PADDING_VALUE}px`,
          border: '2px solid #6f8194'
        }}
      >
        <AceEditor
          ref={e => {
            if (e) {
              editorInstanceRef.current = e.editor;
              editorInstanceRef.current.setOptions({ fontSize: `${state.fontSize}pt` });
            }
          }}
          style={{
            width: '100%',
            height: `${editorHeight}px`,
            ...state.backgroundImageUrl !== null && {
              backgroundImage: `url(${state.backgroundImageUrl})`,
              backgroundColor: `rgba(20, 20, 20, ${state.backgroundColorAlpha})`,
              backgroundSize: '100%',
              backgroundRepeat: 'no-repeat'
            }
          }}
          mode="javascript"
          theme="twilight"
          onChange={text => plugin.__setProgramText(text)}
          value={state.programText}
        />
      </div>
      <div
        onMouseDown={e => {
          e.preventDefault();
          isDraggingRef.current = true;
        }}
        style={{
          cursor: 'row-resize',
          height: '8px'
        }}
      />
      <div style={{
        padding: `${BOX_PADDING_VALUE}px`,
        border: '2px solid #6f8194'
      }}
      >
        <div id="output_strings">{outputDivs}</div>
      </div>
    </div>
  );
}
