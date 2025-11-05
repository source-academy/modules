import type { IconName } from '@blueprintjs/icons';
import type { Context } from 'js-slang';
import type React from 'react';
import type { requireProvider } from './importers/requireProvider';

export type DebuggerContext = {
  context: Context;
};

export type SideContentTab = {
  id: string;
  label: string;
  iconName: IconName;
  body: React.JSX.Element;
};

export type ModuleSideContent = {
  label: string;
  iconName: IconName;
  toSpawn?: (context: DebuggerContext) => boolean;
  body: (context: DebuggerContext) => React.JSX.Element;
};

export type RawTab = (provider: ReturnType<typeof requireProvider>, react: typeof React) => Promise<{ default: ModuleSideContent }>;
