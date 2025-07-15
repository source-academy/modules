// Adapted from: https://gitlab.com/nfriend/tree-online/-/tree/master?ref_type=heads

import type { RecursiveArray } from 'lodash';
import defaultsDeep from 'lodash/defaultsDeep';
import flattenDeep from 'lodash/flattenDeep';
import last from 'lodash/last';
import type { FileStructure } from './types';

/**
 * Represents an object that contains the
 * actual strings used to render the tree
 */
interface LineStringSet {
  /** The string to render immediately before non-last children */
  CHILD: string;

  /** The string to render immediately before the last child */
  LAST_CHILD: string;

  /** The string to render for parent directories */
  DIRECTORY: string;

  /** The string to render for empty space */
  EMPTY: string;
}

/** Contains all strings for tree rendering */
const LINE_STRINGS: { [charset: string]: LineStringSet } = {
  ascii: {
    CHILD: '|-- ',
    LAST_CHILD: '`-- ',
    DIRECTORY: '|   ',
    EMPTY: '    ',
  },
  'utf-8': {
    CHILD: '├── ',
    LAST_CHILD: '└── ',
    DIRECTORY: '│   ',
    EMPTY: '    ',
  },
};

/**
 * Represents all rendering options available
 * when calling `generateTree`
 */
interface GenerateTreeOptions {
  /**
   * Which set of characters to use when
   * rendering directory lines
   */
  charset?: 'ascii' | 'utf-8';

  /**
   * Whether or not to append trailing slashes
   * to directories. Items that already include a
   * trailing slash will not have another appended.
   */
  trailingDirSlash?: boolean;

  /**
   * Whether or not to print the full
   * path of the item
   */
  fullPath?: boolean;

  /**
   * Whether or not to render a dot as the root of the tree
   */
  rootDot?: boolean;
}

/** The default options if no options are provided */
const defaultOptions: GenerateTreeOptions = {
  charset: 'utf-8',
  trailingDirSlash: false,
  fullPath: false,
  rootDot: true,
};

/**
 * Generates an ASCII tree diagram, given a FileStructure
 * @param structure The FileStructure object to convert into ASCII
 * @param options The rendering options
 */
export function generateTree(
  structure: FileStructure,
  commentLoc: number,
  options?: GenerateTreeOptions
): string {
  const combinedOptions = defaultsDeep({}, options, defaultOptions);

  return flattenDeep([
    getAsciiLine(structure, commentLoc, combinedOptions),
    structure.children.map(c => generateTree(c, commentLoc, options)) as RecursiveArray<string>,
  ])
    // Remove null entries. Should only occur for the very first node
    // when `options.rootDot === false`
    .filter(line => line != null)
    .join('\n');
}

/**
 * Returns a line of ASCII that represents
 * a single FileStructure object
 * @param structure The file to render
 * @param options The rendering options
 */
function getAsciiLine(
  structure: FileStructure,
  commentLoc: number,
  options: GenerateTreeOptions
): string | null {
  const lines = LINE_STRINGS[options.charset as string];

  // Special case for the root element
  if (!structure.parent) {
    // if (structure.comment) {
    //   const spacesRequired = ' '.repeat(commentLoc - structure.name.length);

    //   return `${structure.name}${spacesRequired} // ${structure.comment}`;
    // }
    return options.rootDot ? structure.name : null;
  }

  const chunks = [
    isLastChild(structure) ? lines.LAST_CHILD : lines.CHILD,
    getName(structure, options),
  ];

  let current = structure.parent;
  while (current && current.parent) {
    chunks.unshift(isLastChild(current) ? lines.EMPTY : lines.DIRECTORY);
    current = current.parent;
  }

  // Join all the chunks together to create the final line.
  // If we're not rendering the root `.`, chop off the first 4 characters.
  const joined = chunks.join('').substring(options.rootDot ? 0 : lines.CHILD.length);

  if (structure.comment) {
    const spacesRequired = ' '.repeat(Math.max(0, commentLoc - joined.length));

    return `${joined}${spacesRequired}  // ${structure.comment}`;
  }

  return joined;
}

/**
 * Returns the name of a file or folder according to the
 * rules specified by the rendering rules
 * @param structure The file or folder to get the name of
 * @param options The rendering options
 */
const getName = (
  structure: FileStructure,
  options: GenerateTreeOptions,
): string => {
  const nameChunks = [structure.name];

  // Optionally append a trailing slash
  if (
    // if the trailing slash option is enabled
    options.trailingDirSlash &&
    // and if the item has at least one child
    structure.children.length > 0 &&
    // and if the item doesn't already have a trailing slash
    !/\/\s*$/.test(structure.name)
  ) {
    nameChunks.push('/');
  }

  // Optionally prefix the name with its full path
  if (options.fullPath && structure.parent && structure.parent) {
    nameChunks.unshift(
      getName(
        structure.parent,
        defaultsDeep({}, { trailingDirSlash: true }, options),
      ),
    );
  }

  return nameChunks.join('');
};

/**
 * A utility function do determine if a file or folder
 * is the last child of its parent
 * @param structure The file or folder to test
 */
const isLastChild = (structure: FileStructure): boolean =>
  Boolean(structure.parent && last(structure.parent.children) === structure);
