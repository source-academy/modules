import { Conduit, type IConduit } from '@sourceacademy/conductor/conduit';
import { BrowserHostPlugin } from './BrowserHostPlugin';
import { DeferredConductorTabService } from './DeferredTabService';
import { ModuleLoaderWebPlugin } from './ModuleLoaderPlugin';
import { importAndRegisterWebPlugin } from './importExternalWebPlugin';

export interface PreparedConductor {
  path: string;
  evaluatorUrl: string;
  hostPlugin: BrowserHostPlugin;
  conduit: IConduit;
  tabService: DeferredConductorTabService;
  moduleLoaderPlugin: ModuleLoaderWebPlugin;
};

export function createConductor(
  evaluatorPath: string,
  onRequestFile: (fileName: string) => Promise<string | undefined>,
  onRequestLoadPlugin: (pluginName: string) => Promise<void>,
): {
  hostPlugin: BrowserHostPlugin;
  // csePlugin: CseMachineHostPlugin;
  conduit: IConduit;
  moduleLoaderPlugin: ModuleLoaderWebPlugin;
} {
  const worker = new Worker(evaluatorPath);
  const conduit = new Conduit(worker, true);
  const hostPlugin = conduit.registerPlugin(BrowserHostPlugin, onRequestFile, onRequestLoadPlugin);

  // hostPlugin.registerPlugin(AutoCompletePlugin);
  // const csePlugin = conduit.registerPlugin(CseMachineHostPlugin);

  // Captured directly (rather than read back later via the class's static `.instance`, which is
  // shared page-wide and gets overwritten by every new conductor - including a warm spare prepared
  // in the background while this one is still actively running a script) so callers always resolve
  // modules against *this* conductor's own instance, not whichever one was constructed most recently.
  const moduleLoaderPlugin = hostPlugin.registerPlugin(ModuleLoaderWebPlugin);
  return { hostPlugin, conduit, moduleLoaderPlugin };
}

async function loadWebPlugin(
  hostPlugin: BrowserHostPlugin | undefined,
  pluginId: string,
  tabService: DeferredConductorTabService,
  moduleLoaderPlugin: ModuleLoaderWebPlugin,
): Promise<void> {
  if (!hostPlugin) {
    return;
  }
  const url = await resolveWebPluginUrl(pluginId, moduleLoaderPlugin);
  if (!url) {
    console.warn(
      `Conductor: no web resolution for plugin "${pluginId}" (is directory.plugin.url set?)`,
    );
    return;
  }
  try {
    // The plugin is constructed with this conductor's ITabService (third constructor arg), so any
    // side-content tab it exposes registers into that service. The tab is buffered there and only
    // surfaced to the UI while this conductor is the active one (see DeferredConductorTabService).
    await importAndRegisterWebPlugin(hostPlugin, url, tabService);
  } catch (error) {
    console.warn(`Conductor: failed to load web plugin "${pluginId}"`, error);
  }
}

async function fetchEvaluatorObjectUrl(path: string): Promise<string> {
  const evaluatorResponse = await fetch(path);
  if (!evaluatorResponse.ok) {
    throw Error("can't get evaluator");
  }

  const evaluatorBlob = await evaluatorResponse.blob();
  return URL.createObjectURL(evaluatorBlob);
}

export async function createPreparedConductor(path: string, fileGetter: (path: string) => Promise<string | undefined>): Promise<PreparedConductor> {
  const evaluatorUrl = await fetchEvaluatorObjectUrl(path);

  let hostPluginRef: BrowserHostPlugin | undefined = undefined;
  const tabService = new DeferredConductorTabService();
  const { hostPlugin, conduit, moduleLoaderPlugin } = createConductor(
    evaluatorUrl,
    fileGetter,
    (pluginName: string) => loadWebPlugin(hostPluginRef, pluginName, tabService, moduleLoaderPlugin),
  );
  hostPluginRef = hostPlugin;

  return {
    path,
    evaluatorUrl,
    hostPlugin,
    conduit,
    tabService,
    moduleLoaderPlugin,
  };
}
