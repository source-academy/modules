import fs from 'fs';
import pathlib from 'path';
import { parseDocument } from 'yaml';
import { generateTree } from './tree';
import { isRootYamlObject, type DirectoryTreePluginOptions, type FileStructure, type RootYamlObject, type YamlObject } from './types';

export function parseContent(content: string, docdir: string, options: DirectoryTreePluginOptions = {}): [string, string[]] {
  const yamlNode = parseDocument(content);

  if (yamlNode.errors.length > 0) {
    console.error('[Markdown Tree Plugin] Errors ocurred while parsing the YAML');
    return [yamlNode.errors.map(each => `${each}`).join('\n'), []];
  } else {
    const document = yamlNode.toJS();

    if (isRootYamlObject(document)) {
      const filepath = document.path;
      const srcDir = filepath === undefined ? undefined : pathlib.join(docdir, filepath);
      const [structure, commentLoc, warnings] = generateStructure(document, srcDir);

      return [generateTree(structure, commentLoc, options), warnings];
    }
    return [content, []];
  }
}

/**
 * Generates the directory structure from the provided YAML object
 * @param validatePath If provided, the function will try to verify that the YAML object
 * provided follows the directory structure of the directory at the given path.
 */

export function generateStructure(rootObj: RootYamlObject, validatePath?: string): [FileStructure, number, string[]] {
  const rootName = rootObj.name ?? (validatePath !== undefined ? pathlib.basename(validatePath) : 'root');

  const root: FileStructure = {
    name: rootName,
    parent: null,
    comment: rootObj.comment,
    children: []
  };

  /**
   * Recurse through the YAML object and convert it to the file structure
   * @param level The current level of nesting
   * @returns A tuple consisting of a {@see FileStructure} and a number representing index of the longest line
   * that will be displayed in the tree diagram that will allow us to position comments.
   */
  function recurser(
    name: string,
    parent: FileStructure,
    obj: YamlObject,
    level: number,
    validatePath?: string
  ): [FileStructure[], number, string[]] {
    let exists = true;
    const warnings: string[] = [];

    if (validatePath !== undefined && !fs.existsSync(validatePath)) {
      warnings.push(`[Markdown Tree Plugin 1] Could not locate ${validatePath}`);
      exists = false;
    }

    const currentCommentLoc = level * 4 + name.length;

    if (obj.children) {
      if (exists && validatePath !== undefined && !fs.statSync(validatePath).isDirectory()) {
        warnings.push(`${validatePath} is not a directory!`);
      }

      return obj.children.reduce<[FileStructure[], number, string[]]>(([children, max, otherWarnings], value): [FileStructure[], number, string[]] => {
        if (typeof value === 'string') {
          const warnings: string[] = [];
          value = value.trim();

          if (validatePath !== undefined && exists) {
            const joinedPath = pathlib.join(validatePath, value);
            if (!fs.existsSync(joinedPath)) {
              warnings.push(`[Markdown Tree Plugin 3] Could not locate ${joinedPath}`);
            }
          }
          const entryCommentLoc = value.length + (level + 1) * 4;

          return [
            [
              ...children,
              {
                name: value,
                parent,
                children: []
              }
            ],
            Math.max(max, entryCommentLoc),
            [
              ...otherWarnings,
              ...warnings
            ],
          ];
        } else {
          const childName = value.name.trim();
          const structure: FileStructure = {
            name: childName,
            comment: value.comment,
            parent,
            children: []
          };

          const [newChildren, possibleCommentLoc, warnings] = recurser(
            childName,
            structure,
            value,
            level + 1,
            validatePath !== undefined ? pathlib.join(validatePath, childName) : undefined
          );
          structure.children = newChildren;

          return [
            [...children, structure],
            Math.max(possibleCommentLoc, max),
            [
              ...otherWarnings,
              ...warnings
            ]
          ];
        }
      }, [[], currentCommentLoc, []]);
    } else {
      return [[], currentCommentLoc, []];
    }
  }

  const [children, max, warnings] = recurser(rootName, root, rootObj, 0, validatePath);
  root.children = children;

  return [root, max, warnings];
}
