import { describe, expect, test, vi } from 'vitest';
import { getMainCommand } from '../main.js';

// Silence command output
vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

describe('Make sure that all subcommands can execute', () => {
  const mainCommand = getMainCommand();
  mainCommand.commands.map(command => test(`Test ${command.name()}`, () => {
    return expect(command.parseAsync(['--help'], { from: 'user' }))
      .rejects
      .toThrow('process.exit called with 0');
  }));
});
