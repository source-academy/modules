import { promises as fs } from 'fs';
import { getDbPath } from './buildUtils';

/**
 * Copy `modules.json` to the build folder
 */
export const copyModules = () => fs.copyFile('modules.json', 'build/modules.json');

/**
 * Copy `database.json` to the build folder
 */
export const copyDatabase = () => fs.copyFile(getDbPath(), 'build/database.json');

export default () => Promise.all([copyModules(), copyDatabase()]);
