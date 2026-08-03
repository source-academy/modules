/**
 * The `repl` module lets a program build its own read-eval-print loop inside a Source Academy
 * tab. The primary use is a metacircular evaluator, as in SICP Chapter 4: a program writes its own
 * `parse_and_evaluate`-style function and registers it with {@link ReplModulePlugin#set_evaluator}.
 * From then on, whatever the cadet types into the Repl tab's editor and runs is captured by the
 * tab as a string and sent here, and this bundle calls the registered evaluator with that string.
 * {@link ReplModulePlugin#repl_display}/{@link ReplModulePlugin#rich_repl_display} let the
 * evaluator (or any other running code) print into the Repl tab's output area.
 *
 * ### Example
 * ```js
 * import { set_evaluator, repl_display } from "repl";
 *
 * function parse_and_evaluate(code) {
 *   // ...your metacircular evaluator's entry point...
 * }
 *
 * set_evaluator(parse_and_evaluate);
 * ```
 *
 * {@link ReplModulePlugin#default_js_slang}, which pre-Conductor let a program skip writing its
 * own evaluator by running Repl input directly through the real Source interpreter, is not
 * supported here. It worked by importing `createContext`/`runInContext` from `js-slang` and
 * reusing the enclosing program's chapter/variant/externalSymbols. Under Conductor, `js-slang*`
 * imports are only ever resolved for the legacy (pre-Conductor) module pipeline: buildtools marks
 * them `external` (`external: ['js-slang*']` in `modules-buildtools/src/build/modules/commons.ts`)
 * on the assumption that the legacy loader supplies them as runtime globals - true for legacy
 * bundles, but nothing registers that global for a Conductor bundle's Worker (the `csg` bundle hit
 * the same "resolves to `undefined` at runtime" problem with
 * `GeneralRuntimeError`/`assertNumberWithinRange`; see the NOTE in `csg/src/functions.ts`).
 * `default_js_slang` is kept as an exported symbol, so `set_evaluator(default_js_slang)` still
 * type-checks and runs, but it now throws a clear error explaining that a program-supplied
 * evaluator is required.
 * @module repl
 * @author Wang Zihan
 */
import {
  EvaluatorRuntimeError,
  assertNumberWithinRange
} from '@sourceacademy/conductor/common';
import type { IChannel, IConduit } from '@sourceacademy/conductor/conduit';
import { BaseModulePlugin, moduleMethod } from '@sourceacademy/conductor/module';
import type { IInterfacableEvaluator } from '@sourceacademy/conductor/runner';
import { DataType, type TypedValue } from '@sourceacademy/conductor/types';
import { mString, mVoid } from '@sourceacademy/conductor/util';
import { COLOR_ERROR_MESSAGE, COLOR_REPL_DISPLAY_DEFAULT, COLOR_RUN_CODE_RESULT } from './config';
import {
  REPL_CHANNEL_ID,
  REPL_TAB_NAME,
  type ReplChannelMessage,
  type ReplEditorPropsMessage,
  type ReplOutputEntry,
  type ReplOutputMessage,
  type ReplSetProgramTextMessage
} from './protocol';
import { processRichDisplayContent } from './rich_display';
import { stringifyReplValue } from './stringify_value';

type ReplTabLoader = {
  tabs: string[];
  loadTab: (tab: string) => void;
};

export default class ReplModulePlugin extends BaseModulePlugin {
  id = 'repl';
  static override channelAttach = [REPL_CHANNEL_ID];
  override exportedNames = [
    'default_js_slang',
    'repl_display',
    'rich_repl_display',
    'set_background_image',
    'set_evaluator',
    'set_font_size',
    'set_program_text'
  ] as const;

