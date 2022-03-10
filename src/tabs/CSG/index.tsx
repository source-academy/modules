import React from 'react';
import { Icon } from '@blueprintjs/core';
import render from '../../bundles/csg/renderer';
import {
  looseInstanceOf,
  Shape,
  toolTipText,
} from '../../bundles/csg/utilities';

/**
 * React Component props for the Tab.
 */
type Props = {
  children?: never;
  className?: never;
  context?: any;
};

/**
 * React Component state for the Tab.
 */
type State = {
  zoomTooltip: String;
  angleTooltip: String;
  perspectiveTooltip: String;
  fitTooltip: String;
};

/**
 * The main React Component of the Tab.
 */
class CsgCanvas extends React.Component<Props, State> {
  private canvas: HTMLCanvasElement | null = null;

  public constructor(props: Props) {
    super(props);

    this.state = {
      zoomTooltip: 'hidden',
      angleTooltip: 'hidden',
      perspectiveTooltip: 'hidden',
      fitTooltip: 'hidden',
    };
  }

  /**
   * This function is called when the tab is created.
   * This is the entrypoint for the tab.
   */
  public componentDidMount() {
    if (this.canvas) {
      const {
        context: {
          result: { value: potentialShape },
        },
      }: any = this.props;
      if (looseInstanceOf(potentialShape, Shape)) {
        render(this.canvas, potentialShape as Shape);
      }
    }
  }

  /**
   * This function sets the layout of the React Component in HTML
   * Notice the the Canvas hook in "ref" property.
   * @returns HTMLComponent
   */
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
          width: '100%',
          display: 'flex',
          paddingLeft: '20px',
          paddingRight: '20px',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
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
          style={{ marginTop: '10px' }}
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
  /**
   * This function will be called to determine if the component will be
   * rendered. Currently spawns when the result in the REPL is "<RUNE>".
   * @param {DebuggerContext} context
   * @returns {boolean}
   */
  toSpawn: (context: any) => {
    const potentialShape: any = context.result.value;
    if (looseInstanceOf(potentialShape, Shape)) {
      try {
        return (potentialShape as Shape).spawnsTab;
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
      return false;
    }
    return false;
  },

  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  body: (context: any) => <CsgCanvas context={context} />,

  /**
   * The Tab's icon tooltip in the side contents on Source Academy frontend.
   */
  label: 'CSG Tab',

  /**
   * BlueprintJS IconName element's name, used to render the icon which will be
   * displayed in the side contents panel.
   * @see https://blueprintjs.com/docs/#icons
   */
  iconName: 'shapes',
};
