import { Icon, Slider } from '@blueprintjs/core';
import { COMMAND, type MarkSweepGlobalState, type Tag } from '@sourceacademy/bundle-mark_sweep/types';
import { defineTab, getModuleState } from '@sourceacademy/modules-lib/tabs/utils';
import type { ModuleTab } from '@sourceacademy/modules-lib/types/index';
import React from 'react';
import { ThemeColor } from './style';

const MarkSweep: ModuleTab = ({ debuggerCtx }) => {
  const {
    commandHeap,
    columnCount: columnSize,
    flips,
    memoryMatrix,
    MARKED: marked,
    ROOTS: roots,
    tags,
    UNMARKED: unmarked,
  } = getModuleState<MarkSweepGlobalState>(debuggerCtx, 'mark_sweep')!;

  const [value, setValue] = React.useState(0);

  const handlePlus = () => {
    if (value < commandHeap.length - 1) {
      setValue(value + 1);
    }
  };

  const handleMinus = () => {
    if (value > 0) {
      setValue(value - 1);
    }
  };

  const isTag = (tag: Tag) => tags.includes(tag);

  if (value < commandHeap.length) {
    const {
      type: command,
      desc: description,
      left: firstChild,
      heap,
      right: lastChild,
      leftDesc,
      queue,
      rightDesc
    } = commandHeap[value];

    const getMemoryColor = (indexValue: number) => {
      const value = heap ? heap[indexValue] : 0;
      let color = '';

      if (command === COMMAND.SHOW_MARKED && roots.includes(indexValue)) {
        color = 'magenta';
      } else if (isTag(heap[indexValue - MARK_SLOT])) {
        if (value === marked) {
          color = ThemeColor.RED;
        } else if (value === unmarked) {
          color = ThemeColor.BLACK;
        }
      } else if (!value) {
        color = ThemeColor.GREY;
      } else if (isTag(value)) {
      // is a tag
        color = ThemeColor.PINK;
      } else {
        color = ThemeColor.BLUE;
      }

      return color;
    };

    const getBackgroundColor = (indexValue: number) => {
      const size1 = commandHeap[value].sizeLeft;
      const size2 = commandHeap[value].sizeRight;
      let color = '';

      if (command === COMMAND.SHOW_MARKED && roots.includes(indexValue)) {
        color = ThemeColor.GREEN;
      } else if (indexValue >= firstChild && indexValue < firstChild + size1) {
        color = ThemeColor.GREEN;
      } else if (indexValue >= lastChild && indexValue < lastChild + size2) {
        color = ThemeColor.YELLOW;
      }

      return color;
    };

    return (
      <div>
        <div>
          <p>
            This is a visualiser for mark and sweep garbage collector. Check
            the guide{' '}
            <a href="https://github.com/source-academy/modules/wiki/%5Bcopy_gc-&-mark_sweep%5D-User-Guide">
              here
            </a>
            .
          </p>
          <h3>{command}</h3>
          <p> {description} </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: 10
            }}
          >
            {leftDesc && (
              <div style={{ flex: 1 }}>
                <canvas
                  width={10}
                  height={10}
                  style={{
                    backgroundColor: ThemeColor.GREEN
                  }}
                />
                <span> {leftDesc} </span>
              </div>
            )}
            {rightDesc
              ? (
                <div style={{ flex: 1 }}>
                  <canvas
                    width={10}
                    height={10}
                    style={{
                      backgroundColor: ThemeColor.YELLOW
                    }}
                  />
                  <span> {rightDesc} </span>
                </div>
              )
              : false}
          </div>
          <br />
          <p>
            Current step:
            {'   '}
            <Icon icon="remove" onClick={handleMinus} />
            {'   '}
            {value}
            {'   '}
            <Icon icon="add" onClick={handlePlus} />
          </p>
          <div style={{ padding: 5 }}>
            <Slider
              disabled={commandHeap.length <= 1}
              min={0}
              max={commandHeap.length > 0 ? commandHeap.length - 1 : 0}
              onChange={setValue}
              value={value <= commandHeap.length ? value : 0}
              labelValues={flips}
              labelRenderer={val => flips.includes(val) ? '^' : `${val}`}
            />
          </div>
        </div>
        <div>
          <div>
            <div>
              {memoryMatrix.length > 0 && memoryMatrix.map((item, rowIndex) => (
                <div style={{
                  display: 'flex',
                  flexDirection: 'row'
                }}>
                  <span style={{ width: 30 }}>{rowIndex * columnSize}</span>
                  {item.length > 0 && item.map((content) => {
                    const color = getMemoryColor(content);
                    const bgColor = getBackgroundColor(content);
                    return (
                      <div
                        style={{
                          width: 14,
                          backgroundColor: bgColor
                        }}
                      >
                        <canvas
                          width={10}
                          height={10}
                          style={{
                            backgroundColor: color
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div>
              {queue.length && (
                <div>
                  <br />
                  <span> Queue: [</span>
                  {queue.map(child => (
                    <span style={{ fontSize: 10 }}> {child}, </span>
                  ))}
                  <span> ] </span>
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: 10
            }}
          >
            <div style={{ flex: 1 }}>
              <canvas
                width={10}
                height={10}
                style={{
                  backgroundColor: ThemeColor.BLUE
                }}
              />
              <span> defined</span>
            </div>
            <div style={{ flex: 1 }}>
              <canvas
                width={10}
                height={10}
                style={{
                  backgroundColor: ThemeColor.PINK
                }}
              />
              <span> tag</span>
            </div>
            <div style={{ flex: 1 }}>
              <canvas
                width={10}
                height={10}
                style={{
                  backgroundColor: ThemeColor.GREY
                }}
              />
              <span> empty or undefined</span>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: 10
            }}
          >
            <div style={{ flex: 1 }}>
              <span> MARK_SLOT: </span>
            </div>
            <div style={{ flex: 1 }}>
              <canvas
                width={10}
                height={10}
                style={{
                  backgroundColor: 'red'
                }}
              />
              <span> marked</span>
            </div>
            <div style={{ flex: 1 }}>
              <canvas
                width={10}
                height={10}
                style={{
                  backgroundColor: 'black'
                }}
              />
              <span> unmarked</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p>
        This is a visualiser for mark and sweep garbage collector. Check the
        guide{' '}
        <a href="https://github.com/source-academy/modules/wiki/%5Bcopy_gc-&-mark_sweep%5D-User-Guide">
          here
        </a>
        .
      </p>
      <p> Call the function <code>init()</code> in your code to start. </p>
    </div>
  );
};

const MARK_SLOT = 1;

export default defineTab({
  toSpawn: context => {
    const state = getModuleState<MarkSweepGlobalState>(context, 'mark_sweep');
    return state !== null;
  },
  body: debuggerContext => <MarkSweep debuggerCtx={debuggerContext} />,
  label: 'Mark Sweep Garbage Collector',
  iconName: 'heat-grid'
});
