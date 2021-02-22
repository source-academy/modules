import React from 'react';
import { Result } from 'js-slang';

type DebuggerContext = {
  result: Result;
};

const index = (context: DebuggerContext) => {
  if (context.result.status !== 'finished')
    return <div>Your program did not finish evaluating.</div>;

  return (
    <div style={styles.root}>
      <div style={styles.output}>
        The last line of your program evaluates to{' '}
        {context.result.value.toString()}
      </div>

      <div style={styles.clock}>
        <svg width='120' height='120'>
          <circle style={styles.face} cx='50' cy='50' r='50' />
          <line
            style={{ ...styles.hands, ...styles.hour }}
            x1='50'
            y1='50'
            x2='50'
            y2='30'
          />
          <line
            style={{ ...styles.hands, ...styles.minute }}
            x1='50'
            y1='50'
            x2='50'
            y2='20'
          />
          <line
            style={{ ...styles.hands, ...styles.second }}
            x1='50'
            y1='50'
            x2='50'
            y2='15'
          />
          <line style={styles.hands} x1='50' y1='50' x2='50' y2='50' />
          <text x='42' y='14'>
            12
          </text>
          <text x='90' y='56'>
            3
          </text>
          <text x='48' y='96'>
            6
          </text>
          <text x='4' y='58'>
            9
          </text>
        </svg>
      </div>
    </div>
  );
};

const styles = {
  root: {
    display: 'flex',
    'flex-direction': 'column',
    'align-items': 'center',
  },
  output: {
    margin: '8px',
  },
  clock: {
    width: '110px',
    height: '110px',
    padding: '4px',
  },
  face: {
    stroke: 'black',
    'stroke-width': '2px',
    fill: 'white',
  },
  hands: {
    stroke: 'black',
    'stroke-linecap': 'round',
  },
  hour: {
    'stroke-width': '3px',
  },
  minute: {
    'stroke-width': '2px',
  },
  second: {
    'stroke-width': '1px',
  },
};

export default {
  toSpawn: () => true,
  body: index,
  label: 'Show N Tell (Time)',
  iconName: 'time',
};
