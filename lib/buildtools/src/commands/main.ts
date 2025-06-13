import { Command } from '@commander-js/extra-typings';
import { getBuildCommand } from './build.js';
import { getLintCommand } from './lint.js';
import { getListCommand } from './list.js';
import getTemplateCommand from './template.js';
import { getTestCommand } from './testing.js';

export const getMainCommand = () => new Command()
  .addCommand(getBuildCommand())
  .addCommand(getLintCommand())
  .addCommand(getListCommand())
  .addCommand(getTemplateCommand())
  .addCommand(getTestCommand());
