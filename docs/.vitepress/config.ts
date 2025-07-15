// Vitepress config
import { directoryTreePlugin } from '@sourceacademy/markdown-plugin-directory-tree';
import { defineConfig, type UserConfig } from 'vitepress';
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';
import { withMermaid } from 'vitepress-plugin-mermaid';
import { withSidebar } from 'vitepress-sidebar';
import type { VitePressSidebarOptions } from 'vitepress-sidebar/types';
import _package from '../../package.json' with { type: 'json' };

// https://vitepress.dev/reference/site-config
const vitepressOptions: UserConfig = {
  base: '/devdocs/',
  description: 'Developer documentation for the Source Academy modules repository',
  head: [['link', { rel: 'icon', href: '/devdocs/favicon.ico' }]],
  ignoreDeadLinks: 'localhostLinks',
  lastUpdated: true,
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin);
      md.use(directoryTreePlugin);
    },
    languageAlias: {
      dirtree: 'yml'
    }
  },
  outDir: `${import.meta.dirname}/../../build/devdocs`,
  srcDir: 'src',
  title: 'Modules Developer Documentation',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/favicon.ico',
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Module Development',
        items: [
          {
            text: 'Overview',
            link: '/modules/1-getting-started/1-overview'
          },
          {
            text: 'Getting Started',
            link: '/modules/1-getting-started/2-start'
          },
          {
            text: 'Bundles',
            link: '/modules/2-bundle/1-overview/1-overview'
          },
          {
            text: 'Tabs',
            link: '/modules/3-tabs/1-overview'
          }
        ]
      },
      {
        text: 'Libraries',
        items: [
          {
            text: 'Common Libraries',
            link: '/lib'
          }, {
            text: 'Developer Docs',
            link: '/lib/dev'
          }]
      },
      {
        text: 'Dev Tools',
        items: [
          {
            text: 'Build Tools',
            link: '/buildtools/'
          },
          {
            text: 'Repo Tools',
            link: '/repotools/'
          },
        ]
      }
    ],
    siteTitle: 'SA Modules',
    socialLinks: [
      { icon: 'github', link: _package.repository },
      {
        icon: 'gitbook',
        link: 'https://source-academy.github.io/modules/documentation/'
      }
    ],
    search: {
      provider: 'local'
    }
  },
  vite: {
    // @ts-expect-error something weird going on here
    plugins: [groupIconVitePlugin()]
  }
};

const commonSideBarOptions: VitePressSidebarOptions = {
  documentRootPath: '/src',
  // sortMenusByName: true,

  // TODO: Investigate? Do we need rewrite rules?
  // folderLinkNotIncludesFileName: true,
  useFolderLinkFromSameNameSubFile: true,
  useFolderTitleFromIndexFile: true,
  useTitleFromFrontmatter: true,
  useTitleFromFileHeading: true,
};

const sidebarConfigs: Record<string, VitePressSidebarOptions> = {
  buildtools: {},
  modules: {
    collapseDepth: 1
  },
  lib: {},
  'lib/modules-lib': {},
  repotools: {}
};

const sideBarOptions = Object.entries(sidebarConfigs).map(([startPath, options]): VitePressSidebarOptions => ({
  scanStartPath: startPath,
  resolvePath: `/${startPath}/`,
  ...commonSideBarOptions,
  ...options
}));

export default defineConfig(
  withMermaid({
    ...withSidebar(vitepressOptions, sideBarOptions),
    mermaid: {
      fontFamily: 'Inter', // Use the default font that Vitepress uses
      flowchart: {
        curve: 'linear',
      }
    }
  })
);
