import { promises as fs } from 'fs';

import { BUILD_PATH } from '../constants';

import { getDbPath } from './buildUtils';

/**
 * Copy `modules.json` to the build folder
 */
export const copyModules = () => fs.copyFile('modules.json', `${BUILD_PATH}/modules.json`);

/**
 * Copy `database.json` to the build folder
 */
export const copyDatabase = () => fs.copyFile(getDbPath(), `${BUILD_PATH}/database.json`);

export default () => Promise.all([copyModules(), copyDatabase()]);
