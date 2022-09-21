import chalk from 'chalk';
import { Command } from 'commander';
import { promises as fsPromises } from 'fs';

import { BUILD_PATH, SOURCE_PATH } from '../../constants';
import { cjsDirname, modules as manifest, wrapWithTimer } from '../../utilities';
import { DBType, getDb, isFolderModified } from '../buildUtils';
import copy from '../misc';

import { DocsProject, initTypedoc } from './utils';

type HtmlResult = {
  result: 'error' | 'success'
  error?: any
};

type HtmlOpts = {
  force?: boolean;
  html?: boolean;
};

export const shouldBuildHtml = async (db: DBType, opts: HtmlOpts): Promise<[boolean, string]> => {
  if (opts.force) return [true, '--force specified'];

  if (Object.keys(manifest)
    .find((moduleName) => isFolderModified(`${SOURCE_PATH}/bundles/${moduleName}`, db.data.html))) {
    return opts.html ? [true, 'Modified bundles present'] : [false, '--no-html specified'];
  }

  try {
    const dir = await fsPromises.readdir(`${BUILD_PATH}/documentation`);
    if (dir.length === 0) return [true, 'HTML Build directory empty'];
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return [true, 'HTML Build directory missing'];
  }

  return [false, 'HTML Documentation rebuild not required'];
};

export const logHtmlStart = ([shouldBuild, reason]: [boolean, string], verbose?: boolean) => {
  if (verbose) {
    if (shouldBuild) {
      return [`${chalk.cyanBright('Building HTML Documentation:')} ${reason}`];
    }
    return [`${chalk.yellowBright('Not building HTML documentation:')} ${reason}`];
  }

  if (shouldBuild) {
    return [chalk.cyanBright('Building HTML Documentation')];
  }
  return [chalk.yellowBright('Not building HTML documentation')];
};

export const buildHtml = wrapWithTimer(async (db: DBType, { buildTime, app, project }: DocsProject): Promise<HtmlResult> => {
  try {
    await app.generateDocs(project, `${BUILD_PATH}/documentation`);

    // For some reason typedoc's not working, so do a manual copy
    await fsPromises.copyFile(
      `${cjsDirname(import.meta.url)}/README.md`,
      `${BUILD_PATH}/documentation/README.md`,
    );
    db.data.html = buildTime;
    return {
      result: 'success',
    };
  } catch (error) {
    return {
      result: 'error',
      error,
    };
  }
});

export const logHtmlResult = ({ result: { result, error }, elapsed }: { elapsed: number, result: HtmlResult }) => {
  if (result === 'error') {
    return [chalk.cyanBright(`${chalk.cyanBright('HTML Documentation build')} ${chalk.redBright('failed')}: ${error}`)];
  }
  return [chalk.cyanBright(`${chalk.cyanBright('HTML Documentation built')} ${chalk.greenBright('successfully')} in ${(elapsed / 1000).toFixed(2)}s`)];
};

export const htmlCommand = new Command('html')
  .option('-v, --verbose')
  .option('-f, --force')
  .description('Build only HTML documentation')
  .action(async (opts) => {
    const db = await getDb();
    const [shouldBuild, reason] = await shouldBuildHtml(db, opts);
    console.log(logHtmlStart([shouldBuild, reason], opts.verbose)
      .join('\n'));

    const project = initTypedoc();
    const result = await buildHtml(db, project);

    console.log(logHtmlResult(result)
      .join('\n'));
    await db.write();
    await copy();
  });
