import { Button, Classes } from '@blueprintjs/core';
import { SOUND_MATRIX_CHANNEL_ID, SOUND_MATRIX_WEB_ID, type SoundMatrixTabRpc } from '@sourceacademy/bundle-sound_matrix/protocol';
import type { ITabService, Tab } from '@sourceacademy/common-tabs';
import { checkIsPluginClass, makeRpc, type IChannel, type IConduit, type IPlugin } from '@sourceacademy/conductor/conduit';
import { createElement, useSyncExternalStore } from 'react';

export const SOUND_MATRIX_TAB_ID = 'sound_matrix';

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

// Module-level (not a class field) so the composed pattern survives across every Run: a fresh
// SoundMatrixTabPlugin instance is constructed per Run (the conductor/Worker are recreated each
// time), but the whole point of this module is "compose a pattern visually, then run code -
// possibly several times - to read/play it". The original (pre-Conductor) implementation never
// tore anything down between runs at all, so its single `matrix` variable just naturally persisted
// the same way; tying the grid to a per-instance field here would silently reset it on every Run,
// which is exactly backwards from the original behaviour.
let sharedMatrix: boolean[][] = Array.from({ length: GRID_SIZE }, () => new Array(GRID_SIZE).fill(false));

function SoundMatrixView({
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
 * Host-side (browser main thread) counterpart of `SoundMatrixModulePlugin` (in the sound_matrix
 * bundle) - canvas rendering and click handling only work here, not inside Conductor's runner
 * Worker. Clicking a square is purely visual (toggle + redraw): it never goes through the channel
 * at all, matching the original (pre-Conductor) implementation exactly - only `get_matrix()`/
 * `clear_matrix()`, called from student code, round-trip to the Worker.
 */
// eslint-disable-next-line @sourceacademy/tab-type
export default class SoundMatrixTabPlugin implements IPlugin, SoundMatrixTabRpc {
  readonly id = SOUND_MATRIX_WEB_ID;
  static readonly channelAttach = [SOUND_MATRIX_CHANNEL_ID];

  private readonly __tabService: ITabService;
  private readonly __listeners = new Set<() => void>();

  private __canvas: HTMLCanvasElement | undefined;

  constructor(_conduit: IConduit, [channel]: IChannel<any>[], tabService: ITabService) {
    if (!channel) {
      throw new Error('Sound matrix channel is required but was not provided.');
    }

    this.__tabService = tabService;
    makeRpc<SoundMatrixTabRpc, Record<string, never>>(channel, this);

    const subscribe = (listener: () => void) => this.subscribe(listener);
    const SoundMatrixPluginTab = () => {
      useSyncExternalStore(subscribe, () => sharedMatrix);
      return createElement(SoundMatrixView, {
        canvasRef: this.__attachCanvas,
        onClear: () => this.__clearMatrix(),
        onRandomise: () => this.__randomiseMatrix()
      });
    };

    const tab = {
      id: SOUND_MATRIX_TAB_ID,
      iconName: 'music',
      body: createElement(SoundMatrixPluginTab),
      label: 'Sound Matrix',
      disabled: false
    } satisfies Tab;

    this.__tabService.registerTab(tab);
    this.__tabService.showTab(SOUND_MATRIX_TAB_ID);
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
    // next Run's SoundMatrixTabPlugin re-registers under the same id - same fix as sound's tab.
  }

  async getMatrix(): Promise<boolean[][]> {
    return sharedMatrix.map(row => [...row]);
  }

  async clearMatrix(): Promise<void> {
    this.__clearMatrix();
  }

  private __clearMatrix(): void {
    sharedMatrix = Array.from({ length: GRID_SIZE }, () => new Array(GRID_SIZE).fill(false));
    this.__redraw();
    this.__emit();
  }

  private __randomiseMatrix(): void {
    sharedMatrix = Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => Math.random() > 0.9));
    this.__redraw();
    this.__emit();
  }

  private __setColor(row: number, column: number, color: string): void {
    if (row < 0 || row >= GRID_SIZE || column < 0 || column >= GRID_SIZE || !this.__canvas) {
      return;
    }
    const ctx = this.__canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.fillStyle = color;
    ctx.fillRect(columnToX(column), rowToY(row), SQUARE_SIDE_LENGTH, SQUARE_SIDE_LENGTH);
  }

  private __redraw(): void {
    for (let i = 0; i < GRID_SIZE; i += 1) {
      for (let j = 0; j < GRID_SIZE; j += 1) {
        this.__setColor(i, j, sharedMatrix[i][j] ? COLOR_ON : COLOR_OFF);
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
    sharedMatrix[row][column] = !sharedMatrix[row][column];
    this.__setColor(row, column, sharedMatrix[row][column] ? COLOR_ON : COLOR_OFF);
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
checkIsPluginClass(SoundMatrixTabPlugin);
