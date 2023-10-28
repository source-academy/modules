import { make_sound, play, play_in_tab } from '../functions'

describe('Test make_sound', () => {
  test('Should error gracefully when duration is negative', () => {
    expect(() => make_sound(() => 0, -1))
      .toThrowErrorMatchingInlineSnapshot('"Sound duration must be greater than or equal to 0"')
  })

  test('Should not error when duration is zero', () => {
    expect(() => make_sound(() => 0, 0)).not.toThrow()
  })
})

describe('Test play', () => {
  test('Should error gracefully when duration is negative', () => {
    const sound = [t => 0, -1];
    expect(() => play(sound as any))
      .toThrowErrorMatchingInlineSnapshot('"play: duration of sound is negative"')
  })

  test('Should not error when duration is zero', () => {
    const sound = make_sound(t => 0, 0);
    expect(() => play(sound)).not.toThrow()
  })
})

describe('Test play_in_tab', () => {
  test('Should error gracefully when duration is negative', () => {
    const sound = [t => 0, -1];
    expect(() => play_in_tab(sound as any))
      .toThrowErrorMatchingInlineSnapshot('"play_in_tab: duration of sound is negative"')
  })

  test('Should not error when duration is zero', () => {
    const sound = make_sound(t => 0, 0);
    expect(() => play_in_tab(sound)).not.toThrow()
  })
})