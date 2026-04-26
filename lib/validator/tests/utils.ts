import * as bpcore from '@blueprintjs/core';
import * as bpicons from '@blueprintjs/icons';
import type { DebuggerContext, ModuleSideContent } from '@sourceacademy/modules-lib/types';
import jsslangDist from 'js-slang';
import * as jsSlang from 'js-slang';
import { getRequireProvider } from 'js-slang/dist/modules/loader/requireProvider';
import React from 'react';
import JSXRuntime from 'react/jsx-runtime';
import ace from 'react-ace';
import ReactDOM from 'react-dom';
import ReactDOMClient from 'react-dom/client';
import { test as baseTest } from 'vitest';
import type { LoadedBundle, PartialSourceModule } from 'js-slang/dist/modules/moduleTypes';

export const tabRequireProvider = (x: string) => {
  const exports = {
    'react': React,
    'react/jsx-runtime': JSXRuntime,
    'react-ace': ace,
    'react-dom': ReactDOM,
    'react-dom/client': ReactDOMClient,
    '@blueprintjs/core': bpcore,
    '@blueprintjs/icons': bpicons,
    'js-slang': jsSlang,
    'js-slang/dist': jsslangDist,
  };

  if (!(x in exports)) throw new Error(`Dynamic require of ${x} is not supported`);
  return exports[x as keyof typeof exports] as any;
};

interface Fixtures<T extends LoadedBundle> {
  context: DebuggerContext;
  bundle: T;
  tab: ModuleSideContent;
}

export function getTestFunc<T extends LoadedBundle>(
  name: string,
  partialBundle: PartialSourceModule,
  partialTab: (req: typeof tabRequireProvider) => { default: ModuleSideContent }
) {
  return baseTest.extend<Fixtures<T>>({
    context: ({}, use) => {
      const evalContext = jsSlang.createContext();
      evalContext.moduleContexts[name] = {
        state: null,
        tabs: null
      };
      const ctx: DebuggerContext = {
        result: undefined,
        code: '',
        context: evalContext,
        lastDebuggerResult: undefined
      };

      return use(ctx);
    },
    bundle: ({ context: { context } }, use) => use(partialBundle(getRequireProvider(context)) as T),
    tab: ({}, use) => {
      const { default: val } = partialTab(tabRequireProvider);
      return use(val);
    }
  });

}
