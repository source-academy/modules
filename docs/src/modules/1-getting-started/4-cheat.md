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
      <td>Installs the dependencies required for the <code>curve</code> bundle <strong>only</strong> </td>
    </tr>
    <tr>
      <td><code>yarn add &lt;package&gt;</code></td>
      <td>
        Adds a package to the current bundle or tab <br />
      </td>
    </tr>
    <tr>
      <td><code>yarn add -D &lt;package&gt;</code></td>
      <td>
        Adds a package to the current bundle or tab that will only be used during runtime <br />
      </td>
    </tr>
  </tbody>
</table>

> [!WARNING] Adding Dependencies
> `yarn add` will add the dependencies to the package whose directory this command is being run under. For example,
> if you run `yarn add` from `src/bundles/curve`, then the dependencies get added to the curve bundle.
>
> However, if you run `yarn add` from the root of the repository, then the dependencies get added to the
> `@sourceacademy/modules` package instead.
>
> Be careful of where you run this command so as to avoid extraneous dependencies being added to the wrong packages.

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
      <td>
        Same as <code>yarn build</code> but also runs <code>tsc</code> for type checking. <br/>
        For bundles, this will also output the library form of the bundle
      </td>
    </tr>
    <tr>
      <td><nobr><code>yarn build --lint</code></nobr></td>
      <td>Same as <code>yarn build</code> but also runs ESLint</td>
    </tr>
  </tbody>
</table>

Both the `--tsc` and `--lint` options can be used together to run `tsc` and ESLint simultaneously.

### Prebuild and Testing

<ins>Prebuild</ins> refers to commands that are to be run **before** the build/compilation commands are executed.
<table>
  <thead>
    <tr>
      <th>Command</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>yarn lint</code></td>
      <td>Run ESLint on the bundle's/tab's code</td>
    </tr>
    <tr>
      <td><code>yarn tsc</code></td>
      <td>Run the typescript compiler. For bundles, this will <br/> also output the library form of the bundle.</td>
    </tr>
    <tr>
      <td><code>yarn prebuild</code></td>
      <td>Run both ESLint and <code>tsc</code> <strong>without</strong> running any builds</td>
    </tr>
    <tr>
      <td><code>yarn test</code></td>
      <td>Run any unit tests defined for the bundle/tab</td>
    </tr>
    <tr>
      <td><code>yarn serve</code></td>
      <td>Start the modules server</td>
    </tr>
  </tbody>
</table>

#### NOTES

- Running `yarn lint --fix` will fix any automatically fixable errors
- The test command has several options. Refer to [this](../4-testing/4-unit/1-general) page for more information.

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

- `:all` will be run for all code in the repository
- `:devserver` will only be run for the devserver.
- `:libs` will be run for all code under the `lib` folder (common modules libraries)
- `:modules` will be run for all bundle and tab code

> [!WARNING] On Focused Installs
> If you used a focused install, the dependencies for the other bundles and tabs will not be available. The root
> repository's package may not have been installed either.
>
> Without the root package being installed, many of the `:all` and `:modules` commands may not work. You can still use the bundle or tab specific
> commands instead.

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
