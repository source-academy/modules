import { Command } from 'commander';
import buildAllCommand from './build/index.js';
import watchCommand, { serveCommand } from './build/watchers/index.js';
import createCommand from './templates/index.js';
async function main() {
    const parser = new Command()
        .addCommand(watchCommand)
        .addCommand(buildAllCommand)
        .addCommand(createCommand)
        .addCommand(serveCommand);
    try {
        await parser.parseAsync();
    }
    catch (error) {
        console.error(error);
    }
}
main()
    .then(() => process.exit(0));
// Something is keeping the process alive after it should die
// but I haven't found how to close it so process.exit will have to do
