// @ts-check

import { defineConfig } from 'cspell';

export default defineConfig({
  allowCompoundWords: true,
  dictionaries: [
    'en_GB',
    'en_US',
    'node',
    'typescript'
  ],
  patterns: [{
    name: "markdownCodeBlock",
    pattern: [
      /^\s*```[\s\S]*?^\s*```/gm, // ignore things within full code blocks
      /`.+?`/g,                   // ignore things within inline code blocks
    ]
  }],
  language: 'en-US,en-GB',
  words: [
    'buildtools',
    'devserver',
    'dirtree',
    'frontmatter',
    'Henz',
    'repotools',
    'sourceacademy'
  ],
  ignoreRegExpList: [
    'href',
    'markdownCodeBlock',
  ]
});
