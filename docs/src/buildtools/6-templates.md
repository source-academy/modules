# Templates

The template command is designed to produce simple scaffolding for developers trying to create a new bundle/tab. It is based around the `readline:promises` library to get user input.

When run, `fs.cp` is called to copy the template directory to the new directory of the bundle or tab, and then the three json files (`tsconfig`, `manifest` and `package`) are written to that folder.
The command will read the version of Typescript from the root `package.json` and use it for both bundles and tabs, while specifically for tabs the versions of `@blueprintjs`, React, `react-dom` and their
types are used.
