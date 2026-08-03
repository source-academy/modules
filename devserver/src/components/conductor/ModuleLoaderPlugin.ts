import pathlib from 'path';
import {
  CHANNEL_ID,
  ModuleLoaderMessageType,
  type ModuleLoaderMessage,
} from '@sourceacademy/common-module-loader';
import {
  checkIsPluginClass,
  type IChannel,
  type IConduit,
  type IPlugin,
} from '@sourceacademy/conductor/conduit';
import manifest from '../../../../build/modules.json' with { type: 'json' };

const bundlesDir = '../../../../src/bundles';
const tabsDir = '../../../../src/tabs';

type ModuleDirectoryBundle = {
  tabs: string[];
};

type ModuleDirectory = Record<string, ModuleDirectoryBundle>;

export class ModuleLoaderPlugin implements IPlugin {
  readonly id = 'bruh';
  static readonly channelAttach = [CHANNEL_ID];
  static instance: ModuleLoaderPlugin | null = null;

  private readonly moduleDirectory: ModuleDirectory = manifest;
  private readonly __moduleRequestChannel: IChannel<ModuleLoaderMessage>;

  constructor(
    _conduit: IConduit,
    [moduleRequestChannel]: IChannel<any>[],
  ) {
    this.__moduleRequestChannel = moduleRequestChannel;
    ModuleLoaderPlugin.instance = this;

    this.__moduleRequestChannel.subscribe(message => {
      if (message.type !== ModuleLoaderMessageType.REQUEST_MODULE) return;

      // if (this.moduleDirectory === null) {
      //   return this.__moduleRequestChannel.send({
      //     type: ModuleLoaderMessageType.MODULE_ERROR,
      //     moduleName: message.moduleName,
      //     error: 'Module directory not loaded yet',
      //   });
      // }

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

      return this.__moduleRequestChannel.send({
        type: ModuleLoaderMessageType.MODULE_RESPONSE,
        moduleName: message.moduleName,
        moduleURL: pathlib.posix.join(bundlesDir, message.moduleName, 'src/index.ts'),
        tabs: this.moduleDirectory[message.moduleName].tabs,
      });
    });
  }

  getModuleTabLocation(tabName: string): string | null {
    if (!this.moduleDirectory) {
      return null;
    }
    for (const moduleName in this.moduleDirectory) {
      if (this.moduleDirectory[moduleName].tabs.includes(tabName)) {
        return pathlib.posix.join(tabsDir, tabName, 'src/index.tsx');
      }
    }
    return null;
  }
}

checkIsPluginClass(ModuleLoaderPlugin);
