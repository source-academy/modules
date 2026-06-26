import pathlib from 'path';
import { Command } from '@commander-js/extra-typings';
import { Extractor, ExtractorConfig, type IConfigFile } from '@microsoft/api-extractor';
import { gitRoot, outDir } from '@sourceacademy/modules-repotools/getGitRoot';
import { resolveSingleBundle } from '@sourceacademy/modules-repotools/manifest';
import type { ResolvedBundle } from '@sourceacademy/modules-repotools/types';

function runApiExtractor(bundle: ResolvedBundle) {
  const config: IConfigFile = {
    projectFolder: bundle.directory,
    mainEntryPointFilePath: pathlib.join(bundle.directory, 'dist', 'index.d.ts'),
    dtsRollup: {
      enabled: true,
      untrimmedFilePath: pathlib.join(outDir, 'dts', `${bundle.name}.d.ts`)
    },
    apiReport: {
      enabled: true,
      reportFolder: pathlib.join(outDir, 'api-report', bundle.name)
    },
    docModel: {
      enabled: true,
      apiJsonFilePath: pathlib.join(bundle.directory, 'dist', 'docs.api.json'),
    },
    compiler: {
      tsconfigFilePath: pathlib.join(bundle.directory, 'tsconfig.json'),
    }
  };
  const extractorConfig = ExtractorConfig.prepare({
    configObjectFullPath: pathlib.resolve('./api-extractor.json'),
    configObject: config,
    packageJsonFullPath: pathlib.join(bundle.directory, 'package.json'),
  });

  const result = Extractor.invoke(extractorConfig, {
    typescriptCompilerFolder: pathlib.join(gitRoot, 'node_modules', 'typescript')
  });

  if (result.succeeded) {
    console.log('API-Extractor succeeded');
  } else {
    console.error('API-Extractor failed');
  }
}

await new Command()
  .argument('[bundle]', 'Directory in which the bundle\'s source files are located', process.cwd())
  .action(async bundleDir => {
    const result = await resolveSingleBundle(bundleDir);
    if (result === undefined) {
      console.error(`No bundle found at ${bundleDir}!`);
      return;
    } else if (result.severity === 'error') {
      console.error('Resolution error');
      // cmdUtils.logCommandErrorAndExit(result);
      return;
    }
    runApiExtractor(result.bundle);
  }).parseAsync();
