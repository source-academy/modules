import fs from 'fs/promises';
import { outputBundle } from '../bundle';

// jest.mock('fs', () => ({
//   promises: {
//     writeFile: jest.fn(() => Promise.resolve()),
//     stat: () => jest.fn().mockResolvedValue({ size: 0 })
//   }
// }))
jest.mock('fs/promises');

test('bundle output', async () => {
  const testBundle = `
  'use strict';
  var module = (function () {
    var exports = {}
    exports.foo = function() { return 'foo'; }
    exports.bar = function() {
      return require("js-slang/moduleHelpers")
    }
    return exports;
  })();`

  const result = await outputBundle('test0', testBundle, 'build');
  console.log(result)

  expect(fs.stat)
    .toHaveBeenCalledWith(['build/bundles/test0.js'])

  expect(fs.writeFile)
    .toHaveBeenCalledTimes(1)

  const call = (fs.writeFile as jest.MockedFunction<typeof fs.writeFile>).mock.calls[0];

  expect(call[0]).toEqual('build/bundles/test0.js')
});
