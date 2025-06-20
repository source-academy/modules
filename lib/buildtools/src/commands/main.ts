import { Command } from '@commander-js/extra-typings';
import { getBuildCommand } from './build.js';
import { getListCommand } from './list.js';
import { getLintCommand, getTscCommand } from './prebuild.js';
import getTemplateCommand from './template.js';
import { getTestCommand } from './testing.js';

export const getMainCommand = () => new Command()
  .addCommand(getBuildCommand())
  .addCommand(getLintCommand())
  .addCommand(getListCommand())
  .addCommand(getTemplateCommand())
  .addCommand(getTestCommand())
  .addCommand(getTscCommand());
