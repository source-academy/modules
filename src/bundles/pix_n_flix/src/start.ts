import context from 'js-slang/context';
import { internal_start } from './functions';

/**
 * Starts processing the image or video using the installed filter.
 */
export function start(): void {
  const startPacket = internal_start();

  if (!context.moduleContexts.pix_n_flix.state) {
    context.moduleContexts.pix_n_flix.state = startPacket;
  }
}
