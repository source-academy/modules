// /* [Imports] */
import fs from 'fs';
import { JSONFile, Low } from 'lowdb';
import { join } from 'path';

import {
  DATABASE_NAME,
} from '../constants';
import { cjsDirname } from '../utilities';


// Function takes in relative paths, for cleaner logging
export function isFolderModified(relativeFolderPath: string, storedTimestamp: number) {
  function toFullPath(rootRelativePath: string) {
    return join(process.cwd(), rootRelativePath);
  }

  let fullFolderPath = toFullPath(relativeFolderPath);

  let contents = fs.readdirSync(fullFolderPath);
  for (let content of contents) {
    let relativeContentPath = join(relativeFolderPath, content);
    let fullContentPath = join(fullFolderPath, content);

    let stats = fs.statSync(fullContentPath);

    // If is folder, recurse. If found something modified, stop early
    if (
      stats.isDirectory()
      && isFolderModified(relativeContentPath, storedTimestamp)
    ) {
      return true;
    }

    // Is file. Compare timestamps to see if stop early
    if (stats.mtimeMs > storedTimestamp) {
      // console.log(chalk.grey(`• File modified: ${relativeContentPath}`));
      return true;
    }
  }

  return false;
}

/**
 * Get the path to the database file
 */
export function getDbPath() {
  return join(cjsDirname(import.meta.url), DATABASE_NAME);
}

export const checkForUnknowns = <T>(inputs: T[], existing: T[]) => inputs.filter((each) => !existing.includes(each));

const DBKeys = ['jsons', 'bundles', 'tabs'] as const;

type ObjectFromList<T extends ReadonlyArray<string>, V = string> = {
  [K in (T extends ReadonlyArray<infer U> ? U : never)]: V
};

export type DBData = {
  html: number;
} & ObjectFromList<typeof DBKeys, {
  [name: string]: number;
}>;

export type DBType = Low<DBData>;

export type EntriesWithReasons = {
  [name: string]: string;
};

export type BuildLog = {
  result: 'success' | 'error',
  name: string;
  fileSize?: number,
  elapsed?: number
  error?: any
};

export type BuildResult = {
  result: 'success' | 'error'
  logs: BuildLog[]
  error?: any;
};

/**
 * Get a new Lowdb instance
 */
export async function getDb() {
  const db = new Low(new JSONFile<DBData>(getDbPath()));
  await db.read();

  if (!db.data) {
    // Set default data if database.json is missing
    db.data = {
      html: 0,
      jsons: {},
      bundles: {},
      tabs: {},
    };
  }
  return db;
}

export function removeDuplicates<T>(arr: T[]) {
  return [...new Set<T>(arr)];
}
