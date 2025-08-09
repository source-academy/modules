---
title: Config Reference
---
<script setup>
  import { data } from './configs.data.ts';
</script>

# Configurations Reference
Following the [ESLint conventions](https://eslint.org/docs/latest/extend/shareable-configs) for sharing configurations, each of the configurations
are named with a different prefix to indicate what kind of configuration it is.

Each configuration might consist of 1 or more sub configurations
Each of the tables belows contains information about what rules have been configured for each sub configuration and for what files.

Some of the rules have URL links to documentation; you can click on the name of the rule to see the associated documentation page.

::: details Dynamic Loading
This page is actually dynamically created based on the configuration objects exported by the Lint plugin alongside
some clever Vue magic

This does mean that some of the configurations might have weird names as they are directly loaded from the recommended
configurations provided from plugins.
:::

<div v-for="config of data">
  <h2><code>{{ config.name }}</code> Configuration</h2>
  <div v-for="subConfig of config.configs">
    <h3><code>{{ subConfig.name }}</code></h3>
    <ul>
      <li v-if="subConfig.files">
        Applies to:
        <ul>
          <li v-for="pattern of subConfig.files">
            <code>{{ pattern }}</code>
          </li>
        </ul>
      </li>
      <li v-if="subConfig.ignores">
        Ignores: <code>{{ subConfig.ignores }} </code>
      </li>
      <li v-if="subConfig.plugins">
        <p>Plugins Required:</p>
        <ul v-for="pluginName of subConfig.plugins">
          <li>
            <code>{{ pluginName }}</code>
          </li>
        </ul>
      </li>
      <li v-if="subConfig.rules.length >= 1">
        <details>
          <summary>Rules</summary>
          <table>
            <thead>
              <tr>
                <th>Rule</th>
                <th>Severity</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rule of subConfig.rules">
                <td v-if="rule.url !== undefined">
                  <a :href="rule.url">
                    <code>{{ rule.name }}</code>
                  </a>
                </td>
                <td v-if="rule.url === undefined">
                  <code>{{ rule.name }}</code>
                </td>
                <td>
                  <code>{{ rule.severity }}</code>
                </td>
                <td>
                  <details v-if="rule.options">
                    <code>{{ rule.options }}</code>
                  </details>
                </td>
              </tr>
            </tbody>
          </table>
        </details>
      </li>
      <li v-if="subConfig.rules.length === 0">
        <p>This configuration has no rules.</p>
      </li>
    </ul>
  </div>
</div>
