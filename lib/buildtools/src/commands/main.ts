import { Command } from '@commander-js/extra-typings';
import { getBuildCommand, getBuildHtmlCommand, getManifestCommand } from './build.js';
import { getListCommand, getValidateCommand } from './list.js';
import { getLintCommand, getLintGlobalCommand, getPrebuildAllCommand, getTscCommand } from './prebuild.js';
import getHttpServerCommand from './server.js';
import getTemplateCommand from './template.js';
import { getTestAllCommand, getTestCommand } from './testing.js';

const commands: (() => Command<any>)[] = [
  getBuildCommand,
  getBuildHtmlCommand,
  getHttpServerCommand,
  getLintCommand,
  getLintGlobalCommand,
  getListCommand,
  getManifestCommand,
  getPrebuildAllCommand,
  getTemplateCommand,
  getTestCommand,
  getTestAllCommand,
  getTscCommand,
  getValidateCommand
];

export const getMainCommand = () => {
  const mainCommand = new Command();
  for (const getter of commands) {
    mainCommand.addCommand(getter());
  }
  return mainCommand;
};
