/**
 * Wire protocol between the repl bundle (running in Conductor's runner Worker) and the Repl tab
 * (running on the browser main thread).
 * @module repl
 */

export const REPL_CHANNEL_ID = 'sourceacademy-repl-channel';
export const REPL_WEB_ID = 'repl-web';
export const REPL_TAB_NAME = 'Repl';

export type ReplOutputMethod = 'plaintext' | 'richtext';

export type ReplOutputEntry = {
  content: string;
  color: string;
  outputMethod: ReplOutputMethod;
};

/** Bundle -> tab: append this entry to the REPL's output history. */
export type ReplOutputMessage = {
  type: 'output';
  entry: ReplOutputEntry;
};

/**
 * Bundle -> tab: the editor's current appearance settings. Replaces whatever the tab is showing,
 * rather than accumulating - unlike output history, there's only ever one "current" value.
 */
export type ReplEditorPropsMessage = {
  type: 'editor_props';
  backgroundImageUrl: string | null;
  backgroundColorAlpha: number;
  fontSize: number;
};

/** Bundle -> tab: overwrite the editor's program text. Also replaces, not accumulates. */
export type ReplSetProgramTextMessage = {
  type: 'set_program_text';
  text: string;
};

/** Bundle -> tab: bring this tab to the front - sent once `set_evaluator` registers successfully,
 * so a program that just finished wiring up the Repl (per the module's documented usage: setup in
 * the main pane, then `set_evaluator` as its last step) lands the student on the Repl tab next,
  rather than leaving them on the editor they just ran. */
export type ReplFocusMessage = {
  type: 'focus';
};

export type ReplDisplayMessage = ReplOutputMessage | ReplEditorPropsMessage | ReplSetProgramTextMessage | ReplFocusMessage;

/** Tab -> bundle: run this code through whatever evaluator was registered via set_evaluator. */
export type ReplRunMessage = {
  type: 'run';
  code: string;
};

/**
 * Tab -> bundle: the tab has (re)connected and is asking for a replay of its backlog - the
 * output history so far, plus the latest editor_props/set_program_text, if any. Without this a
 * program that ran before the tab existed (or a tab being recreated after unmount) would show
 * nothing until the next interaction.
 */
export type ReplRequestMessage = {
  type: 'request';
};

export type ReplChannelMessage = ReplDisplayMessage | ReplRunMessage | ReplRequestMessage;
