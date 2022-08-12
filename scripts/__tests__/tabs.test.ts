import { convertRawTab } from '../build/tabs';

describe('Testing raw tab processing', () => {
  test('Converts React tab properly', () => {
    const rawTab = '(function (React) {}(React))';
    const result = convertRawTab(rawTab);

    expect(result)
      .toEqual('(function (React) {})');
  });

  test('Converts ReactDOM tab properly', () => {
    const rawTab = '(function (React, ReactDOM) {}(React, ReactDOM))';
    const result = convertRawTab(rawTab);

    expect(result)
      .toEqual('(function (React, ReactDOM) {})');
  });
});
