import React from 'react';
import type { SuiteResult, TestContext } from '../../bundles/unittest/types';
import { getModuleState, type DebuggerContext } from '../../typings/type_helpers';

/**
 * Tab for unit tests.
 * @author Jia Xiaodong
 */

type Props = {
  context: TestContext;
};

/**
 * Converts the results of a test suite run into a table format in its own div.
 */
function suiteResultToDiv(suiteResult: SuiteResult) {
  const { name, results, total, passed } = suiteResult;
  if (results.length === 0) {
    return <div>
      Your test suite did not contain any tests!
    </div>;
  }

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

class TestSuitesTab extends React.PureComponent<Props> {
  public render() {
    const { context: { suiteResults, called } } = this.props;

    if (!called) {
      return <div>
        Call <code>describe</code> at least once to be able to view the results of your tests
      </div>;
    }

    const block = suiteResultToDiv(suiteResults);

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
  toSpawn: (_context: DebuggerContext): boolean => true,

  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  // eslint-disable-next-line react/destructuring-assignment
  body: (context: DebuggerContext) => {
    const moduleContext = getModuleState<TestContext>(context, 'unittest');
    return <TestSuitesTab context={moduleContext} />;
  },

  /**
   * The Tab's icon tooltip in the side contents on Source Academy frontend.
   */
  label: 'Test suites',

  /**
   * BlueprintJS IconName element's name, used to render the icon which will be
   * displayed in the side contents panel.
   * @see https://blueprintjs.com/docs/#icons
   */
  iconName: 'lab-test',
};
