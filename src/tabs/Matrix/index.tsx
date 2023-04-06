import { createContext, useContext, useState } from 'react';

import {
  Alignment,
  Button,
  Card,
  Checkbox,
  Icon,
  Menu,
  MenuDivider,
  Navbar,
} from '@blueprintjs/core';
import { Popover2, Tooltip2 } from '@blueprintjs/popover2';

import MultiItemDisplay from '../common/multi_item_display';
import type { Matrix, MatrixModuleState } from '../../bundles/matrix/types';
import UserToolbar from './UserToolbar';
import MatrixDisplay from './MatrixDisplay';

const SettingsContext = createContext<{
  showColLabels: boolean;
  setShowColLabels: (val: boolean) => void,
  showCellLabels: boolean;
  setShowCellLabels: (val: boolean) => void;
  // eslint-disable-next-line indent
}>({
      showColLabels: false,
      setShowColLabels() {},
      showCellLabels: false,
      setShowCellLabels() {},
    });



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
  direction: 'row' | 'column',
  children?: JSX.Element[]
  alignItems: any
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

type DisplayProps = {
  matrix: Matrix;
  index: number;
};
const MatrixInstance = ({ matrix, index }: DisplayProps) => {
  // Use this state variable to force React to rerender
  const [updater, setUpdater] = useState(0);
  const rerender = () => setUpdater(updater + 1);

  const {
    showColLabels,
    setShowColLabels,
    showCellLabels,
    setShowCellLabels,
  } = useContext(SettingsContext);
  const [hoverCoords, setHoverCoords] = useState<[number | false, number | false] | false>(false);

  const settingsMenu = <Popover2
    content={
      <Menu>
        <MenuDivider title="Settings" />
        <MenuDivider />
        <Checkbox checked={showColLabels} onChange={() => setShowColLabels(!showColLabels)}>
            Show Row and Column Labels
        </Checkbox>
        <Checkbox checked={showCellLabels} onChange={() => setShowCellLabels(!showCellLabels)}>
          Show Cell Labels
        </Checkbox>
      </Menu>
    }
    renderTarget={({ ref, ...targetProps }) => (
      <Tooltip2 content="Tab Settings">
        <Button
          elementRef={ref}
          {...targetProps}
        >
          <Icon icon="settings"/>
        </Button>
      </Tooltip2>
    )}
  />;

  const userButtons = matrix.buttons.length > 0
    ? (
      <UserToolbar
        max={5}
        buttons={matrix.buttons}
        onClick={() => rerender()}
      />
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
        {
          hoverCoords === false
            ? ' , '
            : `${hoverCoords[0] === false ? ' ' : hoverCoords[0]},${hoverCoords[1] === false ? ' ' : hoverCoords[1]}`
        }
      </code>)
    </p>
  );

  return <Stack
    direction="column"
    alignItems="center"
  >
    <h2>Matrix {index + 1}</h2>
    <Card elevation={2}>
      <Stack
        direction="column"
        alignItems="center"
      >
        <Navbar>
          <Navbar.Group align={Alignment.LEFT}>
            {settingsMenu}
            <Navbar.Divider />
          </Navbar.Group>
          <Navbar.Group>
            {userButtons}
          </Navbar.Group>
          <Navbar.Group align={Alignment.RIGHT}>
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
            showColLabels={showColLabels}
          />
        </div>
      </Stack>
    </Card>
  </Stack>;
};

type TabProps = {
  moduleState: MatrixModuleState,
};
const MatrixTab = ({ moduleState: state }: TabProps) => {
  const [showColLabels, setShowColLabels] = useState(state.showColLabels ?? false);
  const [showCellLabels, setShowCellLabels] = useState(state.showColLabels ?? false);

  const elements = state.matrices.map((matrix, i) => <MatrixInstance
    matrix={matrix}
    index={i}
  />);
  return (
    <SettingsContext.Provider value={{
      showColLabels,
      setShowColLabels(value) {
        setShowColLabels(value);
        state.showColLabels = value;
      },
      showCellLabels,
      setShowCellLabels(value) {
        setShowCellLabels(value);
        state.showCellLabels = value;
      },
    }}>
      <MultiItemDisplay elements={elements} />
    </SettingsContext.Provider>
  );
};

export default {
  toSpawn: ({ context }) => context.moduleContexts.matrix?.state.matrices.length > 0,
  body: ({ context: { moduleContexts: { matrix } } }) => <MatrixTab moduleState={matrix.state} />,
  iconName: 'heat-grid',
  label: 'Matrix Tab',
};
