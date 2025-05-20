import { getMainCommand } from "../main"
describe('Make sure that all subcommands can execute', () => {
  const mainCommand = getMainCommand()
  mainCommand.commands.map(command => test(command.name(), () => {
    return expect(command.parseAsync(['--help'], { from: 'user' }))
      .rejects
      .toThrow()
  }))
})