import { convertRawTab } from '../build/build';

describe('Testing raw tab processing', () => {
  /*
    Basically in my (lee yi's) time testing, rollup's output keeps varying and I can't
    figure out why. The convert raw tab function is my latest effort so far in trying
    to get a tab processing method that can handle all of rollup's outputs
  */

  test('Converts React tab properly', () => {
    const rawTab0 = '(function (React) {}(React))';
    const result0 = convertRawTab(rawTab0);

    expect(result0)
      .toEqual('(function (React) {})');

    const rawTab1 = '(function (React) {})(React)';
    const result1 = convertRawTab(rawTab1);

    expect(result1)
      .toEqual('(function (React) {})');
  });

  test('Converts ReactDOM tab properly', () => {
    const rawTab0 = '(function (React, ReactDom) {}(React, ReactDom))';
    const result0 = convertRawTab(rawTab0);

    expect(result0)
      .toEqual('(function (React, ReactDom) {})');

    const rawTab1 = '(function (React, ReactDom) {})(React, ReactDom)';
    const result1 = convertRawTab(rawTab1);

    expect(result1)
      .toEqual('(function (React, ReactDom) {})');
  });
});
