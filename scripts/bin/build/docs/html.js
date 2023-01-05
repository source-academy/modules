import chalk from 'chalk';
import { divideAndRound, wrapWithTimer } from '../buildUtils';
export default wrapWithTimer(async (app, project, buildOpts) => {
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
