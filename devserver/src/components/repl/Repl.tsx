import { Card, Pre } from '@blueprintjs/core';
import { Ace } from 'ace-builds';
import { parseError } from 'js-slang';
import React from 'react';

import type { InterpreterOutput } from '../../types';
import type { OutputProps } from './ReplTypes';

export type ReplProps = DispatchProps & OwnProps;

type DispatchProps = {
  handleBrowseHistoryDown: () => void;
  handleBrowseHistoryUp: () => void;
  onFocus?: (editor: Ace.Editor) => void;
  onBlur?: () => void;
};

type OwnProps = {
  replButtons: Array<JSX.Element | null>;
  output: InterpreterOutput[];
  hidden?: boolean;
  inputHidden?: boolean;
  disableScrolling?: boolean;
};

const Repl: React.FC<ReplProps> = (props: ReplProps) => {
  const cards = props.output.map((slice, index) => (
    <Output
      output={slice}
      key={index}
      isHtml={false}
    />
  ));
  return (
    <div className="Repl" style={{ display: props.hidden ? 'none' : undefined }}>
      <div className="repl-output-parent">
        {cards.length > 0 ? cards : (<Card />)}
      </div>
    </div>
  );
};

export const Output: React.FC<OutputProps> = (props: OutputProps) => {
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
      // We check if we are using Stepper, so we can process the REPL results properly
      // if (props.usingSubst && props.output.value instanceof Array) {
      //   return (
      //     <Card>
      //       <Pre className="log-output">Check out the Stepper tab!</Pre>
      //     </Card>
      //   );
      // } else if (props.isHtml) {
      //   return (
      //     <Card>
      //       <Pre className="log-output">Check out the HTML Display tab!</Pre>
      //     </Card>
      //   );
      // } else if (props.output.consoleLogs.length === 0) {
      if (props.output.consoleLogs.length === 0) {
        return (
          <Card>
            <Pre className="result-output">{props.output.value}</Pre>
          </Card>
        );
      } else {
        return (
          <Card>
            <Pre className="log-output">{props.output.consoleLogs.join('\n')}</Pre>
            <Pre className="result-output">{props.output.value}</Pre>
          </Card>
        );
      }
    case 'errors':
      if (props.output.consoleLogs.length === 0) {
        return (
          <Card>
            <Pre className="error-output">{parseError(props.output.errors)}</Pre>
          </Card>
        );
      } else {
        return (
          <Card>
            <Pre className="log-output">{props.output.consoleLogs.join('\n')}</Pre>
            <br />
            <Pre className="error-output">{parseError(props.output.errors)}</Pre>
          </Card>
        );
      }
    default:
      return <Card>''</Card>;
  }
};

export default Repl;
