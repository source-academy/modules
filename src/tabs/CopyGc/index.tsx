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
  fromSpace: number;
  column: number;
  row: number;
  tags: number[];
  heap: number[];
  memoryHeap: number[][];
  flips: number[];
  functionLength: number;
  toMemoryMatrix: number[][];
  fromMemoryMatrix: number[][];
  content: number;
};

class CopyGC extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      value: 0,
      memorySize: 0,
      // eslint-disable-next-line react/no-unused-state
      functionLength: 0,
      toSpace: 0,
      fromSpace: 0,
      column: 0,
      row: 0,
      tags: [],
      heap: [],
      memoryHeap: [],
      // eslint-disable-next-line react/no-unused-state
      flips: [0],
      toMemoryMatrix: [],
      fromMemoryMatrix: [],
      content: -1,
    };
  }

  componentDidMount() {
    this.initialise_state();
  }

  private initialise_state = () => {
    const { debuggerContext } = this.props;
    const functions = debuggerContext.result.value;
    const memorySize = functions.get_memory_size();
    const toSpace = functions.get_to_space();
    const fromSpace = functions.get_from_space();
    const column = functions.get_column_size();
    const row = functions.get_row_size();
    const tags = functions.get_tags();
    const memoryHeap = functions.get_memory_heap();
    // eslint-disable-next-line react/destructuring-assignment
    const heap = memoryHeap[this.state.value];
    const toMemoryMatrix = functions.get_to_memory_matrix();
    const fromMemoryMatrix = functions.get_from_memory_matrix();
    const functionLength = memoryHeap.length;
    const flips = functions.get_flips();

    console.log(memoryHeap);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, arrow-body-style
    this.setState((state: State) => {
      return {
        memorySize,
        toSpace,
        fromSpace,
        column,
        row,
        tags,
        heap,
        memoryHeap,
        functionLength,
        toMemoryMatrix,
        fromMemoryMatrix,
        flips,
      };
    });
  };

  // eslint-disable-next-line arrow-body-style
  private sliderShift = (newValue: number) => {
    const { memoryHeap } = this.state;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, arrow-body-style
    this.setState((state: State) => {
      return {
        value: newValue,
        heap: memoryHeap[newValue],
      };
    });
  };

  // eslint-disable-next-line arrow-body-style
  private changeContent = (index: number) => {
    // eslint-disable-next-line react/destructuring-assignment
    const newContent = this.state.heap[index];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, arrow-body-style
    this.setState((state: State) => {
      return {
        content: newContent,
      };
    });
  };

  private getlengthFunction = () => {
    const { debuggerContext } = this.props;
    const memoryHeap = debuggerContext.result.value
      ? debuggerContext.result.value.get_memory_heap()
      : [];
    return memoryHeap.length;
  };

  private isTag = (tag) => {
    const { tags } = this.state;
    return tags ? tags.includes(tag) : false;
  };

  private getMemoryColor = (rowNumber, columnNumber) => {
    const { column } = this.state;
    const index = rowNumber * column + columnNumber;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { row } = this.state;
    // eslint-disable-next-line react/destructuring-assignment
    const value = this.state.heap ? this.state.heap[index] : 0;
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

  public render() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { toMemoryMatrix, fromMemoryMatrix } = this.state;
    const { state } = this;
    const lengthOfFunction = this.getlengthFunction();
    return (
      <div>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <div>
          <p>This is for explanation</p>
          <p>
            Memory size: {state.memorySize} | To Space: {state.toSpace} | From
            Space: {state.fromSpace}
          </p>
          <p>The content: {state.content}</p>
          <p>The heap: {state.memoryHeap.lastIndexOf(state.heap)}</p>
          <p>{lengthOfFunction}</p>
          <div style={{ padding: 5 }}>
            <Slider
              disabled={lengthOfFunction <= 1}
              min={0}
              max={lengthOfFunction > 0 ? lengthOfFunction - 1 : 0}
              onChange={this.sliderShift}
              value={state.value <= 30 ? state.value : 0}
              // labelValues={state.flips}
            />
          </div>
        </div>
        <div>
          <div>
            <h3>To Space</h3>
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
                            const color = this.getMemoryColor(row, column);
                            return (
                              // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
                              <div
                                style={{ width: 14, height: 15 }}
                                // onMouseOver={() => this.changeContent(content)}
                              >
                                <canvas
                                  width={10}
                                  height={10}
                                  style={{
                                    backgroundColor: color,
                                    // margin: 2,
                                  }}
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
          <div>
            <h3>From Space</h3>
            <div>
              {fromMemoryMatrix && fromMemoryMatrix.length > 0
                ? fromMemoryMatrix.map((item, row) => (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <span style={{ width: 30 }}>
                        {
                          // eslint-disable-next-line react/destructuring-assignment
                          row * this.state.column + state.memorySize / 2
                        }
                      </span>
                      {item && item.length > 0
                        ? // eslint-disable-next-line @typescript-eslint/no-unused-vars, arrow-body-style
                          item.map((content, column) => {
                            const color = this.getMemoryColor(row, column);
                            return (
                              // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
                              <div
                                style={{ width: 14, height: 15 }}
                                // onMouseOver={() => this.changeContent(content)}
                              >
                                <canvas
                                  width={10}
                                  height={10}
                                  style={{
                                    backgroundColor: color,
                                    // margin: 2,
                                  }}
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
  body: (debuggerContext: any) => <CopyGC debuggerContext={debuggerContext} />,
  label: 'Copying Garbage Collector',
  iconName: 'build',
};
