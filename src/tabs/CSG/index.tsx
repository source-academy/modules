import React from 'react';
import drawCSG from '../../bundles/csg/renderer';
import { Shape } from '../../bundles/csg/utilities';

type Props = {
  debuggerContext: any;
};

type State = {};

class WebGLCanvas extends React.Component<Props, State> {
  private canvas: HTMLCanvasElement | null = null;

  public constructor(props: Props) {
    super(props);

    this.state = {};
  }

  public componentDidMount() {
    if (this.canvas === null) {
      return;
    }

    //FIXME
    console.log("HTMLCanvasElement", this.canvas)
    console.log("Props", this.props)

    // Since the tab did spawn, the program should've resulted in a Shape (?).
    // ESLint configured to require destructuring assignment like this
    const {
      debuggerContext: {
        result: { potentialShape },
      },
    }: any = this.props;
    if (!(potentialShape instanceof Shape)) {
      return;
    }

    drawCSG(this.canvas, potentialShape as Shape);
  }

  //TODO to go over
  public render() {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          paddingLeft: '20px',
          paddingRight: '20px',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <canvas
          id='csgCanvas'
          ref={(r) => {
            this.canvas = r;
          }}
          width={512}
          height={512}
        />
      </div>
    );
  }
}

export default {
  // DebuggerContext from frontend WorkspaceTypes
  toSpawn: (debuggerContext: any) => {
    //FIXME
    console.log("DebuggerContext", debuggerContext)

    const potentialShape: any = debuggerContext?.result?.value;
    // instanceof is a TS type guard, automatic type narrowing
    console.log(potentialShape)
    console.log(new Shape(() => []))
    console.log(new Shape(() => []) instanceof Shape)
    if (potentialShape instanceof Shape) {
      console.log(potentialShape)
      return potentialShape.spawnsTab;
    }

    // return true;
    console.log(potentialShape instanceof Shape)
    return false;
  },
  // Prettier requires no block for single line function,
  // but needs parentheses on new line as exceeds column width
  body: (debuggerContext: any) => (
    <WebGLCanvas debuggerContext={debuggerContext} />
  ),
  label: 'CSG Tab',
  iconName: 'media',
};