  private readonly __replChannel: IChannel<ReplChannelMessage>;
  private readonly __tabLoader: ReplTabLoader | undefined;
  private readonly __outputHistory: ReplOutputMessage[] = [];
  private __latestEditorProps: ReplEditorPropsMessage | undefined;
  private __latestProgramText: ReplSetProgramTextMessage | undefined;
  private __evaluator: TypedValue<DataType.CLOSURE> | undefined;
  private __tabLoaded = false;
  private __tabRequested = false;
  // Guards against two overlapping __runCode calls (e.g. a fast double-click on Run) driving the
  // same evaluator closure concurrently - most evaluators (a tree-walking/CSE-machine interpreter)
  // assume single-threaded, sequential calls and aren't safe to re-enter.
  private __running = false;

  private readonly __editorProps = {
    backgroundImageUrl: null as string | null,
    backgroundColorAlpha: 1,
    fontSize: 17
  };

  constructor(
    conduit: IConduit,
    [replChannel]: IChannel<any>[],
    evaluator: IInterfacableEvaluator,
    tabLoader?: ReplTabLoader
  ) {
    // Checked before super() so a missing channel always surfaces as this error, rather than
    // whatever BaseModulePlugin's constructor does with an [undefined] channels array.
    if (!replChannel) {
      throw new EvaluatorRuntimeError('Repl channel is required but was not provided.');
    }

    super(conduit, [replChannel], evaluator);

    this.__replChannel = replChannel as IChannel<ReplChannelMessage>;
    this.__tabLoader = tabLoader;
    this.__replChannel.subscribe(message => {
      if (message.type === 'request') {
        this.__tabRequested = true;
        this.__outputHistory.forEach(entry => this.__replChannel.send(entry));
        if (this.__latestEditorProps) this.__replChannel.send(this.__latestEditorProps);
        if (this.__latestProgramText) this.__replChannel.send(this.__latestProgramText);
        return;
      }

      if (message.type === 'run') {
        // Fire-and-forget: the channel subscriber callback can't be async itself, and there's no
        // caller awaiting a result here - the tab isn't blocked on this, it just gets output
        // messages back over the channel as they're produced.
        this.__runCode(message.code).catch((error: unknown) => {
          console.error('repl: unexpected error while running code', error);
        });
      }
    });
  }

