// Workaround for jsdom/undici compatibility issue
// See: https://github.com/nodejs/undici/issues/4000

// This setup file patches the global undici dispatcher to avoid
// "invalid onError method" errors during jsdom tests

try {
  // Try to patch undici dispatcher
  const undici = await import('undici');

  // @ts-expect-error - undici types may not exist
  if (typeof setGlobalDispatcher === 'function' && undici.Agent) {
    // @ts-expect-error - setGlobalDispatcher may not be typed
    setGlobalDispatcher(new undici.Agent());
  }
} catch {
  // Ignore if undici patching fails - this is expected in some environments
}

// Suppress unhandled rejection errors from jsdom/undici (Node.js only)
if (typeof process !== 'undefined' && process.on) {
  process.on('unhandledRejection', (reason: any) => {
    if (reason?.code === 'UND_ERR_INVALID_ARG') {
      // Ignore undici invalid argument errors from jsdom cleanup
    }
  });
}
