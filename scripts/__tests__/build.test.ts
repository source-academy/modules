import { parse } from 'acorn';

import { converterPlugin } from '../build/modules/utils';


const plugin = (type: 'bundle' | 'tab') => Object.assign(converterPlugin(type), {
  parse: (code) => parse(code, {
    ecmaVersion: 'latest',
  }),
});

describe('Testing rollup converter plugin with module code', () => {
  const renderChunk = (type: 'bundle' | 'tab', code: string) => (plugin(type).renderChunk as (code: string) => Promise<string>)(code);

  test('with no external parameters', async () => {
    const generated0 = await renderChunk('bundle', '(function (){})();');
    expect(generated0)
      .toEqual('(function () {})');

    const generated1 = await renderChunk('bundle', '(function(){}())');
    expect(generated1)
      .toEqual('(function () {})');
  });

  test('tabs with external parameters', async () => {
    const tab0 = await renderChunk('tab', '(function (React) {}) (React)');
    expect(tab0)
      .toEqual('(function (React) {})');

    const tab1 = await renderChunk('tab', '(function (React, ReactDom) {}) (React, ReactDom)');
    expect(tab1)
      .toEqual('(function (React, ReactDom) {})');

    const tab2 = await renderChunk('tab', '(function (React, ReactDom) {} (React, ReactDom))');
    expect(tab2)
      .toEqual('(function (React, ReactDom) {})');
  });

  test('exports parameter is correctly removed for bundles', async () => {
    const generated0 = await renderChunk('bundle', '(function (exports) { \'use strict\';})();');
    expect(generated0)
      .toEqual(`(function () {
  'use strict';
  var exports = {};
})`);

    const generated1 = await renderChunk('bundle', '(function (exports, moduleHelpers) { \'use strict\'; })();');
    expect(generated1)
      .toEqual(`(function (moduleHelpers) {
  'use strict';
  var exports = {};
})`);
  });

  test('bundles with only one parameter are left alone', async () => {
    const generated0 = await renderChunk('bundle', '(function (moduleHelpers) { \'use strict\';})();');
    expect(generated0)
      .toEqual(`(function (moduleHelpers) {
  'use strict';
})`);
  });
});
