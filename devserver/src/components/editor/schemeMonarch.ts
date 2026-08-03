import * as monaco from 'monaco-editor';

export function registerSchemeLanguage() {
  monaco.languages.register({ id: 'scheme' });

  monaco.languages.setLanguageConfiguration('scheme', {
    comments: {
      lineComment: ';',
    },
    brackets: [['(', ')'], ['[', ']'], ['{', '}']],
    autoClosingPairs: [
      { open: '(', close: ')' },
      { open: '[', close: ']' },
      { open: '{', close: '}' },
      { open: '"', close: '"' },
    ],
    surroundingPairs: [
      { open: '(', close: ')' },
      { open: '[', close: ']' },
      { open: '{', close: '}' },
      { open: '"', close: '"' },
    ],
  });

  monaco.languages.setMonarchTokensProvider('scheme', {
    defaultToken: 'source',
    ignoreCase: false,
    brackets: [
      { open: '(', close: ')', token: 'delimiter.parenthesis' },
      { open: '[', close: ']', token: 'delimiter.square' },
      { open: '{', close: '}', token: 'delimiter.curly' },
    ],
    keywords: [
      'define', 'lambda', 'let', 'let*', 'letrec', 'cond', 'if', 'else', 'and', 'or', 'begin',
      'quote', 'quasiquote', 'unquote', 'unquote-splicing', 'set!', 'delay', 'import', 'export'
    ],
    tokenizer: {
      root: [
        [/;.*$/, 'comment'],
        [/"(?:[^"\\]|\\.)*"/, 'string'],
        [/[+-]?((\d+\.\d*)|(\.\d+)|\d+)([eE][+-]?\d+)?/, 'number'],
        [/#t|#f/, 'constant'],
        [/#\(/, 'delimiter'],
        [/'|`/, 'keyword'],
        [/,@|,/, 'keyword'],
        [/[.]/, 'delimiter'],
        [/[()[\]{}]/, '@brackets'],
        [/[a-zA-Z_!$%&*+\-./:<=>?@^~][a-zA-Z0-9_!$%&*+\-./:<=>?@^~]*/, {
          cases: {
            '@keywords': 'keyword',
            '@default': 'identifier',
          },
        }],
        [/\s+/, 'white'],
      ],
    },
  });
}
