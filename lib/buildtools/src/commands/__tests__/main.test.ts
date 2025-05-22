import { getMainCommand } from '../main';
describe('Make sure that all subcommands can execute', () => {
  const mainCommand = getMainCommand();
  // eslint-disable-next-line jest/valid-title
  mainCommand.commands.map(command => test(command.name(), () => {
    return expect(command.parseAsync(['--help'], { from: 'user' }))
      .rejects
      .toThrow();
  }));
});
