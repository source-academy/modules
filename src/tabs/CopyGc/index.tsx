import React from 'react';
import copy_gc from '../../bundles/copy_gc';

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
    console.log('the copying garbage ', copy_gc().get_memory_size);
    console.log(debuggerContext);
  }

  private showMemorySize = () => {
    const memorySize = copy_gc().get_memory_size();
    console.log('show memory size ', memorySize);
    return <span>{memorySize}</span>;
  };

  public render() {
    return (
      <div>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <div>
          <p>This is for explanation</p>
          <p>
            Memory size: <this.showMemorySize />
          </p>
          <p>Tospace: {copy_gc().TO_SPACE}</p>
          <p>from space: {copy_gc().FROM_SPACE}</p>
        </div>
        <div>
          <div>
            <p>this is from space</p>
            <div>
              <p>memory space</p>
              <canvas
                width={10}
                height={10}
                style={{ backgroundColor: 'lightblue' }}
              />
            </div>
          </div>
          <div>
            <p>this is to space</p>
            <div>
              <p>memory space</p>
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
