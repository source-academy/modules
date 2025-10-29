import {
  Alignment,
  Button,
  Card,
  Checkbox,
  Icon,
  Menu,
  MenuDivider,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  Popover,
  Tooltip
} from '@blueprintjs/core';

import type { Matrix, MatrixModuleState } from '@sourceacademy/bundle-matrix/types';
import MultiItemDisplay from '@sourceacademy/modules-lib/tabs/MultiItemDisplay/index';
import { defineTab } from '@sourceacademy/modules-lib/tabs/utils';
import { useState, type ReactNode } from 'react';
import MatrixDisplay from './MatrixDisplay';
import MatrixOutput from './MatrixOutput';
import UserToolbar from './UserToolbar';

interface StackProps {
  direction: 'row' | 'column';
  children?: ReactNode[];
  alignItems: any;
};

const Stack = ({ direction, children, alignItems }: StackProps) => <div
  style={{
    display: 'flex',
    flexDirection: direction,
    alignItems,
  }}
>
  {children}
</div>;

interface MatrixInstanceProps {
  matrix: Matrix;
  index: number;
};

/**
 * React component to display a Matrix, complete with its installed buttons
 */
function MatrixInstance({ matrix, index }: MatrixInstanceProps) {
  // Use this state variable to force React to rerender
  const [, setUpdater] = useState(0);
  const [matrixErrors, setMatrixErrors] = useState<any[]>([]);
  const rerender = () => setUpdater(x => x + 1);

  const [hoverCoords, setHoverCoords] = useState<[number | false, number | false] | false>(false);
  const [showColLabels, setShowColLabels] = useState(false);

  const settingsMenu = <Popover
    content={<Menu>
      <MenuDivider title="Settings" />
      <MenuDivider />
      <Checkbox checked={showColLabels} onChange={() => setShowColLabels(!showColLabels)}>
        Show Row and Column Labels
      </Checkbox>
    </Menu>}
    renderTarget={targetProps => (
      <Tooltip content="Tab Settings">
        <Button
          {...targetProps}
        >
          <Icon icon="settings" />
        </Button>
      </Tooltip>
    )}
  />;

  const userButtons = matrix.buttons.length > 0
    ? <UserToolbar
        max={5}
        buttons={matrix.buttons}
        onClick={rerender}
    />
    : <p style={{
      fontSize: '12px',
      textAlign: 'center',
      color: 'GrayText',
    }}>
      Use <code>install_buttons()</code><br />to place some buttons here
    </p>;

  const coordIndicator = <p>
    (<code>
      {hoverCoords === false
        ? ' , '
        : `${hoverCoords[0] === false ? ' ' : hoverCoords[0]},${hoverCoords[1] === false ? ' ' : hoverCoords[1]}`
      }
    </code>)
  </p>;

  return <Stack
    direction="column"
    alignItems="center"
  >
    <h2>{matrix.name ?? `Matrix ${index + 1}`}</h2>
    <Card elevation={2}>
      <div style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}>
        <Navbar>
          <NavbarGroup align={Alignment.START}>
            {settingsMenu}
            <Navbar.Divider />
          </NavbarGroup>
          <NavbarGroup>
            {userButtons}
          </NavbarGroup>
          <Navbar.Group align={Alignment.END}>
            <NavbarDivider />
            {coordIndicator}
          </Navbar.Group>
        </Navbar>
        <div style={{
          marginTop: '10px',
          marginBottom: '10px',
        }}>
          <MatrixDisplay
            hoverCoords={hoverCoords}
            onHoverChange={setHoverCoords}
            rerenderCallback={rerender}
            matrix={matrix}
            showColLabels={showColLabels}
            onError={(_, err) => {
              setMatrixErrors(curr => [...curr, err]);
            }}
          />
        </div>
      </div>
    </Card>
    <div style={{
      padding: '5px',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '5px'
      }}>
        <h4>Matrix Error Output</h4>
        <Button
          onClick={() => setMatrixErrors([])}
        >
          <Icon icon='trash' />
        </Button>
      </div>
      <MatrixOutput errors={matrixErrors} />
    </div>
  </Stack>;
}

interface MatrixTabProps {
  moduleState: MatrixModuleState;
};
function MatrixTab({ moduleState: state }: MatrixTabProps) {
  const elements = state.matrices.map((matrix, i) => <MatrixInstance
    matrix={matrix}
    index={i}
  />);

  return <MultiItemDisplay elements={elements} />;
}

export default defineTab({
  toSpawn: ({ context }) => context.moduleContexts.matrix?.state.matrices.length > 0,
  body: ({ context: { moduleContexts: { matrix } } }) => <MatrixTab moduleState={matrix.state} />,
  iconName: 'heat-grid',
  label: 'Matrix Tab',
});
