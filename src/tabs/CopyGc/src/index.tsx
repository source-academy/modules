import { Icon, Slider } from '@blueprintjs/core';
import { COMMAND, type CopyGCGlobalState, type Tag } from '@sourceacademy/bundle-copy_gc/types';
import { defineTab, getModuleState } from '@sourceacademy/modules-lib/tabs/utils';
import type { ModuleTab } from '@sourceacademy/modules-lib/types';
import React from 'react';
import { ThemeColor } from './style';

const CopyGC: ModuleTab = ({ debuggerCtx }) => {
  const {
    commandHeap,
    COLUMN: column,
    flips,
    fromMemoryMatrix,
    MEMORY_SIZE: memorySize,
    toMemoryMatrix,
    TO_SPACE: toSpace,
    tags,
  } = getModuleState<CopyGCGlobalState>(debuggerCtx, 'copy_gc')!;

  const [value, setValue] = React.useState(0);

  if (value < commandHeap.length) {
    const {
      type: command,
      desc: description,
      left: firstChild,
      heap,
      right: lastChild,
      leftDesc,
      rightDesc,
      sizeLeft,
      sizeRight
    } = commandHeap[value];

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

    const getMemoryColor = (indexValue: number) => {
      const value = heap ? heap[indexValue] : 0;
      let color = '';

      if (!value) {
        color = ThemeColor.GREY;
      } else if (isTag(value)) {
        color = ThemeColor.PINK;
      } else {
        color = ThemeColor.BLUE;
      }

      return color;
    };

    const getBackgroundColor = (indexValue: number) => {
      let color = '';
      if (command === COMMAND.FLIP) {
        if (indexValue === firstChild) {
          color = ThemeColor.GREEN;
        }
        if (indexValue === lastChild) {
          color = ThemeColor.YELLOW;
        }
      } else if (indexValue >= firstChild && indexValue < firstChild + sizeLeft) {
        color = ThemeColor.GREEN;
      } else if (indexValue >= lastChild && indexValue < lastChild + sizeRight) {
        color = ThemeColor.YELLOW;
      }

      return color;
    };

    const renderLabel = (val: number) => flips.includes(val) ? '^' : `${val}`;

    return (
      <div>
        <div>
          <p>
            This is a visualiser for stop and copy garbage collector. Check
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
                <span>{leftDesc}</span>
              </div>
            )}
            {rightDesc && (
              <div style={{ flex: 1 }}>
                <canvas
                  width={10}
                  height={10}
                  style={{
                    backgroundColor: ThemeColor.YELLOW
                  }}
                />
                <span>{rightDesc}</span>
              </div>
            )}
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
              labelRenderer={renderLabel}
            />
          </div>
        </div>
        <div>
          <div>
            <h3>{toSpace === 0 ? 'To' : 'From'} Space</h3>
            <div>
              {toMemoryMatrix.length > 0 && toMemoryMatrix.map((item, row) => (
                <div style={{
                  display: 'flex',
                  flexDirection: 'row'
                }}>
                  <span style={{ width: 30 }}> {row * column} </span>
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
          </div>
          <div>
            <h3>{toSpace > 0 ? 'To Space' : 'From Space'}</h3>
            <div>
              {fromMemoryMatrix.length > 0 && fromMemoryMatrix.map((item, row) => (
                <div style={{
                  display: 'flex',
                  flexDirection: 'row'
                }}>
                  <span style={{ width: 30 }}>
                    {row * column + memorySize / 2}
                  </span>
                  {item.length > 0 && item.map(content => {
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
          </div>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: 10
        }}>
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
      </div>
    );
  }
  return (
    <div>
      <p>
        This is a visualiser for stop and copy garbage collector. Check the
        guide{' '}
        <a href="https://github.com/source-academy/modules/wiki/%5Bcopy_gc-&-mark_sweep%5D-User-Guide">
          here
        </a>
        .
      </p>
      <p> Calls the function <code>init()</code> at the end of your code to start. </p>
    </div>
  );
};

export default defineTab({
  toSpawn: ctx => {
    const state = getModuleState(ctx, 'copy_gc');
    return state !== null;
  },
  body: (debuggerContext) => <CopyGC debuggerCtx={debuggerContext} />,
  label: 'Copying Garbage Collector',
  iconName: 'duplicate'
});
