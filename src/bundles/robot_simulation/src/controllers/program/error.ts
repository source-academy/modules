import { RuntimeSourceError } from '@sourceacademy/modules-lib/errors';

export class ProgramError extends RuntimeSourceError<undefined> {
  constructor(public readonly explanation: string) {
    super(undefined);
  }

  public override explain(): string {
    return this.explanation;
  }
}
