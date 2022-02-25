/* [Imports] */
import React from 'react';
import render from '../../bundles/csg/renderer';
import { looseInstanceOf, Shape } from '../../bundles/csg/utilities';
import { DebuggerContext, Props, State } from './types';

/* [Main] */
class CsgCanvasHolder extends React.Component<Props, State> {
  private canvasReference: React.RefObject<HTMLCanvasElement> = React.createRef();

  public constructor(props: Props) {
    super(props);

    this.state = {};
  }

  // Called as part of the React lifecycle when this tab is created.
  // See also issue #2094
  public componentDidMount() {
    const canvas: HTMLCanvasElement | null = this.canvasReference.current;

    if (canvas === null) {
      // Returns are used to control flow without nesting
      return;
    }

    // Since this tab did spawn based on the conditions defined in toSpawn()
    // below, the Source program should've resulted in a Shape.
    const potentialShape: any = this.props.debuggerContext?.result?.value;
    if (!looseInstanceOf(potentialShape, Shape)) {
      return;
    }
    // potentialShape is likely a Shape

    let shape: Shape;
    try {
      shape = potentialShape as Shape;
    } catch (_error: any) {
      // eslint-disable-next-line no-console
      console.error(_error);
      return;
    }

    render(canvas, shape);
  }

  // Only required method of a React Component.
  // Returns a React Element created via JSX to instruct React to render a DOM
  // node. Also attaches the canvasReference via the ref attribute,
  // for imperatively modifying the canvas
  public render() {
    return (
      <div
        style={{
          // Centre canvas when sidebar is wider than it
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <canvas
          ref={this.canvasReference}
          style={{
            // Expand to take as much space as possible,
            // else will have no height
            width: '100%',

            // Flex has auto min width
            // This makes a narrow sidebar shrink it rather than overflow
            minWidth: '0px',

            // Prevent canvas from becoming too large & require lots of
            // scrolling in wide sidebar
            maxWidth: '50vw',

            // Force square ratio,
            // else will have no height
            aspectRatio: '1',
          }}
          width={0}
          height={0}
        />
      </div>
    );
  }
}

export default {
  // Called by the frontend to decide whether to spawn the CSG tab.
  // If the Source program results in a Shape,
  // we use its spawnsTab property to decide
  toSpawn: (debuggerContext: DebuggerContext) => {
    const potentialShape: any = debuggerContext?.result?.value;
    if (!looseInstanceOf(potentialShape, Shape)) {
      return false;
    }
    // potentialShape is likely a Shape

    let shape: Shape;
    try {
      shape = potentialShape as Shape;
    } catch (_error: any) {
      // eslint-disable-next-line no-console
      console.error(_error);
      return false;
    }

    return shape.spawnsTab;
  },

  // Called by the frontend to know what to render in the CSG tab
  body: (debuggerContext: DebuggerContext) => (
    <CsgCanvasHolder
      // debuggerContext passed as part of Component Props
      debuggerContext={debuggerContext}
    />
  ),

  // BlueprintJS icon name
  iconName: 'shapes',

  // Icon tooltip in sidebar
  label: 'CSG Tab',
};
