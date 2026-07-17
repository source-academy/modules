import { Button, Classes } from '@blueprintjs/core';
import type { ITabService, Tab } from '@sourceacademy/common-tabs';
import { checkIsPluginClass, type IChannel, type IConduit, type IPlugin, makeRpc } from '@sourceacademy/conductor/conduit';
import { createElement, useSyncExternalStore } from 'react';

import { SOUND_MATRIX_CHANNEL_ID, SOUND_MATRIX_WEB_ID, type SoundMatrixTabRpc } from '@sourceacademy/bundle-sound_matrix/protocol';

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

function SoundMatrixView({
  canvasRef,
  onClear,
  onRandomise
}: {
  canvasRef: (el: HTMLDivElement | null) => void;
  onClear: () => void;
  onRandomise: () => void;
}) {
  return createElement('div', { className: 'sa-tone-matrix' },
    createElement('div', { className: 'row' },
      createElement('div', { className: `controls col-xs-12 ${Classes.DARK} ${Classes.BUTTON_GROUP}` },
        createElement(Button, { id: 'clear-matrix', onClick: onClear }, 'Clear'),
        createElement(Button, { id: 'randomise-matrix', onClick: onRandomise }, 'Randomise')
      )
    ),
    createElement('div', { className: 'row' },
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
  private __matrix: boolean[][] = Array.from({ length: GRID_SIZE }, () => new Array(GRID_SIZE).fill(false));

  constructor(_conduit: IConduit, [channel]: IChannel<any>[], tabService: ITabService) {
    if (!channel) {
      throw new Error('Sound matrix channel is required but was not provided.');
    }

    this.__tabService = tabService;
    makeRpc<SoundMatrixTabRpc, Record<string, never>>(channel, this);

    const subscribe = (listener: () => void) => this.subscribe(listener);
    const self = this;
    function SoundMatrixPluginTab() {
      useSyncExternalStore(subscribe, () => self.__matrix);
      return createElement(SoundMatrixView, {
        canvasRef: self.__attachCanvas,
        onClear: () => self.__clearMatrix(),
        onRandomise: () => self.__randomiseMatrix()
      });
    }

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
    this.__tabService.unregisterTab(SOUND_MATRIX_TAB_ID);
  }

  async getMatrix(): Promise<boolean[][]> {
    return this.__matrix.map(row => [...row]);
  }

  async clearMatrix(): Promise<void> {
    this.__clearMatrix();
  }

  private __clearMatrix(): void {
    this.__matrix = Array.from({ length: GRID_SIZE }, () => new Array(GRID_SIZE).fill(false));
    this.__redraw();
    this.__emit();
  }

  private __randomiseMatrix(): void {
    this.__matrix = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => Math.random() > 0.9)
    );
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
        this.__setColor(i, j, this.__matrix[i][j] ? COLOR_ON : COLOR_OFF);
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
    this.__matrix[row][column] = !this.__matrix[row][column];
    this.__setColor(row, column, this.__matrix[row][column] ? COLOR_ON : COLOR_OFF);
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
