import 'vitest'

declare module 'vitest' {
  interface Matchers<T = any> {
    /**
     * Asserts that the promise resolves
     */
    commandSuccess: () => Promise<T>

    /**
     * Asserts that process.exit was called with the specified code
     */
    commandExit: (code?: number) => Promise<T>
  }
}