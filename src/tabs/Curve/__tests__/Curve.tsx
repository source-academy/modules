import { CurveTab } from ".."
import { animate_3D_curve, animate_curve, draw_3D_connected, draw_connected } from "../../../bundles/curve"
import type { CurveModuleState } from "../../../bundles/curve/types"
import { mockDebuggerContext } from "../../common/testUtils"

test('Curve animations error gracefully', () => {
  const badAnimation = animate_curve(1, 60, draw_connected(200), t => 1 as any)
  const mockContext = mockDebuggerContext<CurveModuleState>({ drawnCurves: [badAnimation] }, 'curve');
  expect(<CurveTab context={mockContext} />)
    .toMatchSnapshot()
})

test('Curve 3D animations error gracefully', () => {
  const badAnimation = animate_3D_curve(1, 60, draw_3D_connected(200), t => 1 as any)
  const mockContext = mockDebuggerContext<CurveModuleState>({ drawnCurves: [badAnimation] }, 'curve');
  expect(<CurveTab context={mockContext} />)
    .toMatchSnapshot()
})