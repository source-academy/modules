import React from 'react';

type Props = {
  children?: never;
  className?: string;
  debuggerContext: any;
};

type State = {};

class CopyGC extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { debuggerContext } = this.props;
    console.log(debuggerContext);
  }

  private showMemorySize = () => {
    const { debuggerContext } = this.props;
    const memorySize = debuggerContext.result.value.get_memory_size();
    return <span>{memorySize}</span>;
  };

  private showToSpace = () => {
    const { debuggerContext } = this.props;
    const toSpace = debuggerContext.result.value.get_to_space();
    return <span>{toSpace}</span>;
  };

  private showFromSpace = () => {
    const { debuggerContext } = this.props;
    const fromSpace = debuggerContext.result.value.get_from_space();
    return <span>{fromSpace}</span>;
  };

  private showMemoryHeap = () => {
    const { debuggerContext } = this.props;
    const memoryHeap = debuggerContext.result.value.get_memory_heap();
    return memoryHeap;
  };

  public render() {
    const memoryHeap = this.showMemoryHeap();
    return (
      <div>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <div>
          <p>This is for explanation</p>
          <p>
            Memory size: <this.showMemorySize /> | To Space:{' '}
            <this.showToSpace /> | From Space: <this.showFromSpace />
          </p>
          <p> Step: 1 </p>
        </div>
        <div>
          <div>
            <h3>From Space</h3>
            <div>
              {memoryHeap
                ? memoryHeap.map((item, index) => (
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
          <div>
            <h3>To Space</h3>
            <div>
              {memoryHeap
                ? memoryHeap.map((item, index) => (
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
