import gulp, { series } from 'gulp';
import { getDbPath } from './utilities';

/**
 * Copy `modules.json` to the build folder
 */
export const copyModules = () =>
  gulp.src('modules.json').pipe(gulp.dest('build/'));

/**
 * Copy `database.json` to the build folder
 */
export const copyDatabase = () =>
  gulp.src(getDbPath()).pipe(gulp.dest('build/'));

export default Object.assign(series(copyModules, copyDatabase), {
  displayName: 'copy',
});
