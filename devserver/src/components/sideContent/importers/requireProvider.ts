import * as bpcore from '@blueprintjs/core';
import * as bpicons from '@blueprintjs/icons';
import jsslangDist from 'js-slang';
import * as jsSlang from 'js-slang';
import React from 'react';
import JSXRuntime from 'react/jsx-runtime';
import ace from 'react-ace/lib/ace';
import ReactDOM from 'react-dom';

export const requireProvider = (x: string) => {
  const exports = {
    'react': React,
    'react/jsx-runtime': JSXRuntime,
    'react-ace': ace,
    'react-dom': ReactDOM,
    '@blueprintjs/core': bpcore,
    '@blueprintjs/icons': bpicons,
    'js-slang': jsSlang,
    'js-slang/dist': jsslangDist,
  };

  if (!(x in exports)) throw new Error(`Dynamic require of ${x} is not supported`);
  return exports[x as keyof typeof exports] as any;
};
