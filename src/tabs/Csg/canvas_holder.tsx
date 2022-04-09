/* [Imports] */
import { IconNames } from '@blueprintjs/icons';
import React from 'react';
import render from '../../bundles/csg/renderer';
import { looseInstanceOf, Shape } from '../../bundles/csg/utilities';
import HoverControlHint from './hover_control_hint';
import { CanvasProps, CanvasState } from './types';

/* [Main] */
export default class CanvasHolder extends React.Component<
  CanvasProps,
  CanvasState
> {
  private canvasReference: React.RefObject<HTMLCanvasElement> = React.createRef();

  // Called as part of the React lifecycle when this tab is created.
  // See also issue #2094
  public componentDidMount() {
    const canvas: HTMLCanvasElement | null = this.canvasReference.current;

    if (canvas === null) {
      return;
    }

    // Since this tab did spawn based on the conditions defined in toSpawn()
    // below, the Source program should've resulted in a Shape
    const potentialShape: any = this.props.debuggerContext?.result?.value;
    if (!looseInstanceOf(potentialShape, Shape)) {
      return;
    }
    // potentialShape is likely a Shape

    let shape: Shape;
    try {
      shape = potentialShape as Shape;
    } catch (error: any) {
      console.error(error);
      return;
    }

    const getCurrentRequestId: () => number = render(canvas, shape);
    
    // Clears regl context animation request when re-run.
    canvas.addEventListener('webglcontextlost', () =>
      window.cancelAnimationFrame(getCurrentRequestId())
    );

    // Clears regl context animation request if source academy tab is closed.
    window.addEventListener('beforeunload', () =>
      window.cancelAnimationFrame(getCurrentRequestId())
    );
  }

  // Only required method of a React Component.
  // Returns a React Element created via JSX to instruct React to render a DOM
  // node.
  // Also attaches the canvasReference via the ref attribute, for imperatively
  // modifying the canvas
  public render() {
    return (
      <div
        style={{
          display: 'flex',
          // Centre content when sidebar is wider than it
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            justifyContent: 'space-evenly',
          }}
        >
          <HoverControlHint
            tooltipText='Zoom in • Scroll up'
            iconName={IconNames.ZOOM_IN}
          />
          <HoverControlHint
            tooltipText='Zoom out • Scroll down'
            iconName={IconNames.ZOOM_OUT}
          />
          <HoverControlHint
            tooltipText='Zoom to fit • Double left-click'
            iconName={IconNames.ZOOM_TO_FIT}
          />
          <HoverControlHint
            tooltipText='Rotate • Left-click'
            iconName={IconNames.REPEAT}
          />
          <HoverControlHint
            tooltipText='Pan • Middle-click OR shift + left-click'
            iconName={IconNames.MOVE}
          />
        </div>

        <canvas
          ref={this.canvasReference}
          style={{
            // Expand to take as much space as possible, otherwise this will
            // have no height
            width: '100%',
            // Flex has min width set to auto by default, causing this to
            // overflow.
            // Setting this makes a narrow sidebar shrink this instead
            minWidth: '0px',
            // Prevent canvas from becoming too large when the sidebar is wide,
            // which would require lots of scrolling or never fit entirely on
            // screen.
            // Tall but skinny sidebar maxes width at 70vh (eg portrait mobile
            // view).
            // Short but wide maxes width at 30vw (eg wide desktop view)
            maxWidth: 'max(70vh, 30vw)',
            // Force square aspect ratio, otherwise this will have no height
            aspectRatio: '1',
          }}
          width='0'
          height='0'
        />
      </div>
    );
  }
}
