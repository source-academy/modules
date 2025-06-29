---
title: Modules Developer Docs
---

<script setup>
  import { data } from './devdocs.data.js'
</script>

<h1>Bundles Developer Documentation</h1>
<p>This an the index page for bundles that have documentation for developers working them</p>
<ul>
  <li v-for="doc of data">
    <a :href="doc.url">{{ doc.frontmatter.title }}</a>
  </li>
</ul>

