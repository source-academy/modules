import type { Context } from 'js-slang';
import { getCompiledTabs, getDynamicTabs } from './importers';

export default function loadDynamicTabs(context: Context, useCompiled: boolean) {
  return useCompiled ? getCompiledTabs(context) : getDynamicTabs(context);
}
