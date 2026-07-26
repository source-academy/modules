import { Button, Classes } from '@blueprintjs/core';
import { MATRIX_CHANNEL_ID, MATRIX_WEB_ID, type MatrixTabRpc } from '@sourceacademy/bundle-matrix/protocol';
import type { ITabService, Tab } from '@sourceacademy/common-tabs';
import { checkIsPluginClass, makeRpc, type IChannel, type IConduit, type IPlugin } from '@sourceacademy/conductor/conduit';
import { createElement, useSyncExternalStore } from 'react';

export const MATRIX_TAB_ID = 'matrix';

const GRID_SIZE = 16;
const SQUARE_SIDE_LENGTH = 18;
const DISTANCE_BETWEEN_SQUARES = 6;
const MARGIN_LENGTH = 20;
const CANVAS_SIZE = 420;

const COLOR_ON = '#cccccc';
const COLOR_OFF = '#333333';

function rowToY(row: number): number {
  return MARGIN_LENGTH + row * (SQUARE_SIDE_LENGTH + DISTANCE_BETWEEN_SQUARES);
}

function columnToX(column: number): number {
  return MARGIN_LENGTH + column * (SQUARE_SIDE_LENGTH + DISTANCE_BETWEEN_SQUARES);
}

function xyToRowColumn(x: number, y: number): [row: number, column: number] {
  const row = Math.floor((y - MARGIN_LENGTH) / (SQUARE_SIDE_LENGTH + DISTANCE_BETWEEN_SQUARES));
  const column = Math.floor((x - MARGIN_LENGTH) / (SQUARE_SIDE_LENGTH + DISTANCE_BETWEEN_SQUARES));
  return [row, column];
}

// Needs to survive every Run (a fresh MatrixTabPlugin instance is constructed per Run) the way
// the original pre-Conductor implementation's single `matrix` variable naturally did. A plain
// module-level `let` does NOT actually achieve this here: the host loads this tab bundle via a
// require-wrapper (`export default require => {...}`, see importExternalWebPlugin.ts's
// resolvePluginClass), and that factory function is *called* fresh on every `hostLoadPlugin`
// (i.e. every Run) - so anything declared inside its body, "module-level" or not, is reinitialised
// each time. `globalThis` is the one thing that's actually the same object across those repeated
// calls (same window, no iframe/worker), so the grid is stashed there instead of in a local binding.
const GLOBAL_MATRIX_KEY = Symbol.for('sourceacademy.matrix.sharedMatrix');
type GlobalWithMatrix = typeof globalThis & { [GLOBAL_MATRIX_KEY]?: boolean[][] };
const globalScope = globalThis as GlobalWithMatrix;

function createEmptyMatrix(): boolean[][] {
  return Array.from({ length: GRID_SIZE }, () => new Array(GRID_SIZE).fill(false));
}

function getSharedMatrix(): boolean[][] {
  return globalScope[GLOBAL_MATRIX_KEY] ??= createEmptyMatrix();
}

function setSharedMatrix(matrix: boolean[][]): void {
  globalScope[GLOBAL_MATRIX_KEY] = matrix;
}

function MatrixView({
  canvasRef,
  onClear,
  onRandomise
}: {
  canvasRef: (el: HTMLDivElement | null) => void;
  onClear: () => void;
  onRandomise: () => void;
}) {
  return createElement(
    'div',
    { className: 'sa-tone-matrix' },
    createElement(
      'div',
      { className: 'row' },
      createElement(
        'div',
        { className: `controls col-xs-12 ${Classes.DARK} ${Classes.BUTTON_GROUP}` },
        createElement(Button, { id: 'clear-matrix', onClick: onClear }, 'Clear'),
        createElement(Button, { id: 'randomise-matrix', onClick: onRandomise }, 'Randomise')
      )
    ),
    createElement(
      'div',
      { className: 'row' },
      createElement('div', { className: 'col-xs-12', ref: canvasRef })
    )
  );
}

/**
 * Host-side (browser main thread) counterpart of `MatrixModulePlugin` (in the matrix
 * bundle) - canvas rendering and click handling only work here, not inside Conductor's runner
 * Worker. Clicking a square is purely visual (toggle + redraw): it never goes through the channel
 * at all, matching the original (pre-Conductor) implementation exactly - only `get_matrix()`/
 * `clear_matrix()`, called from student code, round-trip to the Worker.
 */
