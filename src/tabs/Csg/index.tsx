/* [Imports] */
import { Icon } from '@blueprintjs/core';
import React from 'react';
import render from '../../bundles/csg/renderer';
import {
  looseInstanceOf,
  Shape,
  toolTipText,
} from '../../bundles/csg/utilities';
import { DebuggerContext, Props, State } from './types';

/* [Main] */
class CsgCanvasHolder extends React.Component<Props, State> {
  private canvasReference: React.RefObject<HTMLCanvasElement> = React.createRef();

  public constructor(props: Props) {
    super(props);

    this.state = {
      zoomTooltip: 'hidden',
      angleTooltip: 'hidden',
      perspectiveTooltip: 'hidden',
      fitTooltip: 'hidden',
    };
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
    const {
      zoomTooltip,
      angleTooltip,
      perspectiveTooltip,
      fitTooltip,
    } = this.state;

    const zoomStyle: React.CSSProperties = {
      ...toolTipText,
      ...{ visibility: zoomTooltip },
    } as React.CSSProperties;
    const angleStyle: React.CSSProperties = {
      ...toolTipText,
      ...{ visibility: angleTooltip },
    } as React.CSSProperties;
    const perspectiveStyle: React.CSSProperties = {
      ...toolTipText,
      ...{ visibility: perspectiveTooltip },
    } as React.CSSProperties;
    const fitStyle: React.CSSProperties = {
      ...toolTipText,
      ...{ visibility: fitTooltip },
    } as React.CSSProperties;

    const stack: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      width: '64px',
    } as React.CSSProperties;

    const centerStyle: React.CSSProperties = {
      marginLeft: '-100%',
      marginRight: '-100%',
      textAlign: 'center',
      wordBreak: 'break-word',
      inlineSize: '80px',
      color: '#7b7b7b',
    } as React.CSSProperties;

    const containerStyle: React.CSSProperties = {
      padding: '10px',
      position: 'relative',
    } as React.CSSProperties;

    return (
      <div
        style={{
          // Centre canvas when sidebar is wider than it
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
            marginBottom: '10px',
          }}
        >
          <div
            style={containerStyle}
            onMouseEnter={() => this.setState({ zoomTooltip: 'visible' })}
            onMouseLeave={() => this.setState({ zoomTooltip: 'hidden' })}
          >
            <span style={zoomStyle}>Scroll Up and Down</span>
            <div style={stack}>
              <Icon icon='zoom-in' size={20} color='#7b7b7b' />
              <span style={centerStyle}> Zoom </span>
            </div>
          </div>
          <div
            style={containerStyle}
            onMouseEnter={() => this.setState({ angleTooltip: 'visible' })}
            onMouseLeave={() => this.setState({ angleTooltip: 'hidden' })}
          >
            <span style={angleStyle}>Left Click Drag</span>
            <div style={stack}>
              <Icon icon='repeat' size={20} color='#7b7b7b' />
              <span style={centerStyle}> Camera Angle </span>
            </div>
          </div>
          <div
            style={containerStyle}
            onMouseEnter={() =>
              this.setState({ perspectiveTooltip: 'visible' })
            }
            onMouseLeave={() => this.setState({ perspectiveTooltip: 'hidden' })}
          >
            <span style={perspectiveStyle}>Shift + Left Click Drag</span>
            <div style={stack}>
              <Icon icon='layer-outline' size={20} color='#7b7b7b' />
              <span style={centerStyle}> Camera Perspective </span>
            </div>
          </div>
          <div
            style={containerStyle}
            onMouseEnter={() => this.setState({ fitTooltip: 'visible' })}
            onMouseLeave={() => this.setState({ fitTooltip: 'hidden' })}
          >
            <span style={fitStyle}> Double Left Click </span>
            <div style={stack}>
              <Icon icon='zoom-to-fit' size={20} color='#7b7b7b' />
              <span style={centerStyle}> Zoom to Fit</span>
            </div>
          </div>
        </div>

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
  toSpawn(debuggerContext: DebuggerContext) {
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
