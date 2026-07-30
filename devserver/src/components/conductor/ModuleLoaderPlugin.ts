import {
  CHANNEL_ID,
  ModuleLoaderMessageType,
  WEB_ID,
  type ModuleLoaderMessage,
} from '@sourceacademy/common-module-loader';

import {
  checkIsPluginClass,
  type IChannel,
  type IConduit,
  type IPlugin,
} from '@sourceacademy/conductor/conduit';

type ModuleDirectoryBundle = {
  tabs: string[];
};

type ModuleDirectory = Record<string, ModuleDirectoryBundle>;

export class ModuleLoaderWebPlugin implements IPlugin {
  readonly id: string = WEB_ID;
  static readonly channelAttach = [CHANNEL_ID];
  private readonly __moduleRequestChannel: IChannel<ModuleLoaderMessage>;

  static instance: ModuleLoaderWebPlugin | null = null;
  private moduleDirectoryURL: string | null = null;
  private moduleDirectory: ModuleDirectory | null = null;

  constructor(
    _conduit: IConduit,
    [moduleRequestChannel]: IChannel<any>[],
  ) {
    this.__moduleRequestChannel = moduleRequestChannel;
    ModuleLoaderWebPlugin.instance = this;

    this.__moduleRequestChannel.subscribe(message => {
      if (message.type !== ModuleLoaderMessageType.REQUEST_MODULE) return;
      if (this.moduleDirectory === null || this.moduleDirectoryURL === null) {
        return this.__moduleRequestChannel.send({
          type: ModuleLoaderMessageType.MODULE_ERROR,
          moduleName: message.moduleName,
          error: 'Module directory not loaded yet',
        });
      }
      if (!Object.hasOwnProperty.call(this.moduleDirectory, message.moduleName)) {
        return this.__moduleRequestChannel.send({
          type: ModuleLoaderMessageType.MODULE_ERROR,
          moduleName: message.moduleName,
          error: `Module not found: ${message.moduleName}`,
        });
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(message.moduleName)) {
        return this.__moduleRequestChannel.send({
          type: ModuleLoaderMessageType.MODULE_ERROR,
          moduleName: message.moduleName,
          error: `Invalid module name: ${message.moduleName}`,
        });
      }
      const moduleBaseUrl = this.moduleDirectoryURL.slice(
        0,
        this.moduleDirectoryURL.lastIndexOf('/') + 1,
      );
      return this.__moduleRequestChannel.send({
        type: ModuleLoaderMessageType.MODULE_RESPONSE,
        moduleName: message.moduleName,
        moduleURL: moduleBaseUrl + 'bundles/' + message.moduleName + '.js',
        tabs: this.moduleDirectory[message.moduleName].tabs,
      });
    });
  }

  async onModuleDirectoryURLChange(newURL: string): Promise<void> {
    if (newURL === this.moduleDirectoryURL && this.moduleDirectory) {
      return;
    }
    this.moduleDirectoryURL = newURL;
    this.moduleDirectory = null;
    await fetch(newURL)
      .then(response => response.json())
      .then(data => {
        this.moduleDirectory = data;
      })
      .catch(error => {
        console.error('Failed to load module directory:', error);
      });
  }

  getModuleTabLocation(tabName: string): string | null {
    if (!this.moduleDirectory || !this.moduleDirectoryURL) {
      return null;
    }
    for (const moduleName in this.moduleDirectory) {
      if (this.moduleDirectory[moduleName].tabs.includes(tabName)) {
        const moduleBaseUrl = this.moduleDirectoryURL.slice(
          0,
          this.moduleDirectoryURL.lastIndexOf('/') + 1,
        );
        return moduleBaseUrl + 'tabs/' + tabName + '.js';
      }
    }
    return null;
  }
}

checkIsPluginClass(ModuleLoaderWebPlugin);
