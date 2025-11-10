import { Card, Pre } from '@blueprintjs/core';
import { parseError } from 'js-slang';

function safeParseErrors(errors: any[]) {
  const notSafeToParse = errors.find(each => !('explain' in each));

  if (notSafeToParse) {
    return errors.map(err => err.toString()).join('\n');
  }
  return parseError(errors);
}

interface MatrixOutputProps {
  errors: unknown[];
}

export default function MatrixOutput({ errors }: MatrixOutputProps) {
  return <Card elevation={2} style={{ overflowX: 'auto', height: '10vh' }}>
    {errors.length > 0
      ? <Pre
        style={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
          padding: '0px',
          margin: '0px',
          /**
           * white-space, word-wrap and word-break
           * are specified to allow all output to wrap.
           */
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          /**
           * Use same fonts as ace-editor for
           * output. Taken from react-ace
           * sourcecode, font size modified.
           */
          font: "16px / normal 'Inconsolata', 'Consolas', monospace",
          color: '#ff4444',
        }}
      >
        {safeParseErrors(errors)}
      </Pre>
      : <p>If any errors occur while your matrix&apos;s callbacks are executing, they will appear here</p>}
  </Card>;
}
