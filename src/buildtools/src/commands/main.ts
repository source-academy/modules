import { Command } from "@commander-js/extra-typings";
import { getBuildCommand } from "./build";
import getTemplateCommand from "./template";
import getTestCommand from "./testing";

export const getMainCommand = () => new Command()
  .addCommand(getBuildCommand())
  .addCommand(getTemplateCommand())
  .addCommand(getTestCommand())