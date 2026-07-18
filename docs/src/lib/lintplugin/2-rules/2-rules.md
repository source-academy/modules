---
title: Rules Reference
---
<script setup>
  import { data } from './rules.data.ts';
</script>

# Lint Plugin Rules Reference

List of ESLint rules provided by the plugin

<table>
  <thead>
    <tr>
      <th>Rule Name</th>
      <th>Description</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="rule of data">
      <td><nobr><code>{{ rule.name }}</code></nobr></td>
      <td>{{ rule.desc }}</td>
      <td><a :href="rule.name">Link</a></td>
    </tr>
  </tbody>
</table>
