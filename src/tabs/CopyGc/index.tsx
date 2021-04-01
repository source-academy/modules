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
  memoryMatrix: number[][];
};

class CopyGC extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      value: 1,
      memorySize: 0,
      functionLength: 0,
      toSpace: 0,
      fromSpace: 0,
      column: 0,
      row: 0,
      tags: [],
      heap: [],
      memoryHeap: [],
      flips: [0],
      memoryMatrix: [],
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
    const memoryMatrix = functions.get_memory_matrix();
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
        memoryMatrix,
        flips,
      };
    });
  };

  // eslint-disable-next-line arrow-body-style
  private sliderShift = (newValue: number) => {
    let { functionLength } = this.state;
    functionLength = this.getlengthFunction();
    if (newValue < functionLength) {
      const { memoryHeap } = this.state;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, arrow-body-style
      this.setState((state: State) => {
        return {
          value: newValue,
          heap: memoryHeap[newValue],
        };
      });
    }
  };

  private getlengthFunction = () => {
    const { debuggerContext } = this.props;
    const memoryHeap = debuggerContext.result.value.get_memory_heap();
    return memoryHeap.length;
  };

  private isTag = (tag) => {
    const { tags } = this.state;
    return tags.includes(tag);
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
    const { memoryMatrix } = this.state;
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
          <p>{lengthOfFunction}</p>
          <p>{state.flips}</p>
          <div style={{ padding: 5 }}>
            <Slider
              disabled={false}
              min={0}
              max={lengthOfFunction - 1}
              onChange={this.sliderShift}
              value={state.value <= 30 ? state.value : 0}
              labelValues={state.flips}
            />
          </div>
        </div>
        <div>
          <div>
            <h3>From Space</h3>
            <div>
              {memoryMatrix
                ? memoryMatrix.map((item, row) => (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <span style={{ width: 30 }}>
                        {
                          // eslint-disable-next-line react/destructuring-assignment
                          row * this.state.column
                        }
                      </span>
                      {item
                        ? // eslint-disable-next-line @typescript-eslint/no-unused-vars, arrow-body-style
                          item.map((content, column) => {
                            const color = this.getMemoryColor(row, column);
                            return (
                              <div style={{ width: 14, height: 15 }}>
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
            <h3>To Space</h3>
            <div>
              {memoryMatrix
                ? memoryMatrix.map((item, index) => (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <span style={{ width: 30 }}>{index}</span>
                      {item
                        ? item.map(() => (
                            <div>
                              <canvas
                                width={10}
                                height={10}
                                style={{
                                  backgroundColor: 'lightblue',
                                  margin: 2,
                                }}
                              />
                            </div>
                          ))
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
