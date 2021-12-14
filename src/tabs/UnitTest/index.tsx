import React from 'react';
import { Results, SuiteResult } from '../../bundles/unittest/types';

/**
 * Tab for unit tests.
 * @author Jia Xiaodong
 */

type Props = {
  result: any;
};

class UnitTests extends React.PureComponent<Props> {
  /**
   * Converts the results of a test suite run into a table format in its own div.
   */
  private static suiteResultToDiv(suiteResult: any) {
    const { name, results, total, passed } = suiteResult as SuiteResult;
    const colfixed = {
      border: '1px solid gray',
      overflow: 'hidden',
      width: 200,
    };
    const colauto = {
      border: '1px solid gray',
      overflow: 'hidden',
      width: 'auto',
    };

    const rows = results.map(({ name: testname, error }, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <tr key={index}>
        <td style={colfixed}>{testname}</td>
        <td style={colauto}>{error || 'Passed.'}</td>
      </tr>
    ));

    const tablestyle = {
      'table-layout': 'fixed',
      width: '100%',
    };
    const table = (
      <table style={tablestyle}>
        <thead>
          <tr>
            <th style={colfixed}>Test case</th>
            <th style={colauto}>Messages</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );

    const suitestyle = {
      border: '1px solid white',
      padding: 5,
      margin: 5,
    };
    return (
      <div style={suitestyle} key={name}>
        <p>
          <strong>{name}</strong>
        </p>
        <p>
          Passed testcases: {passed}/{total}
        </p>
        {table}
      </div>
    );
  }

  public render() {
    const { result: res } = this.props;
    const block = res.results.map((suiteresult: SuiteResult) =>
      UnitTests.suiteResultToDiv(suiteresult)
    );

    return (
      <div>
        <p>The following is a report of your tests.</p>
        {block}
      </div>
    );
  }
}

export default {
  /**
   * This function will be called to determine if the component will be
   * rendered.
   * @param {DebuggerContext} context
   * @returns {boolean}
   */
  toSpawn: (context: any): boolean => {
    function valid(value: any): value is Results {
      try {
        return (
          value instanceof Object &&
          Array.isArray(value.results) &&
          Array.isArray(value.results[0].results)
        );
      } catch (e) {
        return false;
      }
    }
    return valid(context.result.value);
  },

  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  // eslint-disable-next-line react/destructuring-assignment
  body: (context: any) => <UnitTests result={context.result.value} />,

  /**
   * The Tab's icon tooltip in the side contents on Source Academy frontend.
   */
  label: 'Unit Tests',

  /**
   * BlueprintJS IconName element's name, used to render the icon which will be
   * displayed in the side contents panel.
   * @see https://blueprintjs.com/docs/#icons
   */
  iconName: 'lab-test',
};
