import type { Context } from 'js-slang';
import { getBundleUsingVite, getCompiledBundle, getCompiledTabs, getDynamicTabs } from './importers';

export function loadDynamicTabs(context: Context, useCompiled: boolean) {
  return useCompiled ? getCompiledTabs(context) : getDynamicTabs(context);
}

export function getBundleLoader(useCompiled: boolean) {
  return (bundleName: string) => {
    return useCompiled ? getBundleUsingVite(bundleName) : getCompiledBundle(bundleName);
  };
}
