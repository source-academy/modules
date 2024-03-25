import { isPascalCase, isSnakeCase } from '../utilities'

function testFunction(
  func: (value: string) => boolean,
  tcs: [string, boolean][]
) {
  describe(`Testing ${func.name}`, () => test.each(tcs)('%#: %s', (value, valid) => expect(func(value))
    .toEqual(valid)))
}

testFunction(isPascalCase, [
  ['PascalCase', true],
  ['snake_case', false],
  ['Snake_Case', false]
])

testFunction(isSnakeCase, [
  ['snake_case', true],
  ['arcade_2d', true],
  ['PascalCase', false],
  ['pascalCase', false]
])
