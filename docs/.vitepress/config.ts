import { defineConfig, type UserConfig } from 'vitepress';
import { withSidebar } from 'vitepress-sidebar';
import type { VitePressSidebarOptions } from 'vitepress-sidebar/types';
import _package from '../../package.json' with { type: 'json' };

// https://vitepress.dev/reference/site-config
const vitepressOptions: UserConfig = {
  base: '/devdocs/',
  description: 'Developer documentation for the Source Academy modules repository',
  ignoreDeadLinks: 'localhostLinks',
  outDir: `${import.meta.dirname}/../../build/devdocs`,
  srcDir: 'src',
  title: 'Modules Developer Documentation',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
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
            link: '/modules/1-getting-started/2-overview'
          }
        ]
      },
      { text: 'Common Library', link: '/lib' },
      {
        text: 'Dev Tools',
        items: [
          {
            text: 'Build Tools',
            link: '/buildtools'
          },
          {
            text: 'Repo Tools',
            link: '/repotools'
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
  modules: {},
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

export default defineConfig(withSidebar(vitepressOptions, sideBarOptions));
