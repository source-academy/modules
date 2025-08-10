---
title: Modules Developer Docs
---

<script setup>
  import { data } from './devdocs.data.ts'
</script>

<h1>Bundles Developer Documentation</h1>
<p>This the index page for bundles that have documentation intended for developers working with them</p>
<ul>
  <li v-for="doc of data">
    <a :href="doc.url">{{ doc.frontmatter.title }}</a>
  </li>
</ul>
