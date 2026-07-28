import type { IconName } from '@blueprintjs/icons';
import type { Context } from 'js-slang';
import type React from 'react';
import type { requireProvider } from './importers/requireProvider';

export type DebuggerContext = {
  context: Context;
};

/**
 * @property label A string that will appear as the tooltip.
 *
 * @property iconName BlueprintJS IconName element, used to render the
 *   icon which will be displayed over the SideContent panel.
 *
 * @property body The element to be rendered in the SideContent panel
 *  when the tab is selected. If null, the panel will not be rendered.
 *
 * @property id A string/number that will be used as the tab ID and key.
 *  If id is undefined, id will be set to label by the renderTab function.
 *
 * @property disabled Set this property to true to disable a tab. The
 * corresponding tab label will still be rendered on hover, but the
 * tab will be greyed out and cannot be selected. Default value: false.
 */
export type SideContentTab = {
  label: string;
  iconName: IconName;
  body: React.ReactElement | null;
  id?: string;
  disabled?: boolean;
};

export type ModuleSideContent = {
  label: string;
  iconName: IconName;
  toSpawn?: (context: DebuggerContext) => boolean;
  body: (context: DebuggerContext) => React.ReactElement;
};

export type RawTab = (provider: ReturnType<typeof requireProvider>, react: typeof React) => Promise<{ default: ModuleSideContent }>;
