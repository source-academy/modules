# Vitest Reporters

The `@sourceacademy/vitest-reporter` package contains 2 reporters designed to work with Vitest. One is a reporter
for the test results as produced by Vitest.

The other is a test coverage reporter. Vitest internally uses the Istanbul reporter interface, which as of the time of writing
seems to only be available in CommonJS format. Thus, this reporter has to be written and built for the CJS format.

Both reporters write their output to the Github Actions summary, which is as simple as opening the file specified by the
`GITHUB_STEP_SUMMARY` environment available in **append** mode and then writing to it.

If the reporters aren't running in the Github Actions environment, `GITHUB_STEP_SUMMARY` won't be defined and neither
reporter will produce any output.

Unlike the other packages in this repository, the transpiled version of both reporters is committed to Github and the
reporters are referenced using their local paths by Vitest configurations.
Otherwise, every other package in this repository will have to add the `@sourceacademy/vitest-reporter` as a (dev) dependency.
