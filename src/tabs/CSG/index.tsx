import React from 'react';
import render from '../../bundles/csg/renderer';
import { looseInstanceOf, Shape } from '../../bundles/csg/utilities';

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
type State = {};

/**
 * The main React Component of the Tab.
 */
class CsgCanvas extends React.Component<Props, State> {
  private canvas: HTMLCanvasElement | null = null;

  public constructor(props: Props) {
    super(props);

    this.state = {};
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
