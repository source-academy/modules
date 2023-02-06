/* [Imports] */
import { Spinner, SpinnerSize } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import React from 'react';
import {
  BP_BORDER_RADIUS,
  BP_TAB_BUTTON_MARGIN,
  BP_TAB_PANEL_MARGIN,
  STANDARD_MARGIN,
} from '../../bundles/csg/constants.js';
import { Core } from '../../bundles/csg/core.js';
import StatefulRenderer from '../../bundles/csg/stateful_renderer.js';
import type { RenderGroup } from '../../bundles/csg/utilities.js';
import HoverControlHint from './hover_control_hint';
import type { CanvasHolderProps, CanvasHolderState } from './types';



/* [Main] */
export default class CanvasHolder extends React.Component<
CanvasHolderProps,
CanvasHolderState
> {
  private readonly canvasReference: React.RefObject<HTMLCanvasElement> = React.createRef();

  private statefulRenderer: StatefulRenderer | null = null;

  constructor(props: CanvasHolderProps) {
    super(props);

    this.state = {
      contextLost: false,
    };
  }

  componentDidMount() {
    console.debug(`>>> MOUNT #${this.props.componentNumber}`);

    let { current: canvas } = this.canvasReference;
    if (canvas === null) return;

    let renderGroups: RenderGroup[] = Core
      .getRenderGroupManager()
      .getGroupsToRender();
    //TODO Issue #35
    let lastRenderGroup: RenderGroup = renderGroups.at(-1) as RenderGroup;

    this.statefulRenderer = new StatefulRenderer(
      canvas,
      lastRenderGroup,
      this.props.componentNumber,

      () => this.setState({ contextLost: true }),
      () => this.setState({ contextLost: false }),
    );
    this.statefulRenderer.start(true);
  }

  componentWillUnmount() {
    console.debug(`>>> UNMOUNT #${this.props.componentNumber}`);

    this.statefulRenderer?.stop(true);
  }

  // Only required method of a React Component. Returns a React Element created
  // via JSX to instruct React to render a DOM node. Also attaches the
  // canvasReference via the ref attribute, for imperatively modifying the
  // canvas
  render() {
    return (
      <>
        <div
          style={{
            display: this.state.contextLost ? 'none' : 'flex',
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
              tooltipText="Zoom in • Scroll up"
              iconName={IconNames.ZOOM_IN}
            />
            <HoverControlHint
              tooltipText="Zoom out • Scroll down"
              iconName={IconNames.ZOOM_OUT}
            />
            <HoverControlHint
              tooltipText="Zoom to fit • Double left-click"
              iconName={IconNames.ZOOM_TO_FIT}
            />
            <HoverControlHint
              tooltipText="Rotate • Left-click"
              iconName={IconNames.REPEAT}
            />
            <HoverControlHint
              tooltipText="Pan • Middle-click OR shift + left-click"
              iconName={IconNames.MOVE}
            />
          </div>

          <div
            style={{
              // Expand to take as much space as possible, otherwise this will
              // have no height
              width: '100%',
              // Prevent canvas from becoming too large when the sidebar is
              // wide, which would require lots of scrolling or never fit
              // entirely on screen. Tall but skinny sidebar maxes width at 70vh
              // (eg portrait mobile view). Short but wide maxes width at 30vw
              // (eg wide desktop view)
              maxWidth: 'max(70vh, 30vw)',
              // Force square aspect ratio, otherwise this will have no height
              aspectRatio: '1',
            }}
          >
            <canvas
              ref={this.canvasReference}
              style={{
                // Inline element would try to align to text baseline, with
                // space below for descender. This prevents that
                display: 'block',

                width: '100%',
                height: '100%',

                borderRadius: BP_BORDER_RADIUS,
              }}
              // These get set on the fly by the dynamic resizer in
              // StatefulRenderer's InputTracker
              width="0"
              height="0"
            />
          </div>
        </div>
        <div
          // Explicit dark theme as mobile view switches to dark text with light
          // spinner
          className="bp3-dark"
          style={{
            display: this.state.contextLost ? 'block' : 'none',

            textAlign: 'center',
          }}
        >
          <h2
            style={{
              margin: `0px 0px ${STANDARD_MARGIN} 0px`,
            }}
          >
            WebGL Context Lost
          </h2>
          <Spinner intent="warning" size={SpinnerSize.LARGE} />
          <p
            style={{
              margin: `${STANDARD_MARGIN} 0px 0px 0px`,
            }}
          >
            Your GPU is probably busy. Waiting for browser to re-establish connection...
          </p>
        </div>
      </>
    );
  }
}
