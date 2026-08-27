import { OptionDefaults } from 'typedoc';

// typedoc options reference: https://typedoc.org/documents/Options.html

/**
 * @type {
 *   import('typedoc').TypeDocOptions &
 *   import('typedoc-plugin-markdown').PluginOptions &
 *   import('typedoc-plugin-frontmatter').PluginOptions
 * }
 */
const typedocOptions = {
  entryPoints: [
    'src/tabs/index.ts',
    'src/types',
    'src/*.ts'
  ],
  name: 'Modules Common Library',
  out: '../../docs/src/lib/modules-lib',
  plugin: [
    'typedoc-plugin-frontmatter',
    'typedoc-plugin-markdown',
    'typedoc-plugin-rename-defaults'
  ],
  readme: 'none',
  router: 'module',
  skipErrorChecking: true,
  externalSymbolLinkMappings: {
    '@blueprintjs/core': {
      EditableText: 'https://blueprintjs.com/docs/#core/components/editable-text',
      Switch: 'https://blueprintjs.com/docs/#core/components/switch'
    },
    'js-slang': {
      RuntimeSourceError: '#'
    }
  },

  // This lets us define some custom block tags
  blockTags: [
    ...OptionDefaults.blockTags,
    '@title'
  ],
  // that we can use as frontmatter tags
  frontmatterCommentTags: ['title'],

  // Formatting Options
  classPropertiesFormat: 'htmlTable',
  entryFileName: 'index',
  expandObjects: true,
  hidePageHeader: true,
  interfacePropertiesFormat: 'htmlTable',
  mergeReadme: true,
  parametersFormat: 'htmlTable',
  typeAliasPropertiesFormat: 'htmlTable',
  useCodeBlocks: true,

  // Organizational Options
  categorizeByGroup: true,
  categoryOrder: ['*', 'Other'],
  navigation: {
    includeCategories: true,
    includeGroups: false
  },
  sort: [
    'alphabetical',
    'kind',
  ]
};

export default typedocOptions;
