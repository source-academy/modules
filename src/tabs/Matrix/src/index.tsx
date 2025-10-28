import {
  Alignment,
  Button,
  Card,
  Checkbox,
  Icon,
  Menu,
  MenuDivider,
  Navbar,
  Popover,
  Tooltip
} from '@blueprintjs/core';

import type { Matrix, MatrixModuleState } from '@sourceacademy/bundle-matrix/types';
import MultiItemDisplay from '@sourceacademy/modules-lib/tabs/MultiItemDisplay';
import { defineTab } from '@sourceacademy/modules-lib/tabs/utils';
import { useState } from 'react';
import MatrixDisplay from './MatrixDisplay';
import UserToolbar from './UserToolbar';

// return <div style={{
//   display: 'flex',
//   flexDirection: 'row',
//   alignItems: 'center',
//   justifyContent: 'space-evenly',
// }}>
//   {displayedButtons.map(([text, func], i) => <Button
//     style={{
//       marginLeft: '1px',
//       marginRight: '1px',
//     }}
//     key={i}
//     onClick={() => {
//       func();
//       onClick();
//     }}
//   >
//     {text}
//   </Button>)}
//   {overflowButtons.length > 0 && <Popover2
//     content={<Menu>
//       <div style={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         columnGap: '2px',
//       }}>
//         {overflowButtons.map(([text, func], i) => <Button
//           key={i}
//           onClick={() => {
//             func();
//             onClick();
//           }}
//         >
//           {text}
//         </Button>)}
//       </div>
//     </Menu>}
//     renderTarget={({ ref, ...targetProps }) => <Button
//       elementRef={ref}
//       {...targetProps}
//     >
//       <Icon icon="widget-button"/>
//     </Button>}
//   />}
// </div>;
type StackProps = {
  direction: 'row' | 'column';
  children?: JSX.Element[];
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

function MatrixInstance({ matrix, index }: MatrixInstanceProps) {
  // Use this state variable to force React to rerender
  const [updater, setUpdater] = useState(0);
  const rerender = () => setUpdater(updater + 1);

  const [hoverCoords, setHoverCoords] = useState<[number | false, number | false] | false>(false);
  const [showColLabels, setShowColLabels] = useState(false);
  const [showCellLabels, setShowCellLabels] = useState(false);

  const settingsMenu = <Popover
    content={<Menu>
      <MenuDivider title="Settings" />
      <MenuDivider />
      <Checkbox checked={showColLabels} onChange={() => setShowColLabels(!showColLabels)}>
        Show Row and Column Labels
      </Checkbox>
      <Checkbox checked={showCellLabels} onChange={() => setShowCellLabels(!showCellLabels)}>
        Show Cell Labels
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
    )} />;

  const userButtons = matrix.buttons.length > 0
    ? (
      <UserToolbar
        max={5}
        buttons={matrix.buttons}
        onClick={() => rerender()} />
    )
    : (
      <p style={{
        fontSize: '12px',
        textAlign: 'center',
        color: 'GrayText',
      }}>
        Use <code>install_buttons()</code><br />to place some buttons here
      </p>
    );

  const coordIndicator = (
    <p>
      (<code>
        {hoverCoords === false
          ? ' , '
          : `${hoverCoords[0] === false ? ' ' : hoverCoords[0]},${hoverCoords[1] === false ? ' ' : hoverCoords[1]}`}
      </code>)
    </p>
  );

  return <Stack
    direction="column"
    alignItems="center"
  >
   <h2>{matrix.name ?? `Matrix ${index + 1}`}</h2>
    <Card elevation={2}>
      <Stack
        direction="column"
        alignItems="center"
      >
        <Navbar>
          <Navbar.Group align={Alignment.START}>
            {settingsMenu}
            <Navbar.Divider />
          </Navbar.Group>
          <Navbar.Group>
            {userButtons}
          </Navbar.Group>
          <Navbar.Group align={Alignment.END}>
            <Navbar.Divider />
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
            rerenderCallback={() => rerender()}
            matrix={matrix}
            showCellLabels={showCellLabels}
            showColLabels={showColLabels} />
        </div>
      </Stack>
    </Card>
  </Stack>;
}

interface MatrixTabProps {
  moduleState: MatrixModuleState;
};
function MatrixTab({ moduleState: state }: MatrixTabProps) {
  const elements = state.matrices.map((matrix, i) => <MatrixInstance
    matrix={matrix}
    index={i} />);

  return <MultiItemDisplay elements={elements} />;
}

export default defineTab({
  toSpawn: ({ context }) => context.moduleContexts.matrix?.state.matrices.length > 0,
  body: ({ context: { moduleContexts: { matrix } } }) => <MatrixTab moduleState={matrix.state} />,
  iconName: 'heat-grid',
  label: 'Matrix Tab',
});
