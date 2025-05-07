/**
 * This function is used to interrupt the frontend execution.
 * When called, the frontend will notify that the program has ended successfully
 * and display a message that the program is stopped by a module.
 */
export function interrupt() {
  throw 'source_academy_interrupt';
}
