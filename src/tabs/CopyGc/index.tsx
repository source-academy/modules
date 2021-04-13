import React from 'react';
import { Slider, Icon } from '@blueprintjs/core';
import { THEME_COLOR } from './style';
import { COMMAND } from '../../bundles/copy_gc/types';

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
  commandHeap: any[];
  command: String;
  flips: number[];
  functionLength: number;
  toMemoryMatrix: number[][];
  fromMemoryMatrix: number[][];
  firstChild: number;
  lastChild: number;
  description: String;
  leftDesc: String;
  rightDesc: String;
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
      // eslint-disable-next-line react/no-unused-state
      fromSpace: 0,
      column: 0,
      // eslint-disable-next-line react/no-unused-state
      row: 0,
      tags: [],
      heap: [],
      commandHeap: [],
      // eslint-disable-next-line react/no-unused-state
      flips: [0],
      toMemoryMatrix: [],
      fromMemoryMatrix: [],
      firstChild: -1,
      lastChild: -1,
      command: '',
      description: '',
      rightDesc: '',
      leftDesc: '',
    };
  }

  componentDidMount() {
    this.initialize_state();
  }

  private initialize_state = () => {
    const { debuggerContext } = this.props;
    const functions = debuggerContext.result.value;
    const memorySize = functions.get_memory_size();
    const column = functions.get_column_size();
    const row = functions.get_row_size();
    const tags = functions.get_tags();
    const commandHeap = functions.get_command();
    let heap = [];
    let toSpace = -1;
    let fromSpace = -1;
    let command = '';
    let firstChild = -1;
    let lastChild = -1;
    let description = '';
    let leftDesc = '';
    let rightDesc = '';
    if (commandHeap[0]) {
      const currentHeap = commandHeap[0];
      heap = currentHeap.heap;
      toSpace = currentHeap.to;
      fromSpace = currentHeap.from;
      command = currentHeap.type;
      firstChild = currentHeap.left;
      lastChild = currentHeap.right;
      description = currentHeap.desc;
      leftDesc = currentHeap.leftDesc;
      rightDesc = currentHeap.rightDesc;
    }

    const toMemoryMatrix = functions.get_to_memory_matrix();
    const fromMemoryMatrix = functions.get_from_memory_matrix();
    const functionLength = commandHeap.length;
    const flips = functions.get_flips();

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
        functionLength,
        toMemoryMatrix,
        fromMemoryMatrix,
        flips,
        commandHeap,
        command,
        firstChild,
        lastChild,
        description,
        leftDesc,
        rightDesc,
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
        fromSpace: commandHeap[newValue].from,
        toSpace: commandHeap[newValue].to,
        command: commandHeap[newValue].type,
        firstChild: commandHeap[newValue].left,
        lastChild: commandHeap[newValue].right,
        description: commandHeap[newValue].desc,
        leftDesc: commandHeap[newValue].leftDesc,
        rightDesc: commandHeap[newValue].rightDesc,
      };
    });
  };

  private handlePlus = () => {
    let { value } = this.state;
    const lengthOfFunction = this.getlengthFunction();
    const { commandHeap } = this.state;
    if (value < lengthOfFunction - 1) value += 1;
    // eslint-disable-next-line arrow-body-style
    this.setState(() => {
      return {
        value,
        heap: commandHeap[value].heap,
        fromSpace: commandHeap[value].from,
        toSpace: commandHeap[value].to,
        command: commandHeap[value].type,
        firstChild: commandHeap[value].left,
        lastChild: commandHeap[value].right,
        description: commandHeap[value].desc,
        leftDesc: commandHeap[value].leftDesc,
        rightDesc: commandHeap[value].rightDesc,
      };
    });
  };

  private handleMinus = () => {
    let { value } = this.state;
    const { commandHeap } = this.state;
    if (value > 0) value -= 1;
    // eslint-disable-next-line arrow-body-style
    this.setState(() => {
      return {
        value,
        heap: commandHeap[value].heap,
        fromSpace: commandHeap[value].from,
        toSpace: commandHeap[value].to,
        command: commandHeap[value].type,
        firstChild: commandHeap[value].left,
        lastChild: commandHeap[value].right,
        description: commandHeap[value].desc,
        leftDesc: commandHeap[value].leftDesc,
        rightDesc: commandHeap[value].rightDesc,
      };
    });
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
    const { debuggerContext } = this.props;
    const roots = debuggerContext.result.value
      ? debuggerContext.result.value.get_roots()
      : [];

    let color = '';

    if (roots.includes(indexValue)) {
      color = 'magenta';
    } else if (!value) {
      color = THEME_COLOR.GREY;
    } else if (this.isTag(value)) {
      // is a tag
      color = THEME_COLOR.PINK;
    } else {
      color = THEME_COLOR.BLUE;
    }

    return color;
  };

  private getBackgroundColor = (indexValue) => {
    const { firstChild } = this.state;
    const { lastChild } = this.state;
    const { commandHeap, value } = this.state;

    const size1 = commandHeap[value].sizeLeft;
    const size2 = commandHeap[value].sizeRight;
    const { command } = this.state;
    let color = '';
    console.log('background color ', firstChild, firstChild + size1);
    if (command === COMMAND.FLIP) {
      if (indexValue === firstChild) {
        color = THEME_COLOR.GREEN;
      }
      if (indexValue === lastChild) {
        color = THEME_COLOR.YELLOW;
      }
    } else if (indexValue >= firstChild && indexValue < firstChild + size1) {
      color = THEME_COLOR.GREEN; // green
    } else if (indexValue >= lastChild && indexValue < lastChild + size2) {
      color = THEME_COLOR.YELLOW; // yellow
    }

    return color;
  };

  // eslint-disable-next-line arrow-body-style
  private renderLabel = (val: number) => {
    const { flips } = this.state;
    return flips.includes(val) ? `^` : `${val}`;
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
          <p>
            This is a visualiser for copying garbage collector. Check the guide
            here*.
          </p>
          <h3>{state.command}</h3>
          <p> {state.description} </p>
          <div style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
            {state.leftDesc ? (
              <div style={{ flex: 1 }}>
                <canvas
                  width={10}
                  height={10}
                  style={{
                    backgroundColor: THEME_COLOR.GREEN,
                  }}
                />
                <span> {state.leftDesc} </span>
              </div>
            ) : (
              false
            )}
            {state.rightDesc ? (
              <div style={{ flex: 1 }}>
                <canvas
                  width={10}
                  height={10}
                  style={{
                    backgroundColor: THEME_COLOR.YELLOW,
                  }}
                />
                <span> {state.rightDesc} </span>
              </div>
            ) : (
              false
            )}
          </div>
          <br />
          <p>
            Current step:
            {'   '}
            <Icon icon='remove' onClick={this.handleMinus} />
            {'   '}
            {state.value}
            {'   '}
            <Icon icon='add' onClick={this.handlePlus} />
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
            <h3>{state.toSpace === 0 ? 'To Space' : 'From Space'}</h3>
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
          <div>
            <h3>{state.toSpace > 0 ? 'To Space' : 'From Space'}</h3>
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
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
          <div style={{ flex: 1 }}>
            <canvas
              width={10}
              height={10}
              style={{
                backgroundColor: THEME_COLOR.BLUE,
              }}
            />
            <span> defined</span>
          </div>
          <div style={{ flex: 1 }}>
            <canvas
              width={10}
              height={10}
              style={{
                backgroundColor: THEME_COLOR.PINK,
              }}
            />
            <span> tag</span>
          </div>
          <div style={{ flex: 1 }}>
            <canvas
              width={10}
              height={10}
              style={{
                backgroundColor: THEME_COLOR.GREY,
              }}
            />
            <span> empty or undefined</span>
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
  iconName: 'duplicate',
};
