import { Button, Icon, Menu } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';

type UserButtonDisplayProps = {
  max: number;
  buttons: [string, () => void][];
  onClick: () => void;
};
const UserToolbar = ({ max, buttons, onClick }: UserButtonDisplayProps) => {
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
        func();
        onClick();
      }}
    >
      {text}
    </Button>)}
    {overflowButtons.length > 0 && <Popover2
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
              func();
              onClick();
            }}
          >
            {text}
          </Button>)}
        </div>
      </Menu>}
      renderTarget={({ ref, ...targetProps }) => <Button
        style={{
          alignSelf: 'flex-end',
        }}
        elementRef={ref}
        {...targetProps}
      >
        <Icon icon="widget-button"/>
      </Button>
      }
    />}
  </div>;
};

export default UserToolbar;
