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
      '/modules/': [
        {
          text: 'Developing Modules',
          items: [
            {
              text: 'Modules Overview',
              link: '/modules'
            },
            {
              text: 'Getting Started',
              link: '/modules/getting-started'
            },
            {
              text: 'Unit Testing',
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
              text: 'Using the Frontend',
              link: '/modules/tabs/frontend'
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
                  text: 'Bundle Documentation',
                  link: '/modules/bundle/documentation'
                },
                {
                  text: 'Compiling a Bundle',
                  link: '/modules/bundle/compiling'
                },
                {
                  text: 'Bundle Type Maps',
                  link: '/modules/bundle/type_map'
                }
              ]
            },
            {
              text: 'Tabs',
              items: [
                {
                  text:' Tabs Overview',
                  link: '/modules/tabs'
                },
                {
                  text: 'Creating a Tab',
                  link: '/modules/tabs/creating'
                },
                {
                  text: 'Editing a Tab',
                  link: '/modules/tabs/editing'
                },
                {
                  text: 'Compiling a tab',
                  link: '/modules/tabs/compiling'
                },
                {
                  text: 'Working with Context',
                  link: '/modules/tabs/context'
                },
                {
                  text: 'Using the Dev Server',
                  link: '/modules/tabs/devserver'
                },

              ]
            }
          ]
        },
      ]
    },

    socialLinks: [
      { icon: 'github', link: _package.repository },
      {
        icon: 'gitbook',
        link: 'https://source-academy.github.io/modules/documentation/'
      }
    ]
  }
});
