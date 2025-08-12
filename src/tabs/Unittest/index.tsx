/**
 * Tab for unit tests.
 * @author Jia Xiaodong
 */

import type { SuiteResult, UnittestModuleState } from '@sourceacademy/bundle-unittest/types';
import { defineTab, getModuleState } from '@sourceacademy/modules-lib/tabs/utils';
import partition from 'lodash/partition';

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

/**
 * Converts the results of a test suite run into a table format in its own div.
 */
function suiteResultToDiv(suiteResult: SuiteResult) {
  const { name, results, runtime, passCount } = suiteResult;
  const [suiteResults, testResults] = partition(results, each => 'results' in each);

  const tablestyle = {
    'table-layout': 'fixed',
    width: '100%',
  };
  const testsPassed = testResults.filter(each => each.passed);
  const testResultsTable = (
    <details>
      <summary><strong>Test Cases</strong> Passed {testsPassed.length}/{testResults.length}</summary>
      <table style={tablestyle}>
        <thead>
          <tr>
            <th style={colfixed}>Test Cases</th>
            <th style={colauto}>Messages</th>
          </tr>
        </thead>
        <tbody>{
          testResults.map(each => {
            if (each.passed) {
              return <tr>
                <td style={colfixed}>{each.name}</td>
                <td style={colauto}>&apos;Passed.&apos;</td>
              </tr>;
            } else {
              return <tr>
                <td style={colfixed}>{each.name}</td>
                <td style={colauto}>&apos;{each.error}&apos;</td>
              </tr>;
            }
          })}
        </tbody>
      </table>
    </details>
  );

  const suitesPassed = suiteResults.filter(each => each.passed);
  const suiteResultList = <details>
    <summary><strong>Test Suites</strong> Passed all {suitesPassed.length}/{suiteResults.length}</summary>
    <ol>
      {suiteResults.map(each => <li>{suiteResultToDiv(each)}</li>)}
    </ol>
  </details>;

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
      {
        results.length > 0
          ? <>
            <p>
              Passed {passCount}/{results.length} in {runtime.toFixed(2)}ms
            </p>
            {testResults.length > 0 && testResultsTable}
            {suiteResults.length > 0 && suiteResultList}
          </>
          : <p>This test suite did not contain any tests/suites</p>
      }
    </div>
  );
}

type Props = {
  results: SuiteResult[]
};

function TestSuitesTab({ results }: Props) {
  return <div>
    <h1>Test Report</h1>
    <ol>
      {results.map(each => {
        return <li>{suiteResultToDiv(each)}</li>;
      })}
    </ol>
  </div>;
}

export default defineTab({
  toSpawn: ({ context: { moduleContexts } }) => {
    return moduleContexts.unittest?.state.suiteResults.length > 0;
  },
  body: context => {
    const moduleContext = getModuleState<UnittestModuleState>(context, 'unittest');
    return <TestSuitesTab results={moduleContext.suiteResults} />;
  },
  label: 'Test suites',
  iconName: 'lab-test',
});
