import { Card, Pre } from '@blueprintjs/core';
import { parseError } from 'js-slang';
import React from 'react';

import type { InterpreterOutput } from '../../types';

type OutputProps = {
  output: InterpreterOutput;
};

function safeParseErrors(errors: any[]) {
  const notSafeToParse = errors.find(each => !('explain' in each));

  if (notSafeToParse) {
    return errors.map(err => err.toString()).join('\n');
  }
  return parseError(errors);
}

const Output: React.FC<OutputProps> = (props: OutputProps) => {
  switch (props.output.type) {
    case 'code':
      return (
        <Card>
          <Pre className="code-output">{props.output.value}</Pre>
        </Card>
      );
    case 'running':
      return (
        <Card>
          <Pre className="log-output">{props.output.consoleLogs.join('\n')}</Pre>
        </Card>
      );
    case 'result':
      if (props.output.consoleLogs.length === 0) {
        return (
          <Card>
            <Pre className="result-output">{props.output.value}</Pre>
          </Card>
        );
      }
      return (
        <Card>
          <Pre className="log-output">{props.output.consoleLogs.join('\n')}</Pre>
          <Pre className="result-output">{props.output.value}</Pre>
        </Card>
      );

    case 'errors':
      if (props.output.consoleLogs.length === 0) {
        return (
          <Card>
            <Pre className="error-output">{safeParseErrors(props.output.errors)}</Pre>
          </Card>
        );
      }
      return (
        <Card>
          <Pre className="log-output">{props.output.consoleLogs.join('\n')}</Pre>
          <br />
          <Pre className="error-output">{safeParseErrors(props.output.errors)}</Pre>
        </Card>
      );

    default:
      return <Card>&rsquo;&rsquo;</Card>;
  }
};

export type ReplProps = {
  // replButtons: Array<JSX.Element | null>;
  output: InterpreterOutput | null;
  hidden?: boolean;
  inputHidden?: boolean;
  disableScrolling?: boolean;
};

const Repl: React.FC<ReplProps> = (props: ReplProps) => (
  <div className="Repl" style={{ display: props.hidden ? 'none' : undefined }}>
    <div className="repl-output-parent">
      {props.output === null
        ? <Card />
        : <Output output={props.output}/>}
      {/* {cards.length > 0 ? cards : (<Card />)} */}
    </div>
  </div>
);

export default Repl;
