import { Command } from '@commander-js/extra-typings';
import { getBuildCommand } from './build';
import { getLintCommand } from './lint';
import { getListCommand } from './list';
import getTemplateCommand from './template';
import { getTestCommand } from './testing';

export const getMainCommand = () => new Command()
  .addCommand(getBuildCommand())
  .addCommand(getLintCommand())
  .addCommand(getListCommand())
  .addCommand(getTemplateCommand())
  .addCommand(getTestCommand());
