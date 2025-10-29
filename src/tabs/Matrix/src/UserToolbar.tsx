import { Button, Icon, Menu, Popover } from '@blueprintjs/core';

interface UserButtonDisplayProps {
  /**
   * The maximum number of buttons that can be displayed at once
   */
  max: number;
  buttons: [string, () => void][];

  /**
   * Callback that is called with the name of the button whenever a button is clicked
   */
  onClick?: (name: string) => void;

  /**
   * Callback that is called when a user provided function throws an error
   */
  onError?: (error: unknown) => void;
};

/**
 * React component for displaying a Matrix's installed buttons
 */
export default function UserToolbar({ max, buttons, onClick, onError }: UserButtonDisplayProps) {
  const displayedButtons = buttons.slice(0, max + 1);
  const overflowButtons = buttons.slice(max + 1);

  return <div style={{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  }}>
    {displayedButtons.map(([text, func], i) => <Button
      style={{
        marginLeft: '1px',
        marginRight: '1px',
      }}
      key={i}
      onClick={() => {
        try {
          func();
          onClick?.(text);
        } catch (error) {
          onError?.(error);
        }
      }}
    >
      {text}
    </Button>)}
    {overflowButtons.length > 0 && <Popover
      content={<Menu>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          columnGap: '2px',
        }}>
          {overflowButtons.map(([text, func], i) => <Button
            key={i}
            onClick={() => {
              try {
                func();
                onClick?.(text);
              } catch (error) {
                onError?.(error);
              }
            }}
          >
            {text}
          </Button>)}
        </div>
      </Menu>}
      renderTarget={targetProps => <Button
        style={{
          alignSelf: 'flex-end',
        }}
        {...targetProps}
      >
        <Icon icon="widget-button" />
      </Button>} />}
  </div>;
}
