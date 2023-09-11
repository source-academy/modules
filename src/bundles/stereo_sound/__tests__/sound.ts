
import { createContext, runInContext } from "js-slang"
import { Chapter, Variant } from "js-slang/dist/types"
import { mockSourceModule } from "../../../testUtils"

test('Make sure the sound bundle works with js-slang', async () => {
  const testCode = `
    import { sine_sound, play } from 'stereo_sound';
    play(sine_sound(440, 0.1));
  `

  const mockSpawnTab = jest.fn()
  window.AudioContext = jest.fn()

  const testContext = createContext(Chapter.SOURCE_4, Variant.DEFAULT, [], {
    spawnTab: mockSpawnTab
  })

  mockSourceModule('stereo_sound')
  await runInContext(testCode, testContext)

  expect(testContext.errors.length).toEqual(0)
  expect(mockSpawnTab).toHaveBeenCalledTimes(1)
  expect('stereo_sound' in testContext.moduleContexts).toEqual(true)
  expect(testContext.moduleContexts.stereo_sound.state.audioPlayed.length).toEqual(1)
})