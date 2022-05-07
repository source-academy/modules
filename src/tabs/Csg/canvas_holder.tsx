/* [Imports] */
import { IconNames } from '@blueprintjs/icons';
import React from 'react';
import {
  BP_BORDER_RADIUS,
  BP_TAB_BUTTON_MARGIN,
  BP_TAB_PANEL_MARGIN,
} from '../../bundles/csg/constants.js';
import render from '../../bundles/csg/renderer';
import HoverControlHint from './hover_control_hint';
import { CanvasHolderProps, CanvasHolderState } from './types';

/* [Main] */
export default class CanvasHolder extends React.Component<
  CanvasHolderProps,
  CanvasHolderState
> {
  private canvasReference: React.RefObject<HTMLCanvasElement> = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      getCurrentRequestId: () => 0
    }
  }

  // Called as part of the React lifecycle when this tab is created
  public componentDidMount() {
    let canvas: HTMLCanvasElement | null = this.canvasReference.current;
    if (canvas === null) return;

    let getCurrentRequestId: () => number = render(
      canvas,
      this.props.moduleState
    );

    // @ts-ignore
    this.state.getCurrentRequestId = getCurrentRequestId;
  }

  public componentWillUnmount() {
    let canvas: HTMLCanvasElement | null = this.canvasReference.current;
    if (canvas === null) return;

    // Stops old render loop upon re-run to prevent regl context lost errors
    canvas.addEventListener('webglcontextlost', () =>
      window.cancelAnimationFrame(this.state.getCurrentRequestId())
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
            gap: BP_TAB_BUTTON_MARGIN,

            marginRight: BP_TAB_PANEL_MARGIN,
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

        <div
          style={{
            // Expand to take as much space as possible, otherwise this will
            // have no height
            width: '100%',
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
        >
          <canvas
            ref={this.canvasReference}
            style={{
              // Inline element tries to align to text baseline, with space
              // below for descender. This prevents that
              display: 'block',

              width: '100%',
              height: '100%',

              borderRadius: BP_BORDER_RADIUS,
            }}
            // These get set on the fly by our renderer's dynamic resizer
            width='0'
            height='0'
          />
        </div>
      </div>
    );
  }
}
