import { Command } from 'commander';
import watchCommand, { serveCommand } from './build/watchers';
import buildAllCommand from './build';
import createCommand from './templates';
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
