export interface DirectoryTreePluginOptions {
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

export interface FileStructure {
  /** The name of the file or folder */
  name: string;

  comment?: string;

  /** If a folder, the contents of the folder */
  children: FileStructure[];

  /** The parent directory of this file or folder */
  parent: FileStructure | null;
}

export interface YamlObject {
  name: string;
  children?: (string | YamlObject)[];
  comment?: string;
}

export interface RootYamlObject extends YamlObject {
  path?: string;
}

export function isYamlObject(obj: unknown, ignoreName?: boolean): obj is YamlObject {
  if (typeof obj !== 'object' || obj === null) return false;

  if ('children' in obj) {
    if (!Array.isArray(obj.children)) return false;

    const invalidEntry = obj.children.some(value => {
      if (typeof value === 'string' || isYamlObject(value)) return false;
      return true;
    });

    if (invalidEntry) return false;
  }

  if ('comment' in obj && typeof obj.comment !== 'string') return false;
  if (!ignoreName) {
    if (!('name' in obj) || typeof obj.name !== 'string') return false;
  }

  return true;
}

export function isRootYamlObject(obj: unknown): obj is RootYamlObject {
  if (!isYamlObject(obj, true)) return false;
  return !('path' in obj) || typeof obj.path === 'string';
}
