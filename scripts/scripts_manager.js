import { Command } from '@commander-js/extra-typings'
import { build as esbuild } from 'esbuild'
import jest from 'jest'
import _ from 'lodash'
import pathlib from 'path'
import { pathsToModuleNameMapper } from 'ts-jest'
import { fileURLToPath } from 'url'
import tsconfig from './tsconfig.json' with { type: 'json' }

function cjsDirname(url) {
  return pathlib.join(pathlib.dirname(fileURLToPath(url)))
}

async function buildScripts({ dev }) {
  const dirname = cjsDirname(import.meta.url)

  await esbuild({
    bundle: true,
    entryPoints: [pathlib.join(dirname, 'src', 'index.ts')],
    format: 'esm',
    logLevel: 'warning',
    minify: !dev,
    outfile: pathlib.join(dirname, 'bin.js'),
    packages: 'external',
    platform: 'node',
    treeShaking: true,
    tsconfig: pathlib.join(dirname, 'tsconfig.json'),
    plugins: [{
      name: 'Paths to module name translator',
      setup(pluginBuild) {
        const replacements = pathsToModuleNameMapper(tsconfig.compilerOptions.paths)
        Object.entries(replacements).forEach(([key, value]) => {
          const filter = new RegExp(key, 'gm')
          
          pluginBuild.onResolve({ filter }, args => {
            const newPath = args.path.replace(filter, value)
            return pluginBuild.resolve(
              newPath,
              {
                kind: args.kind,
                resolveDir: dirname,
              },
            )
          })
        })
      }
    }]
  })
}

const buildCommand = new Command('build')
  .description('Build scripts')
  .option('--dev', 'Use for script development builds')
  .action(buildScripts)

/**
 * Run Jest programmatically
 * @param {string[]} patterns 
 * @returns {Promise<void>}
 */
function runJest(patterns) {
  const [args, filePatterns] = _.partition(patterns ?? [], (arg) => arg.startsWith('-'));

  // command.args automatically includes the source directory option
  // which is not supported by Jest, so we need to remove it
  const toRemove = args.findIndex((arg) => arg.startsWith('--srcDir'));
  if (toRemove !== -1) {
    args.splice(toRemove, 1);
  }

  const jestArgs = args.concat(filePatterns.map((pattern) => pattern.split(pathlib.win32.sep)
    .join(pathlib.posix.sep)));

  return jest.run(jestArgs, './scripts/jest.config.js')
}

const testCommand = new Command('test')
  .description('Run tests for script files')
  .allowUnknownOption()
  .action((_, command) => runJest(command.args))

await new Command()
  .addCommand(buildCommand)
  .addCommand(testCommand)
  .parseAsync()