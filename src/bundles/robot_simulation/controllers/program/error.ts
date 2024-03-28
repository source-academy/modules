export class ProgramError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProgramError';
  }
}
