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
      { text: 'Module Development', link: '/modules/' },
      { text: 'Common Library', link: '/lib' },
      { text: 'Build Tools', link: '/buildtools' }
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
  '/lib/modules-lib': {}
};

const sideBarOptions = Object.entries(sidebarConfigs).map(([startPath, options]): VitePressSidebarOptions => ({
  scanStartPath: startPath,
  resolvePath: `/${startPath}/`,
  ...commonSideBarOptions,
  ...options
}));

export default defineConfig(withSidebar(vitepressOptions, sideBarOptions));
