import { getLintCommand } from '../lint';

const mockedLinter = jest.fn();

jest.mock('eslint', () => ({
  loadESLint: () => {
    return class {
      public fix: boolean;
      constructor({ fix }: { fix: boolean }) {
        this.fix = fix;
      }

      lintFiles = mockedLinter;
      loadFormatter() {
        return Promise.resolve({
          format: () => Promise.resolve('')
        });
      }

      static outputFixes() {
        return Promise.resolve();
      }
    };
  }
}));

function runCommand(...args: string[]) {
  return getLintCommand().parseAsync(args, { from: 'user' });
}

describe('test runEslint', () => {
  test('Fixable errors without fix should still cause errors', () => {
    mockedLinter.mockResolvedValueOnce([{ fatalErrorCount: 0, errorCount: 1 }]);
    return expect(runCommand())
      .rejects
      .toMatchInlineSnapshot('[Error: process.exit called with 1]');
  });

  test('Fixable errors with fix should not cause errors', () => {
    mockedLinter.mockResolvedValueOnce([{ fatalErrorCount: 0, errorCount: 1 }]);
    return expect(runCommand('--fix'))
      .resolves
      .not.toThrow();
  });

  test('Unfixable errors without fix should cause errors', () => {
    mockedLinter.mockResolvedValueOnce([{ fatalErrorCount: 1, errorCount: 1}]);
    return expect(runCommand())
      .rejects
      .toMatchInlineSnapshot('[Error: process.exit called with 1]');
  });

  test('Unfixable errors with fix should cause errors', () => {
    mockedLinter.mockResolvedValueOnce([{ fatalErrorCount: 1, errorCount: 1 }]);
    return expect(runCommand('--fix'))
      .rejects
      .toMatchInlineSnapshot('[Error: process.exit called with 1]');
  });
});
