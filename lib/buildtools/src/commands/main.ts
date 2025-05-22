import { Command } from '@commander-js/extra-typings';
import { getBuildCommand } from './build';
import { getListCommand } from './list';
import { getLintCommand, getTscCommand } from './prebuild';
import getTemplateCommand from './template';
import getTestCommand from './testing';

export const getMainCommand = () => new Command()
  .addCommand(getBuildCommand())
  .addCommand(getLintCommand())
  .addCommand(getListCommand())
  .addCommand(getTemplateCommand())
  .addCommand(getTestCommand())
  .addCommand(getTscCommand());