// eslint-disable-next-line @sourceacademy/tab-type
export default class MatrixTabPlugin implements IPlugin, MatrixTabRpc {
  readonly id = MATRIX_WEB_ID;
  static readonly channelAttach = [MATRIX_CHANNEL_ID];

  private readonly __tabService: ITabService;
  private readonly __listeners = new Set<() => void>();

  private __canvas: HTMLCanvasElement | undefined;

  constructor(_conduit: IConduit, [channel]: IChannel<any>[], tabService: ITabService) {
    if (!channel) {
      throw new Error('Matrix channel is required but was not provided.');
    }

    this.__tabService = tabService;
    makeRpc<MatrixTabRpc, Record<string, never>>(channel, this);

    const subscribe = (listener: () => void) => this.subscribe(listener);
    const MatrixPluginTab = () => {
      useSyncExternalStore(subscribe, getSharedMatrix);
      return createElement(MatrixView, {
        canvasRef: this.__attachCanvas,
        onClear: () => this.__clearMatrix(),
        onRandomise: () => this.__randomiseMatrix()
      });
    };

    const tab = {
      id: MATRIX_TAB_ID,
      iconName: 'music',
      body: createElement(MatrixPluginTab),
      label: 'Tone Matrix',
      disabled: false
    } satisfies Tab;

    this.__tabService.registerTab(tab);
    this.__tabService.showTab(MATRIX_TAB_ID);
  }

  subscribe(listener: () => void): () => void {
    this.__listeners.add(listener);
    return () => this.__listeners.delete(listener);
  }

  destroy(): void {
    // Called on every Run's teardown (the conductor is terminated as soon as the program finishes
    // evaluating) - unregistering here would yank the tab away almost immediately after it
    // appears, since there's nothing slow enough in this module to keep the Run alive for long.
    // The tab is left registered (its grid state persists) and gets replaced naturally when the
    // next Run's MatrixTabPlugin re-registers under the same id - same fix as sound's tab.
  }

  async getMatrix(): Promise<boolean[][]> {
    return getSharedMatrix().map(row => [...row]);
  }

  async clearMatrix(): Promise<void> {
    this.__clearMatrix();
  }

  private __clearMatrix(): void {
    setSharedMatrix(createEmptyMatrix());
    this.__redraw();
    this.__emit();
  }

  private __randomiseMatrix(): void {
    setSharedMatrix(
      Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => Math.random() > 0.9))
    );
    this.__redraw();
    this.__emit();
  }

  private __setColor(row: number, column: number, color: string): void {
    if (row < 0 || row >= GRID_SIZE || column < 0 || column >= GRID_SIZE || !this.__canvas) {
      return;
    }
    const ctx = this.__canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.fillRect(columnToX(column), rowToY(row), SQUARE_SIDE_LENGTH, SQUARE_SIDE_LENGTH);
  }

  private __redraw(): void {
    const matrix = getSharedMatrix();
    for (let i = 0; i < GRID_SIZE; i += 1) {
      for (let j = 0; j < GRID_SIZE; j += 1) {
        this.__setColor(i, j, matrix[i][j] ? COLOR_ON : COLOR_OFF);
      }
    }
  }

  private __handleClick = (event: MouseEvent): void => {
    if (!this.__canvas) return;
    const rect = this.__canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const [row, column] = xyToRowColumn(x, y);
    if (row < 0 || row >= GRID_SIZE || column < 0 || column >= GRID_SIZE) {
      return;
    }
    // useSyncExternalStore's snapshot is getSharedMatrix itself - mutating the array it returns
    // in place would leave globalScope[GLOBAL_MATRIX_KEY] pointing at the same reference, so
    // React's Object.is comparison would see no change and skip re-rendering. Clone first, same
    // as getMatrix() already does.
    const matrix = getSharedMatrix().map(r => [...r]);
    matrix[row][column] = !matrix[row][column];
    setSharedMatrix(matrix);
    this.__setColor(row, column, matrix[row][column] ? COLOR_ON : COLOR_OFF);
    this.__emit();
  };

  private __attachCanvas = (container: HTMLDivElement | null): void => {
    if (!container) return;
    if (!this.__canvas) {
      this.__canvas = document.createElement('canvas');
      this.__canvas.width = CANVAS_SIZE;
      this.__canvas.height = CANVAS_SIZE;
      this.__canvas.addEventListener('click', this.__handleClick, false);
      this.__redraw();
    }
    container.appendChild(this.__canvas);
  };

  private __emit(): void {
    this.__listeners.forEach(listener => listener());
  }
}
checkIsPluginClass(MatrixTabPlugin);
