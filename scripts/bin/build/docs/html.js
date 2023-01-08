import chalk from 'chalk';
import { Command } from 'commander';
import { divideAndRound, wrapWithTimer } from '../buildUtils';
import { initTypedoc, logTypedocTime } from './docUtils';
/**
 * Build HTML documentation
 */
export const buildHtml = wrapWithTimer(async (app, project, buildOpts) => {
    if (buildOpts.modulesSpecified) {
        return {
            severity: 'warn',
        };
    }
    try {
        await app.generateDocs(project, `${buildOpts.outDir}/documentation`);
        return {
            severity: 'success',
        };
    }
    catch (error) {
        return {
            severity: 'error',
            error,
        };
    }
});
/**
 * Log output from `buildHtml`
 * @see {buildHtml}
 */
export const logHtmlResult = ({ elapsed, result: { severity, error } }) => {
    if (severity === 'success') {
        const timeStr = divideAndRound(elapsed, 1000, 2);
        console.log(`${chalk.cyanBright('HTML documentation built')} ${chalk.greenBright('successfully')} in ${timeStr}s\n`);
    }
    else if (severity === 'warn') {
        console.log(chalk.yellowBright('-m was specified, not building HTML documentation\n'));
    }
    else {
        console.log(`${chalk.cyanBright('HTML documentation')} ${chalk.redBright('failed')}: ${error}\n`);
    }
};
/**
 * CLI command to only build HTML documentation
 */
const buildHtmlCommand = new Command('html')
    .option('--outDir <outdir>', 'Output directory', 'build')
    .option('--srcDir <srcdir>', 'Source directory for files', 'src')
    .description('Build only HTML documentation')
    .action(async (buildOpts) => {
    const { elapsed: typedoctime, result: [app, project] } = await initTypedoc(buildOpts);
    logTypedocTime(typedoctime);
    const htmlResult = await buildHtml(app, project, buildOpts);
    logHtmlResult(htmlResult);
});
export default buildHtmlCommand;
