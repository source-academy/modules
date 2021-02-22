import React from 'react';
import { Result } from 'js-slang';

const styles = {
  card: {
    'box-shadow': '0 4px 8px 0 rgba(0,0,0,0.2)',
    transition: '0.3s',
    'border-radius': '5px',
    'margin-bottom': '4px',
    'background-color': 'white',
    color: 'black',
  },
};

type DebuggerContext = {
  result: Result;
};

const index = (context: DebuggerContext) => {
  if (context.result.status !== 'finished')
    return <div>Your program did not finish evaluating.</div>;

  return (
    <>
      <div style={styles.card}>
        The last line of your program evaluates to{' '}
        {context.result.value.toString()}
      </div>
      {context.result.value.toString() === 'Captain America' && (
        <img
          src='https://media.giphy.com/media/S3sc3Pg9dFpUA/giphy.gif'
          alt='Captain America'
        />
      )}
    </>
  );
};

export default {
  toSpawn: () => true,
  body: index,
  label: 'Repeat Test Tab',
  iconName: 'build',
};
