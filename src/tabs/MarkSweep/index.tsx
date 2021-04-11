import React from 'react';
import { Slider } from '@blueprintjs/core';

type Props = {
  children?: never;
  className?: string;
  debuggerContext: any;
};

type State = {
  value: number;
  memorySize: number;
  toSpace: number;
  column: number;
  row: number;
  tags: number[];
  heap: number[];
  commandHeap: any[];
  command: String;
  flips: number[];
  functionLength: number;
  toMemoryMatrix: number[][];
  firstChild: number;
  lastChild: number;
};

const SIZE_SLOT = 1;
class MarkSweep extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      value: 0,
      memorySize: 0,
      // eslint-disable-next-line react/no-unused-state
      functionLength: 0,
      // eslint-disable-next-line react/no-unused-state
      toSpace: 0,
      column: 0,
      // eslint-disable-next-line react/no-unused-state
      row: 0,
      tags: [],
      heap: [],
      commandHeap: [],
      // eslint-disable-next-line react/no-unused-state
      flips: [0],
      toMemoryMatrix: [],
      firstChild: -1,
      lastChild: -1,
      command: '',
    };
  }

  componentDidMount() {
    this.initialise_state();
  }

  private initialise_state = () => {
    const { debuggerContext } = this.props;
    const functions = debuggerContext.result.value;
    const memorySize = functions.get_memory_size();
    const column = functions.get_column_size();
    const row = functions.get_row_size();
    const tags = functions.get_tags();
    const commandHeap = functions.get_command();
    let heap = [];
    let toSpace = -1;
    let command = '';
    let firstChild = -1;
    let lastChild = -1;

    if (commandHeap[0]) {
      const currentHeap = commandHeap[0];
      heap = currentHeap.heap;
      toSpace = currentHeap.to;
      command = currentHeap.type;
      firstChild = currentHeap.left;
      lastChild = currentHeap.right;
    }

    const toMemoryMatrix = functions.get_to_memory_matrix();
    const functionLength = commandHeap.length;
    const flips = functions.get_flips();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, arrow-body-style
    this.setState((state: State) => {
      return {
        memorySize,
        toSpace,
        column,
        row,
        tags,
        heap,
        functionLength,
        toMemoryMatrix,
        flips,
        commandHeap,
        command,
        firstChild,
        lastChild,
      };
    });
  };

  // eslint-disable-next-line arrow-body-style
  private sliderShift = (newValue: number) => {
    const { commandHeap } = this.state;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, arrow-body-style
    this.setState((state: State) => {
      return {
        value: newValue,
        heap: commandHeap[newValue].heap,
        toSpace: commandHeap[newValue].to,
        command: commandHeap[newValue].type,
        firstChild: commandHeap[newValue].left,
        lastChild: commandHeap[newValue].right,
      };
    });
  };

  // eslint-disable-next-line arrow-body-style
  private updateChild = (index: number) => {
    // eslint-disable-next-line react/destructuring-assignment
    const value = this.state.heap ? this.state.heap[index] : 0;

    if (this.isTag(value)) {
      const FIRST_CHILD_SLOT = 2;
      const LAST_CHILD_SLOT = 3;
      // eslint-disable-next-line react/destructuring-assignment
      const firstChild = this.state.heap[index + FIRST_CHILD_SLOT];
      // eslint-disable-next-line react/destructuring-assignment
      const lastChild = this.state.heap[index + LAST_CHILD_SLOT];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, arrow-body-style
      this.setState((state: State) => {
        return {
          firstChild,
          lastChild,
        };
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, arrow-body-style
      this.setState((state: State) => {
        return {
          firstChild: -1,
          lastChild: -1,
        };
      });
    }
  };

  private getlengthFunction = () => {
    const { debuggerContext } = this.props;
    const commandHeap = debuggerContext.result.value
      ? debuggerContext.result.value.get_command()
      : [];
    return commandHeap.length;
  };

  private isTag = (tag) => {
    const { tags } = this.state;
    return tags ? tags.includes(tag) : false;
  };

  private getMemoryColor = (indexValue) => {
    const { heap } = this.state;
    // eslint-disable-next-line react/destructuring-assignment
    const value = heap ? heap[indexValue] : 0;
    let color = '';

    if (!value) {
      color = '#707070';
    } else if (this.isTag(value)) {
      // is a tag
      color = 'salmon';
    } else {
      color = 'lightblue';
    }

    return color;
  };

  private getBackgroundColor = (indexValue) => {
    const { firstChild } = this.state;
    const { lastChild } = this.state;
    const { heap } = this.state;
    const size1 = heap[firstChild + SIZE_SLOT];
    const size2 = heap[lastChild + SIZE_SLOT];
    const { command } = this.state;
    let color = '';
    console.log('background color ', firstChild, firstChild + size1);
    if (command === 'flip') {
      if (indexValue === firstChild) {
        color = '#42a870';
      }
      if (indexValue === lastChild) {
        color = '#f0d60e';
      }
    } else if (indexValue >= firstChild && indexValue <= firstChild + size1) {
      color = '#42a870'; // green
    } else if (indexValue >= lastChild && indexValue <= lastChild + size2) {
      color = '#f0d60e'; // yellow
    }

    return color;
  };

  public render() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { toMemoryMatrix } = this.state;
    const { state } = this;
    const lengthOfFunction = this.getlengthFunction();
    return (
      <div>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <div>
          <p>This is for explanation</p>
          <h3>{state.command}</h3>
          <p>Memory size: {state.memorySize}</p>
          <p>{lengthOfFunction}</p>
          <div style={{ padding: 5 }}>
            <Slider
              disabled={lengthOfFunction <= 1}
              min={0}
              max={lengthOfFunction > 0 ? lengthOfFunction - 1 : 0}
              onChange={this.sliderShift}
              value={state.value <= lengthOfFunction ? state.value : 0}
              labelValues={state.flips}
            />
          </div>
        </div>
        <div>
          <div>
            <div>
              {toMemoryMatrix && toMemoryMatrix.length > 0
                ? toMemoryMatrix.map((item, row) => (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <span style={{ width: 30 }}>
                        {
                          // eslint-disable-next-line react/destructuring-assignment
                          row * this.state.column
                        }
                      </span>
                      {item && item.length > 0
                        ? // eslint-disable-next-line @typescript-eslint/no-unused-vars, arrow-body-style
                          item.map((content, column) => {
                            const color = this.getMemoryColor(content);
                            const bgColor = this.getBackgroundColor(content);
                            return (
                              // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
                              <div
                                style={{ width: 14, backgroundColor: bgColor }}
                                // onMouseOver={() => this.changeContent(content)}
                              >
                                <canvas
                                  width={10}
                                  height={10}
                                  style={{
                                    backgroundColor: color,
                                    // margin: 2,
                                  }}
                                  // onClick={() => this.updateChild(content)}
                                />
                              </div>
                            );
                          })
                        : false}
                    </div>
                  ))
                : false}
            </div>
          </div>
        </div>
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
  iconName: 'build',
};
