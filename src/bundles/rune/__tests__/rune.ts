
import { createContext, runInContext } from "js-slang"
import { Chapter, Variant } from "js-slang/dist/types"
import { mockSourceModule } from "../../../testUtils"

test('Make sure the rune bundle works with js-slang', async () => {
  const testCode = `
    import { show, heart, sail } from 'rune';
    show(heart);
    show(sail);
  `

  const mockSpawnTab = jest.fn()

  const testContext = createContext(Chapter.SOURCE_4, Variant.DEFAULT, [], {
    spawnTab: mockSpawnTab
  })

  mockSourceModule('rune')
  await runInContext(testCode, testContext)

  expect(testContext.errors.length).toEqual(0)
  expect(mockSpawnTab).toHaveBeenCalledTimes(1)
  expect('rune' in testContext.moduleContexts).toEqual(true)
  expect(testContext.moduleContexts.rune.drawnRunes.length).toEqual(2)
})