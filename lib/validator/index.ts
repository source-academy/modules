import { startVitest } from 'vitest/node';
import config from './test.config';

export async function runValidationTests() {
  const vitest = await startVitest('test', [], undefined, config);

  if (vitest.shouldKeepServer()) {
    // If Vitest is called in watch mode, then we wait for the onClose hook
    // to be called to return instead
    // Refer to https://vitest.dev/advanced/api/vitest.html#shouldkeepserver
    await new Promise<void>(resolve => vitest.onClose(resolve));
  } else {
    await vitest.close();
  }
}
