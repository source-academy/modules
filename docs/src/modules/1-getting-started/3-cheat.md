# Commands Cheat Sheet

## Installation Commands
<table>
  <thead>
    <tr>
      <th>Command</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>yarn workspaces focus @sourceacademy/modules</code></td>
      <td>Installs the dependencies required for the repository <strong>only</strong> (like the build tools)</td>
    </tr>
    <tr>
      <td><code>yarn workspaces focus @sourceacademy/bundle-curve</code></td>
      <td>Installs the dependencies required for the `curve` bundle <strong>only</strong> </td>
    </tr>
    <tr>
      <td><code>yarn add &lt;package&gt;</code></td>
      <td>
        Adds a package to the current bundle or tab <br />
        (SHOULD ONLY BE RUN WITHIN THE BUNDLE OR TAB DIRECTORY)
      </td>
    </tr>
    <tr>
      <td><code>yarn add -D &lt;package&gt;</code></td>
      <td>
        Adds a package to the current bundle or tab that will only be used during runtime <br />
        (SHOULD ONLY BE RUN WITHIN THE BUNDLE OR TAB DIRECTORY)
      </td>
    </tr>
  </tbody>
</table>

## Bundle or Tab Specific Commands

### Compilation
| Command                   | Purpose                                                       |
|---------------------------|---------------------------------------------------------------|
| `yarn build`              | Compiles the bundle or tab to the `/build` directory          |
| `yarn build --tsc`        | Same as `yarn build` but also runs `tsc` for type checking    |
| `yarn build --lint`       | Same as `yarn build` but also runs ESLint for linting         |
| `yarn build --lint --tsc` | Run both ESLint and `tsc` simultaneously before running build |

### Prebuild and Testing
<ins>Prebuild</ins> refers to commands that are to be run **before** the build/compilation commands are executed.
| Command                   | Purpose                                                       |
|---------------------------|---------------------------------------------------------------|
| `yarn lint`               | Run ESLint                                                    |
| `yarn tsc`                | Run `tsc`                                                     |
| `yarn prebuild`           | Run both ESLint and `tsc` without running any builds          |
| `yarn test`               | Run any unit tests defined for the current bundle/tab         |

## Root Repository Commands
### Root Only Commands
These commands should only be run from the root of the Git repository.

<table>
  <thead>
    <tr>
      <th>Command</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><nobr><code>yarn devserver</code></nobr></td>
      <td>Start the modules development server</td>
    </tr>
    <tr>
      <td><nobr><code>yarn serve</code></nobr></td>
      <td>Run the modules server to serve modules to local copies of <code>js-slang</code> and the frontend </td>
    </tr>
  </tbody>
</table>

### Global Commands
Yarn considers scripts with a ":" in their name to be a [global script](https://yarnpkg.com/features/workspaces#global-scripts) that can be run from anywhere,
including child workspaces. In other words, these commands are available throughout the repository, not just at the root level.

<table>
  <thead>
    <tr>
      <th>Command</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><nobr><code>yarn build:modules</code></nobr></td>
      <td>Builds all bundles, tabs, JSONS and HTML documentation</td>
    </tr>
    <tr>
      <td><nobr><code>yarn build:docs</code></nobr></td>
      <td>Builds JSONS and HTML documentation for all bundles. <br /> Useful if you're only changing documentation.</td>
    </tr>
    <tr>
      <td><nobr><code>yarn template</code></nobr></td>
      <td>Starts the interactive bundle/tab creator</td>
    </tr>
  </tbody>
</table>
