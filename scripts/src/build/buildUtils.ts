import { Command } from 'commander';

import { retrieveManifest } from '../scriptUtils';

import type { Severity } from './types';

export const wrapWithTimer = <T extends (...params: any[]) => Promise<any>>(func: T) => async (...params: Parameters<T>): Promise<{
  elapsed: number,
  result: Awaited<ReturnType<T>>
}> => {
  const startTime = performance.now();
  const result = await func(...params);
  const endTime = performance.now();

  return {
    elapsed: endTime - startTime,
    result,
  };
};

export const divideAndRound = (dividend: number, divisor: number, round: number) => (dividend / divisor).toFixed(round);

export const findSeverity = <T>(items: T[], processor: (each: T) => Severity): Severity => {
  let severity: Severity = 'success';

  for (const item of items) {
    const itemSev = processor(item);
    if (itemSev === 'error') return 'error';
    if (itemSev === 'warn' && severity === 'success') severity = 'warn';
  }

  return severity;
};

export const fileSizeFormatter = (size: number) => {
  size /= 1000;
  if (size < 0.01) return '<0.01 KB';
  if (size >= 100) return `${divideAndRound(size, 1000, 2)} MB`;
  return `${size.toFixed(2)} KB`;
};

type CommandHandler = (buildOpts: BuildOptions) => Promise<void>;
type BuildCommandOptions = {
  srcDir: string;
  outDir: string;
  manifest: string;
  modules?: string[];
};
export const createBuildCommand = (name: string, handler?: CommandHandler) => {
  const cmd = new Command(name)
    .option('--outDir <outdir>', 'Output directory', 'build')
    .option('--srcDir <srcdir>', 'Source directory for files', 'src')
    .option('--manifest <file>', 'Manifest file', 'modules.json')
    .option('-m, --modules <modules...>', 'Manually specify which modules to build');
  if (handler) {
    return cmd.action(async (opts: BuildCommandOptions) => {
      const manifest = await retrieveManifest(opts.manifest);

      let bundles: string[] = Object.keys(manifest);
      let modulesSpecified = false;
      if (opts.modules) {
        const undefineds = opts.modules.filter((m) => !bundles.includes(m));

        if (undefineds.length > 0) {
          throw new Error(`Unknown modules: ${undefineds.join(', ')}`);
        }

        bundles = opts.modules;
        modulesSpecified = true;
      }

      const tabs = bundles
        .flatMap((x) => manifest[x].tabs);

      await handler({
        srcDir: opts.srcDir,
        outDir: opts.outDir,
        bundles,
        manifest: opts.manifest,
        tabs,
        modulesSpecified,
      });
    });
  }
  return cmd;
};

export type BuildOptions = {
  srcDir: string;
  outDir: string;
  manifest: string;

  modulesSpecified: boolean;
  bundles: string[];
  tabs: string[];
};
