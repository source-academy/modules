import { defineConfig, type UserConfig } from 'vitepress';
import { withSidebar } from 'vitepress-sidebar';
import type { VitePressSidebarOptions } from 'vitepress-sidebar/types';
import _package from '../../package.json' with { type: 'json' };

// https://vitepress.dev/reference/site-config
const vitepressOptions: UserConfig = {
  description: 'Developer documentation for the Source Academy modules repository',
  srcDir: 'src',
  title: 'Modules Developer Documentation',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Module Development', link: '/modules' }
    ],
    siteTitle: 'SA Modules',
    sociallinks: [
      { icon: 'github', link: _package.repository },
      {
        icon: 'gitbook',
        link: 'https://source-academy.github.io/modules/documentation/'
      }
    ],
    search: {
      provider: 'local'
    }
  }
};

const commonSideBarOptions: VitePressSidebarOptions = {
  sortMenusByFrontmatterOrder: true,
  useFolderLinkFromSameNameSubFile: true,
  useFolderTitleFromIndexFile: true,
  useTitleFromFrontmatter: true,
  useTitleFromFileHeading: true,
};

const sideBarOptions: VitePressSidebarOptions[] = [
  {
    documentRootPath: '/src',
    scanStartPath: 'buildtools',
    resolvePath: '/buildtools/',
  },
  {
    documentRootPath: '/src',
    scanStartPath: 'modules',
    resolvePath: '/modules/',
  }
].map(each => ({
  ...commonSideBarOptions,
  ...each,
}));

export default defineConfig(withSidebar(vitepressOptions, sideBarOptions));

/*
export default defineConfig({

  themeConfig: {
    siteTitle: 'SA Modules',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Module Development', link: '/modules' }
    ],

    sidebar: {
      '/buildtools/': [
        {
          text: 'Build Tools Overview',
          link: '/buildtools',
          items: [
            {
              text: 'Command Handlers',
              link: './command'
            },
            {
              text: 'Builders',
              link: './builders'
            },
            {
              text: 'Prebuild Tasks',
              link: './prebuild',
            },
            {
              text: 'Testing',
              link: './testing'
            },
            {
              text: 'Templates',
              link: './templates'
            }
          ]
        }
      ],
      '/buildtools/builders/': [{
        text: 'Builders',
        link: '/buildtools/builders',
        items: [
          {
            text: 'Bundles and Tabs',
            link: './modules'
          },
          {
            text: 'Documentation',
            link: './docs'
          },
          {
            text: 'Manifest',
            link: './manifest'
          }
        ]
      }],
      '/lib/': [{
        text: 'Modules Libraries',
        items: [
          {
            text: 'ESLint Plugin',
            link: '/lib/lintplugin'
          },
          {
            text: 'Common Library',
            link: '/lib/modules-lib/modules'
          }
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

    sociallinks: [
      { icon: 'github', link: _package.repository },
      {
        icon: 'gitbook',
        link: 'https://source-academy.github.io/modules/documentation/'
      }
    ],
    search: {
      provider: 'local'
    }
  }
});
*/
