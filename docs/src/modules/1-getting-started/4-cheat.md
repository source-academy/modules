<script setup>
  import { data } from './scripts.data.ts';
  const { globalScripts, rootScripts } = data
</script>

# Commands Cheat Sheet

All commands have a `-h` or `--help` option that can be used to get more information about the command.

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
      <td><code>yarn add &lt;package&gt;</code>*</td>
      <td>
        Adds a package to the current bundle or tab <br />
      </td>
    </tr>
    <tr>
      <td><code>yarn add -D &lt;package&gt;</code>*</td>
      <td>
        Adds a package to the current bundle or tab that will only be used during runtime <br />
      </td>
    </tr>
  </tbody>
</table>

\* Will add packages to the root repository. Only do this if you are adding or updating a constraint for the entire repository.

## Bundle or Tab Specific Commands

These commands are only applicable to bundles or tabs and should only be run from within the bundle or tab's directory.

### Compilation

<table>
  <thead>
    <tr>
      <th>Command</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>yarn build</code></td>
      <td>Compiles the bundle or tab to the <code>/build</code> directory</td>
    </tr>
    <tr>
      <td><nobr><code>yarn build --tsc</code></nobr></td>
      <td>Same as <code>yarn build</code> but also runs <code>tsc</code> for type checking</td>
    </tr>
    <tr>
      <td><nobr><code>yarn build --lint</code></nobr></td>
      <td>Same as <code>yarn build</code> but also runs ESLint</td>
    </tr>
  </tbody>
</table>

Both the `--tsc` and `--lint` options can be used togther to run `tsc` and ESLint simultaneously.

### Prebuild and Testing

<ins>Prebuild</ins> refers to commands that are to be run **before** the build/compilation commands are executed.

| Command                   | Purpose                                                       |
|---------------------------|---------------------------------------------------------------|
| `yarn lint`               | Run ESLint                                                    |
| `yarn tsc`                | Run `tsc`                                                     |
| `yarn prebuild`           | Run both ESLint and `tsc` without running any builds          |
| `yarn test`               | Run any unit tests defined for the current bundle/tab         |

#### NOTES

- Running `yarn lint --fix` will fix any automatically fixable errors
- The test command has several options. Refer to [this](../4-advanced/testing) page for more information.

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
    <tr v-for="cmd of rootScripts">
      <td><nobr><code>yarn {{ cmd.name }}</code></nobr></td>
      <td>{{ cmd.info }} </td>
    </tr>
  </tbody>
</table>

### Global Commands

Yarn considers scripts with a ":" in their name to be a [global script](https://yarnpkg.com/features/workspaces#global-scripts) that can be run from anywhere,
including child workspaces. In other words, these commands are available throughout the repository, not just at the root level.

In general, global scripts for this repository follow the same format.

- `:all` will be run for all code in the respository
- `:devserver` will only be run for the devserver.
- `:libs` will be run for all code under the `lib` folder (common modules libraries)
- `:modules` will be run for all bundle and tab code

<table>
  <thead>
    <tr>
      <th>Command</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="cmd of globalScripts">
      <td><nobr><code>yarn {{ cmd.name }}</code></nobr></td>
      <td>{{ cmd.info }} </td>
    </tr>
  </tbody>
</table>
