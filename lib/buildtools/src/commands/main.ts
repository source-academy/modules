import { Command } from '@commander-js/extra-typings';
import { getBuildCommand, getBuildHtmlCommand, getManifestCommand } from './build.js';
import { getListCommand } from './list.js';
import { getLintCommand, getLintGlobalCommand, getPrebuildAllCommand, getTscCommand } from './prebuild.js';
import getTemplateCommand from './template.js';
import { getTestAllCommand, getTestCommand } from './testing.js';

const commands: (() => Command<any>)[] = [
  getBuildCommand,
  getBuildHtmlCommand,
  getLintCommand,
  getLintGlobalCommand,
  getListCommand,
  getManifestCommand,
  getPrebuildAllCommand,
  getTemplateCommand,
  getTestCommand,
  getTestAllCommand,
  getTscCommand
];

export const getMainCommand = () => {
  const mainCommand = new Command();
  for (const getter of commands) {
    mainCommand.addCommand(getter());
  }
  return mainCommand;
};
