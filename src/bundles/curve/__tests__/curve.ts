
import { createContext, runInContext } from "js-slang"
import { Chapter, Variant } from "js-slang/dist/types"
import { mockSourceModule } from "../../../testUtils"


test('Make sure the curve bundle works with js-slang', async () => {
  const testCode = `
    import { draw_connected, make_point } from 'curve';
    draw_connected(200)(t => make_point(t, 0.5));
    draw_connected(200)(t => make_point(t, 0.5));
  `

  const mockSpawnTab = jest.fn()

  const testContext = createContext(Chapter.SOURCE_4, Variant.DEFAULT, [], {
    spawnTab: mockSpawnTab
  })

  mockSourceModule('curve')
  await runInContext(testCode, testContext)

  expect(mockSpawnTab).toHaveBeenCalledTimes(1)
  expect('curve' in testContext.moduleContexts).toEqual(true)
  expect(testContext.moduleContexts.curve.drawnCurves.length).toEqual(2)
})