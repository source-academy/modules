import type { LanguageInput, ShikiTransformer, ThemedToken } from 'shiki';
import githubDark from 'tm-themes/themes/github-dark.json' with { type: 'json' };
import githubLight from 'tm-themes/themes/github-light.json' with { type: 'json' };
import { LINE_STRINGS } from './tree';

// Vitepress uses the github themes by default, so we use the colours from
// those themes here
const githubLightColours = [
  githubLight.colors['terminal.ansiBlue'],
  githubLight.colors['terminal.ansiMagenta'],
  githubLight.colors['terminal.ansiCyan'],
  githubLight.colors['terminal.ansiRed'],
  githubLight.colors['terminal.ansiGreen']
];

const githubDarkColours = [
  githubDark.colors['terminal.ansiBlue'],
  githubDark.colors['terminal.ansiMagenta'],
  githubDark.colors['terminal.ansiCyan'],
  githubDark.colors['terminal.ansiRed'],
  githubDark.colors['terminal.ansiGreen']
];

// Assemble the Regex expression using the line strings
const reString = Object.values(LINE_STRINGS)
  .map(value => `(?:${value})`)
  .join('|');
const branchRE = new RegExp(reString, 'g');

/**
 * Finds the locations of every single branch token and returns them
 * as a tuple of location and token
 */
function findBranches(value: string) {
  const output: [loc: number, branch: string][] = [];
  while (true) {
    const match = branchRE.exec(value);
    if (match === null) return output;

    output.push([match.index, match[0]]);
  }
}

/**
 * A textmate grammar for the rendered directory tree
 */
export const grammar: LanguageInput = {
  scopeName: 'source.dirtree',
  name: 'dirtree',
  repository: {
    comment: {
      match: /\/\/.+$/,
      name: 'comment.line.dirtree'
    },
    branch: {
      match: branchRE,
      name: 'dirtree.branch'
    },
    identifier: {
      match: new RegExp(`(?<=(?:${LINE_STRINGS.LAST_CHILD})|(?:${LINE_STRINGS.CHILD})|^)[.\\w-]+`),
      name: 'entity.name'
    },
  },
  patterns: [
    { include: '#branch' },
    { include: '#comment' },
    { include: '#identifier' }
  ]
};

export interface TransformerOptions {
  lightColours?: string[];
  darkColours?: string[];
}

/**
 * Returns a {@link ShikiTransformer} for colouring dirtree diagrams
 */
export function dirtreeTransformer(options: TransformerOptions = {}) {
  const lightColours = options?.lightColours || githubLightColours;
  const darkColours = options?.darkColours || githubDarkColours;

  return {
    tokens(tokens) {
      // don't transform non-dirtree
      if (this.options.lang !== 'dirtree') return tokens;

      const newTokens = tokens.map((line): ThemedToken[] => {
        if (line.length <= 1) {
          // Root identifier or empty line, do nothing
          return line;
        }

        const [firstToken, identifier, ...otherTokens] = line;

        const branches = findBranches(firstToken.content);
        if (branches.length > 0) {
          const [firstBranch] = branches;
          const branchTokens = branches.map(([loc, branch]): ThemedToken => {
            const tokenOffset = loc + firstToken.offset;
            const indentLevel = loc / 4;

            return {
              content: branch,
              offset: tokenOffset,
              htmlStyle: {
                '--shiki-light': lightColours[indentLevel % lightColours.length],
                '--shiki-dark': darkColours[indentLevel % darkColours.length]
              }
            };
          });

          const newIdentifier: ThemedToken = {
            content: identifier.content,
            offset: identifier.offset,
            htmlStyle: branchTokens[branchTokens.length - 1].htmlStyle
          };

          if (firstBranch[0] !== firstToken.offset) {
            // First branch starts with some spaces, so we add them back
            branchTokens.unshift({
              content: ' '.repeat(firstBranch[0]),
              offset: line[0].offset
            });
          }

          return [
            ...branchTokens,
            newIdentifier,
            ...otherTokens
          ];
        } else {
          // Root identifier with comment, do nothing
          return line;
        }
      });

      return newTokens;
    }
  } satisfies ShikiTransformer;
}
