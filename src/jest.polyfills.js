const { TextDecoder, TextEncoder } = require("node:util");

// According to the Jest docs, https://mswjs.io/docs/migrations/1.x-to-2.x#environment
Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
});
