import React from 'react';
import { Slider, Icon } from '@blueprintjs/core';
import { ThemeColor } from './style';

type Props = {
  children?: never;
  className?: string;
  debuggerContext: any;
};

type State = {
  value: number;
  column: number;
  tags: number[];
  heap: number[];
  commandHeap: any[];
  command: String;
  flips: number[];
  memoryMatrix: number[][];
  firstChild: number;
  lastChild: number;
  description: String;
  leftDesc: String;
  rightDesc: String;
  unmarked: number;
  marked: number;
  queue: number[];
  running: boolean;
};

const MARK_SLOT = 1;
class MarkSweep extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      value: 0,
      column: 0,
      tags: [],
      heap: [],
      commandHeap: [],
      flips: [0],
      memoryMatrix: [],
      firstChild: -1,
      lastChild: -1,
      command: '',
      description: '',
      rightDesc: '',
      leftDesc: '',
      unmarked: 0,
      marked: 1,
      queue: [],
      running: false,
    };
  }

  componentDidMount() {
    const { debuggerContext } = this.props;
    if (
      debuggerContext
      && debuggerContext.result
      && debuggerContext.result.value
    ) {
      this.initialize_state();
    }
  }

  private initialize_state = () => {
    const { debuggerContext } = this.props;
    const functions = debuggerContext.result.value;
    const column = functions.get_column_size();
    const tags = functions.get_tags();
    const commandHeap = functions.get_command();
    const unmarked = functions.get_unmarked();
    const marked = functions.get_marked();
    let heap = [];
    let command = '';
    let firstChild = -1;
    let lastChild = -1;
    let description = '';
    let leftDesc = '';
    let rightDesc = '';
    let queue = [];
    if (commandHeap[0]) {
      const currentHeap = commandHeap[0];
      heap = currentHeap.heap;
      command = currentHeap.type;
      firstChild = currentHeap.left;
      lastChild = currentHeap.right;
      description = currentHeap.desc;
      leftDesc = currentHeap.leftDesc;
      rightDesc = currentHeap.rightDesc;
      queue = currentHeap.queue;
    }

    const memoryMatrix = functions.get_memory_matrix();
    const flips = functions.get_flips();

    this.setState(() => ({
      column,
      tags,
      heap,
      memoryMatrix,
      flips,
      commandHeap,
      command,
      firstChild,
      lastChild,
      description,
      leftDesc,
      rightDesc,
      unmarked,
      marked,
      queue,
      running: true,
    }));
  };

  private handlePlus = () => {
    let { value } = this.state;
    const lengthOfFunction = this.getlengthFunction();
    if (value < lengthOfFunction - 1) {
      value += 1;
      this.setState(() => {
        const { commandHeap } = this.state;
        return {
          value,
          heap: commandHeap[value].heap,
          command: commandHeap[value].type,
          firstChild: commandHeap[value].left,
          lastChild: commandHeap[value].right,
          description: commandHeap[value].desc,
          leftDesc: commandHeap[value].leftDesc,
          rightDesc: commandHeap[value].rightDesc,
          queue: commandHeap[value].queue,
        };
      });
    }
  };

  private handleMinus = () => {
    let { value } = this.state;
    if (value > 0) {
      value -= 1;
      this.setState(() => {
        const { commandHeap } = this.state;
        return {
          value,
          heap: commandHeap[value].heap,
          command: commandHeap[value].type,
          firstChild: commandHeap[value].left,
          lastChild: commandHeap[value].right,
          description: commandHeap[value].desc,
          leftDesc: commandHeap[value].leftDesc,
          rightDesc: commandHeap[value].rightDesc,
          queue: commandHeap[value].queue,
        };
      });
    }
  };

  private sliderShift = (newValue: number) => {
    this.setState(() => {
      const { commandHeap } = this.state;
      return {
        value: newValue,
        heap: commandHeap[newValue].heap,
        command: commandHeap[newValue].type,
        firstChild: commandHeap[newValue].left,
        lastChild: commandHeap[newValue].right,
        description: commandHeap[newValue].desc,
        leftDesc: commandHeap[newValue].leftDesc,
        rightDesc: commandHeap[newValue].rightDesc,
        queue: commandHeap[newValue].queue,
      };
    });
  };

  private getlengthFunction = () => {
    const { debuggerContext } = this.props;
    const commandHeap
      = debuggerContext && debuggerContext.result.value
        ? debuggerContext.result.value.get_command()
        : [];
    return commandHeap.length;
  };

  private isTag = (tag) => {
    const { tags } = this.state;
    return tags ? tags.includes(tag) : false;
  };

  private getMemoryColor = (indexValue) => {
    const { heap, marked, unmarked, command } = this.state;
    const { debuggerContext } = this.props;
    const roots = debuggerContext.result.value
      ? debuggerContext.result.value.get_roots()
      : [];
    const value = heap ? heap[indexValue] : 0;
    let color = '';

    if (command === 'Showing Roots' && roots.includes(indexValue)) {
      color = 'magenta';
    } else if (this.isTag(heap[indexValue - MARK_SLOT])) {
      if (value === marked) {
        color = ThemeColor.RED;
      } else if (value === unmarked) {
        color = ThemeColor.BLACK;
      }
    } else if (!value) {
      color = ThemeColor.GREY;
    } else if (this.isTag(value)) {
      // is a tag
      color = ThemeColor.PINK;
    } else {
      color = ThemeColor.BLUE;
    }

    return color;
  };

  private getBackgroundColor = (indexValue) => {
    const { firstChild } = this.state;
    const { lastChild } = this.state;
    const { commandHeap, value, command } = this.state;
    const { debuggerContext } = this.props;
    const roots = debuggerContext.result.value
      ? debuggerContext.result.value.get_roots()
      : [];
    const size1 = commandHeap[value].sizeLeft;
    const size2 = commandHeap[value].sizeRight;
    let color = '';

    if (command === 'Showing Roots' && roots.includes(indexValue)) {
      color = ThemeColor.GREEN;
    } else if (indexValue >= firstChild && indexValue < firstChild + size1) {
      color = ThemeColor.GREEN;
    } else if (indexValue >= lastChild && indexValue < lastChild + size2) {
      color = ThemeColor.YELLOW;
    }

    return color;
  };

  private renderLabel = (val: number) => {
    const { flips } = this.state;
    return flips.includes(val) ? '^' : `${val}`;
  };

  public render() {
    const { state } = this;

    if (state.running) {
      const { memoryMatrix } = this.state;
      const lengthOfFunction = this.getlengthFunction();
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
            <h3>{state.command}</h3>
            <p> {state.description} </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 10,
              }}
            >
              {state.leftDesc && (
                <div style={{ flex: 1 }}>
                  <canvas
                    width={10}
                    height={10}
                    style={{
                      backgroundColor: ThemeColor.GREEN,
                    }}
                  />
                  <span> {state.leftDesc} </span>
                </div>
              )}
              {state.rightDesc
                ? (
                  <div style={{ flex: 1 }}>
                    <canvas
                      width={10}
                      height={10}
                      style={{
                        backgroundColor: ThemeColor.YELLOW,
                      }}
                    />
                    <span> {state.rightDesc} </span>
                  </div>
                )
                : (
                  false
                )}
            </div>
            <br />
            <p>
              Current step:
              {'   '}
              <Icon icon="remove" onClick={this.handleMinus} />
              {'   '}
              {state.value}
              {'   '}
              <Icon icon="add" onClick={this.handlePlus} />
            </p>
            <div style={{ padding: 5 }}>
              <Slider
                disabled={lengthOfFunction <= 1}
                min={0}
                max={lengthOfFunction > 0 ? lengthOfFunction - 1 : 0}
                onChange={this.sliderShift}
                value={state.value <= lengthOfFunction ? state.value : 0}
                labelValues={state.flips}
                labelRenderer={this.renderLabel}
              />
            </div>
          </div>
          <div>
            <div>
              <div>
                {memoryMatrix
                  && memoryMatrix.length > 0
                  && memoryMatrix.map((item, row) => (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}>
                      <span style={{ width: 30 }}> {row * state.column} </span>
                      {item
                        && item.length > 0
                        && item.map((content) => {
                          const color = this.getMemoryColor(content);
                          const bgColor = this.getBackgroundColor(content);
                          return (
                            <div
                              style={{
                                width: 14,
                                backgroundColor: bgColor,
                              }}
                            >
                              <canvas
                                width={10}
                                height={10}
                                style={{
                                  backgroundColor: color,
                                }}
                              />
                            </div>
                          );
                        })}
                    </div>
                  ))}
              </div>
              <div>
                {state.queue && state.queue.length && (
                  <div>
                    <br />
                    <span> Queue: [</span>
                    {state.queue.map((child) => (
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
                marginTop: 10,
              }}
            >
              <div style={{ flex: 1 }}>
                <canvas
                  width={10}
                  height={10}
                  style={{
                    backgroundColor: ThemeColor.BLUE,
                  }}
                />
                <span> defined</span>
              </div>
              <div style={{ flex: 1 }}>
                <canvas
                  width={10}
                  height={10}
                  style={{
                    backgroundColor: ThemeColor.PINK,
                  }}
                />
                <span> tag</span>
              </div>
              <div style={{ flex: 1 }}>
                <canvas
                  width={10}
                  height={10}
                  style={{
                    backgroundColor: ThemeColor.GREY,
                  }}
                />
                <span> empty or undefined</span>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 10,
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
                    backgroundColor: 'red',
                  }}
                />
                <span> marked</span>
              </div>
              <div style={{ flex: 1 }}>
                <canvas
                  width={10}
                  height={10}
                  style={{
                    backgroundColor: 'black',
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
        <p> Calls the function init() at the end of your code to start. </p>
      </div>
    );
  }
}

export default {
  toSpawn: () => true,
  body: (debuggerContext: any) => (
    <MarkSweep debuggerContext={debuggerContext} />
  ),
  label: 'Mark Sweep Garbage Collector',
  iconName: 'heat-grid',
};
