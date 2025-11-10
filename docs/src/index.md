---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: SA Modules Developer Documentation
  tagline: Developer documentation for the Source Academy modules repository
  image:
    src: /favicon.ico

features:
  - title: Your first bundle or tab
    icon:
      width: 43
      src: /hero-icons/tut.png
    details: Instructions for creating a bundle or tab
    link: /modules/1-getting-started/1-overview

  - title: Common Modules Libraries
    icon:
      src: /hero-icons/library.png
      width: 40
    details: Libraries intended to be shared between SA Modules
    link: /lib

  - title: Build Tools
    icon:
      src: /hero-icons/tools.png
      width: 40
    details: Details behind the tooling that compiles SA Modules
    link: /buildtools

  - title: Repository Tools
    icon:
      src: /hero-icons/github.png
      width: 40
    details: Details for the tools used to aid in developing SA Modules
    link: /repotools
---

<p style="color: gray">
<!-- The target attribute must be specified, otherwise the site redirects to a 404. See here: https://vitepress.dev/guide/routing#linking-to-non-vitepress-pages -->
Not a developer? Documentation for the Source Modules themselves is <a href="https://source-academy.github.io/modules/documentation/" target="_self">here</a>
</p>
