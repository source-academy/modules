import { defineConfig } from 'vitepress';
import _package from '../../package.json' with { type: 'json' };

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Modules Developer Documentation',
  description: 'Developer documentation for the Source Academy modules repository',
  srcDir: 'src',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Develop a Module', link: '/modules' }
    ],

    sidebar: {
      '/': [{
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }],
      '/modules/': [
        {
          text: 'Developing Modules',
          items: [
            {
              text: 'Modules Overview',
              link: '/modules'
            },
            {
              text: 'Writing Tests',
              link: '/modules/testing'
            },
            {
              text: 'Linting',
              link: '/modules/linting'
            },
            {
              text: 'Module Contexts',
              link: '/modules/context'
            },
            {
              text: 'Bundles',
              items: [
                {
                  text: 'Bundles Overview',
                  link: '/modules/bundle'
                },
                {
                  text: 'Creating a Bundle',
                  link: '/modules/bundle/creating'
                },
                {
                  text: 'Editing a Bundle',
                  link: '/modules/bundle/editing'
                },
                {
                  text: 'Compiling a Bundle',
                  link: '/modules/bundle/compiling'
                }
              ]
            },
            {
              text: 'Tabs',
              items: [{
                text:' Tabs Overview',
                link: '/modules/tabs/overview'
              }]
            }
          ]
        },
      ]
    },

    socialLinks: [
      { icon: 'github', link: _package.repository }
    ]
  }
});
