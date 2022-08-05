import gulp, { series } from 'gulp';
import { getDbPath } from './utilities';

export const copyModules = () =>
  gulp.src('modules.json').pipe(gulp.dest('build/'));

export const copyDatabase = () =>
  gulp.src(getDbPath()).pipe(gulp.dest('build/'));

export default Object.assign(series(copyModules, copyDatabase), {
  displayName: 'copy',
});
