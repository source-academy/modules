import fs from 'fs/promises';
import { outputBundle } from '../bundle';

jest.mock('fs/promises', () => ({
  writeFile: jest.fn(() => Promise.resolve()),
  stat: jest.fn().mockResolvedValue({ size: 10 })
}))

test('bundle output', async () => {
  const testBundle = `
  'use strict';
  var module = (function () {
    var exports = {}
    exports.foo = function() { return 'foo'; }
    exports.bar = function() {
      var obj = require("js-slang/moduleHelpers");
      obj.context.moduleContexts.test0.state = 'bar';
    }
    return exports;
  })();`

  const result = await outputBundle('test0', testBundle, 'build');
  expect(result).toMatchObject({
    fileSize: 10,
    severity: 'success',
  })

  expect(fs.stat)
    .toHaveBeenCalledWith('build/bundles/test0.js')

  expect(fs.writeFile)
    .toHaveBeenCalledTimes(1)

  const call = (fs.writeFile as jest.MockedFunction<typeof fs.writeFile>).mock.calls[0];

  expect(call[0]).toEqual('build/bundles/test0.js')
  const bundleText = `(${call[1]})`;
  const mockContext = {
    moduleContexts: {
      test0: {
        state: null,
      }
    }
  }
  const bundleFuncs = eval(bundleText)({ context: mockContext });
  expect(bundleFuncs.foo()).toEqual('foo');
  expect(bundleFuncs.bar()).toEqual(undefined);
  expect(mockContext.moduleContexts).toMatchObject({
    test0: {
      state: 'bar',
    },
  });
});