  /**
   * Registers the function that the Repl tab's "Run" button calls with the editor's program
   * text. Only one evaluator can be registered at a time; calling this again replaces it.
   * @param evalFunc - evaluator entry point, taking the Repl editor's code as a string
   * @category Main
   */
  @moduleMethod([DataType.CLOSURE], DataType.VOID)
  async* set_evaluator(evalFunc: TypedValue<DataType.CLOSURE>): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    await this.evaluator.closure_arity_assert(evalFunc, 1);
    this.__evaluator = evalFunc;
    // Registering an evaluator is the one prerequisite the module's own documented minimal usage
    // (see the module doc comment above) treats as enough to start using the Repl tab - without
    // this, a program whose only interaction with the module is set_evaluator() never opens the
    // tab at all, since nothing else would ever call __loadReplTab() first.
    this.__loadReplTab();
    return mVoid();
  }

  /**
   * Displays message in Programmable Repl Tab. Functions as the regular `display` function does,
   * writing the given output to the REPL in tab. This function won't try to decode rich text
   * pairs - for that, use {@link rich_repl_display}.
   * @category Main
   */
  @moduleMethod([DataType.ANY], DataType.ANY)
  async* repl_display(content: TypedValue<DataType>): AsyncGenerator<void, TypedValue<DataType>, undefined> {
    const stringified = content.type === DataType.CONST_STRING
      ? content.value
      : await stringifyReplValue(this.evaluator, content);
    this.__displayOutput({ content: stringified, color: COLOR_REPL_DISPLAY_DEFAULT, outputMethod: 'plaintext' });
    return content;
  }

  /**
   * Display message in Programmable Repl Tab. If given a pair as the parameter, it will use the
   * given pair to generate rich text and use rich text display mode to display the string in
   * Programmable Repl Tab.
   *
   * **Rich Text Display**
   *  - Format: pair(pair("string",style),style)...
   *  - Examples:
   *
   * ```js
   * // A large italic underlined "Hello World"
   * rich_repl_display(pair(pair(pair(pair("Hello World", "underline"), "italic"), "bold"), "gigantic"));
   *
   * // A large italic underlined "Hello World" in blue
   * rich_repl_display(pair(pair(pair(pair(pair("Hello World", "underline"),"italic"), "bold"), "gigantic"), "clrt#0000ff"));
   *
   * // A large italic underlined "Hello World" with orange foreground and purple background
   * rich_repl_display(pair(pair(pair(pair(pair(pair("Hello World", "underline"), "italic"), "bold"), "gigantic"), "clrb#A000A0"),"clrt#ff9700"));
   * ```
   *
   * If the content you provided isn't valid as rich text, then it will be treated as a regular
   * object and displayed as regular text.
   *
   *  - Coloring:
   *    - `clrt` stands for text color, `clrb` stands for background color. The color string are in hexadecimal begin with "#" and followed by 6 hexadecimal digits.
   *    - Example:  `pair("123","clrt#ff0000")` will produce a red "123";  `pair("456","clrb#00ff00")` will produce a green "456".
   *  - Besides coloring, the following styles are also supported:
   *    - `bold`: Make the text bold.
   *    - `italic`: Make the text italic.
   *    - `small`: Make the text in small size.
   *    - `medium`: Make the text in medium size.
   *    - `large`: Make the text in large size.
   *    - `gigantic`: Make the text in very large size.
   *    - `underline`: Underline the text.
   *  - Note that if you apply conflicting attributes together, only one conflicting style will take effect and the others will be discarded.
   *  - Also note that for safety, certain words and characters are not allowed to appear under rich text display mode.
   *
   * @param content the content you want to display
   * @category Main
   */
  @moduleMethod([DataType.ANY], DataType.ANY)
  async* rich_repl_display(content: TypedValue<DataType>): AsyncGenerator<void, TypedValue<DataType>, undefined> {
    const result = await processRichDisplayContent(this.evaluator, content, this.rich_repl_display.name);
    this.__displayOutput({ content: `<span style="${result}`, color: '', outputMethod: 'richtext' });
    return content;
  }

  /**
   * Set Programmable Repl editor background image with a customized image URL
   * @param img_url the url to the new background image
   * @param background_color_alpha the alpha (transparency) of the original background color that covers on your background image [0, 1]. Recommended value is 0.5 .
   * @category Main
   */
  @moduleMethod([DataType.CONST_STRING, DataType.NUMBER], DataType.VOID)
  async* set_background_image(
    img_url: TypedValue<DataType.CONST_STRING>,
    background_color_alpha: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    assertNumberWithinRange(background_color_alpha.value, this.set_background_image.name, 0, 1, false, 'background_color_alpha');

    this.__editorProps.backgroundImageUrl = img_url.value;
    this.__editorProps.backgroundColorAlpha = background_color_alpha.value;
    this.__displayEditorProps();
    return mVoid();
  }

  /**
   * Set Programmable Repl editor font size
   * @param font_size_px font size (in pixels)
   * @category Main
   */
  @moduleMethod([DataType.NUMBER], DataType.VOID)
  async* set_font_size(font_size_px: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    assertNumberWithinRange(font_size_px.value, this.set_font_size.name, 0);

    this.__editorProps.fontSize = font_size_px.value;
    this.__displayEditorProps();
    return mVoid();
  }

  /**
   * Set program text in the Repl editor to the given string
   * @category Main
   */
  @moduleMethod([DataType.CONST_STRING], DataType.VOID)
  async* set_program_text(text: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    const message: ReplSetProgramTextMessage = { type: 'set_program_text', text: text.value };
    this.__latestProgramText = message;
    this.__loadReplTab();
    if (this.__tabRequested) {
      this.__replChannel.send(message);
    }
    return mVoid();
  }

  /**
   * Running Repl input directly through the Source interpreter (skipping a program-supplied
   * evaluator) is not supported by this module - see the module doc comment in index.ts for why.
   * Write your own evaluator function and register it with {@link set_evaluator} instead.
   * @category Main
   */
  @moduleMethod([DataType.CONST_STRING], DataType.VOID)
  async* default_js_slang(_program: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    throw new EvaluatorRuntimeError(`${this.default_js_slang.name}: running Repl input directly through the Source interpreter is not supported by this module. Write your own evaluator function and register it with set_evaluator instead.`);
  }

  /**
   * Loads the host-side tab, lazily - the first time anything is displayed, the editor is
   * customized (background image, font size, program text), or an evaluator is registered.
   * Called from every function that gives the student a reason to actually look at the tab, not
   * just the ones that produce output - a program whose only interaction with this module is
   * e.g. set_evaluator (per the module's own documented minimal usage above) or set_program_text
   * (to pre-populate starter code) still needs the tab to actually open.
   */
  private __loadReplTab(): void {
    if (this.__tabLoaded || this.__tabLoader === undefined) return;

    const tabName = this.__tabLoader.tabs.find(tab => tab === REPL_TAB_NAME);
    if (tabName === undefined) return;

    this.__tabLoader.loadTab(tabName);
    this.__tabLoaded = true;
  }

  private __displayOutput(entry: ReplOutputEntry): void {
    const message: ReplOutputMessage = { type: 'output', entry };
    // Always accumulated (unlike editor_props/set_program_text below) so a tab that reconnects
    // later - e.g. closed and reopened - can replay the full output history, not just the latest.
    this.__outputHistory.push(message);
    this.__loadReplTab();

    // Nothing goes out until the tab has asked for its backlog; sending live before then and
    // replaying afterwards would deliver everything in that window twice.
    if (this.__tabRequested) {
      this.__replChannel.send(message);
    }
  }

  private __displayEditorProps(): void {
    const message: ReplEditorPropsMessage = { type: 'editor_props', ...this.__editorProps };
    this.__latestEditorProps = message;
    this.__loadReplTab();
    if (this.__tabRequested) {
      this.__replChannel.send(message);
    }
  }

  /**
   * Calls the registered evaluator with `code` and reports the result (or a thrown error) as
   * output. Driven with a manual generator-drain rather than `yield*` - unlike e.g. rune's
   * `animate_rune`, this call isn't nested inside a currently-running top-level moduleMethod (it's
   * triggered by a channel message from the tab, asynchronously after set_evaluator's own call
   * already returned), so there's no live top-level CSE-machine call for a `yield*` chain to
   * attach to for debugger step visibility. See the drainGenerator NOTE in sound/functions.ts for
   * the case where that visibility does matter.
   */
  private async __runCode(code: string): Promise<void> {
    if (!this.__evaluator) {
      this.__displayOutput({ content: '<br>', color: 'white', outputMethod: 'richtext' });
      this.__displayOutput({
        content: 'If you see this, please check whether you have called <span style=\'font-weight:bold;font-style:italic;\'>set_evaluator</span> function with the correct parameter before using the Programmable Repl Tab.',
        color: 'yellow',
        outputMethod: 'richtext'
      });
      return;
    }

    // Dropped rather than queued: the tab already lets the student fire off another Run before
    // the last one's output has come back, and queuing would just mean an unbounded backlog of
    // pending closure calls into a (likely non-reentrant) evaluator if that keeps happening.
    if (this.__running) return;
    this.__running = true;

    try {
      const generator = this.evaluator.closure_call_unchecked(this.__evaluator, [mString(code)]);
      let step = await generator.next();
      while (!step.done) {
        step = await generator.next();
      }
      const result = step.value;

      const content = result.type === DataType.CONST_STRING
        ? result.value
        : await stringifyReplValue(this.evaluator, result);
      this.__displayOutput({ content, color: COLOR_RUN_CODE_RESULT, outputMethod: 'plaintext' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.__displayOutput({ content: message, color: COLOR_ERROR_MESSAGE, outputMethod: 'plaintext' });
    } finally {
      this.__running = false;
    }
  }
}
