import { RuneTab } from "..";
import { animate_rune } from "../../../bundles/rune"
import type { RuneModuleState } from "../../../bundles/rune/functions";
import { mockDebuggerContext } from "../../common/testUtils";

test('Ensure that rune animations error gracefully', () => {
  const badAnimation = animate_rune(1, 60, t => 1 as any);
  const mockContext = mockDebuggerContext<RuneModuleState>({ drawnRunes: [badAnimation ]}, 'rune');
  expect(<RuneTab context={mockContext} />)
    .toMatchSnapshot();
})