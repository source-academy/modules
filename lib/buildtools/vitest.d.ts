import 'vitest'

declare module 'vitest' {
  interface Matchers<T = any> {
    /**
     * Asserts that the promise resolves
     */
    commandSuccess: () => Promise<T>

    /**
     * Asserts that process.exit was called with the specified code when the promise resolves
     */
    commandExit: (code?: number) => Promise<T>

    /**
     * Asserts that process.exit was called with the specified code when the
     * function is called
     */
    processExit: (code?: number) => T

    /**
     * Checks if the given path resolves to the same location as the expected
     * path
     */
    toMatchPath: (p: string) => T
  }
}
