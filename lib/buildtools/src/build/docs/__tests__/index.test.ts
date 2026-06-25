import fs from 'fs/promises';
import pathlib from 'path';
import { bundlesDir, outDir } from '@sourceacademy/modules-repotools/getGitRoot';
import type { ResolvedBundle } from '@sourceacademy/modules-repotools/types';
import * as td from 'typedoc';
import { describe, expect, test, vi } from 'vitest';
import { expectError, expectSuccess } from '../../../__tests__/fixtures.js';
import { buildHtml, buildSingleBundleDocs } from '../index.js';
import * as init from '../typedoc.js';

const mockBundle: ResolvedBundle = {
  type: 'bundle',
  name: 'test0',
  directory: `${bundlesDir}/test0`,
  manifest: {}
};

describe(buildSingleBundleDocs, () => {
  const mockedJsonInit = vi.spyOn(init, 'initTypedocForJson');
  test('Project conversion failure', async () => {
    const mockGenerateOutputs = vi.fn(() => Promise.resolve());

    mockedJsonInit.mockResolvedValueOnce({
      convert: () => Promise.resolve(undefined),
      validate: () => Promise.resolve(undefined),
      generateOutputs: mockGenerateOutputs
    } as any);

    const result = await buildSingleBundleDocs(mockBundle, outDir, td.LogLevel.None);
    expectError(result.severity);
    expect(result.errors.length).toEqual(1);
    expect(result.errors[0]).toEqual('Failed to generate reflection for test0, check that the bundle has no type errors!');

    expect(fs.mkdir).not.toHaveBeenCalled();
    expect(mockGenerateOutputs).not.toHaveBeenCalled();
  });

  test('Project conversion success', async () => {
    const mockGenerateOutputs = vi.fn(() => Promise.resolve());
    const project = new td.DeclarationReflection('test0', td.ReflectionKind.Module);
    project.children = [];

    mockedJsonInit.mockResolvedValueOnce({
      convert: () => Promise.resolve(project),
      validate: () => Promise.resolve(undefined),
      generateOutputs: mockGenerateOutputs,
      logger: {
        hasErrors: () => false
      }
    } as any);

    const result = await buildSingleBundleDocs(mockBundle, outDir, td.LogLevel.None);
    expectSuccess(result.severity);
    expect(mockGenerateOutputs).toHaveBeenCalledOnce();
    expect(fs.mkdir).toHaveBeenCalledExactlyOnceWith(pathlib.join(outDir, 'jsons'), { recursive: true });
  });
});

describe(buildHtml, () => {
  const mockedHtmlInit = vi.spyOn(init, 'initTypedocForHtml');
  const mockedFsStat = vi.spyOn(fs, 'stat');

  const bundles: Record<string, ResolvedBundle> = {
    test0: mockBundle,
    test1: {
      type: 'bundle',
      directory: pathlib.join(bundlesDir, 'test1'),
      manifest: {},
      name: 'test1'
    }
  };

  test('Regular generation of HTML docs', async () => {
    mockedFsStat.mockResolvedValue({
      isFile: () => true
    } as any);

    const project = new td.DeclarationReflection('tests', td.ReflectionKind.Module);
    project.children = [];

    const generateDocs = vi.fn(() => Promise.resolve());

    mockedHtmlInit.mockResolvedValueOnce({
      convert: () => Promise.resolve(project),
      generateDocs,
      logger: {
        hasErrors: () => false
      }
    } as any);

    const result = await buildHtml(bundles, outDir, td.LogLevel.None);
    expectSuccess(result.severity);
    expect(result.path).toEqual(pathlib.join(outDir, 'documentation'));
    expect(generateDocs).toHaveBeenCalledExactlyOnceWith(project, pathlib.join(outDir, 'documentation'));
  });

  test('Generation of HTML when not all bundles have been generated', async () => {
    mockedFsStat.mockImplementation(p => {
      const relpath = pathlib.relative(bundlesDir, p as string);
      const args = relpath.split(pathlib.sep);

      if (args[0] === 'test0') {
        return Promise.resolve({
          isFile: () => true
        } as any);
      } else {
        throw new Error();
      }
    });

    const mockedApp = {
      convert: vi.fn(),
      generateDocs: vi.fn()
    };

    mockedHtmlInit.mockResolvedValueOnce(mockedApp as any);

    const result = await buildHtml(bundles, outDir, td.LogLevel.None);
    expectError(result.severity);
    expect(result.errors.length).toEqual(1);
    expect(result.errors[0]).toEqual('Could not find documentation for test1');

    expect(mockedApp.convert).not.toHaveBeenCalled();
    expect(mockedApp.generateDocs).not.toHaveBeenCalled();
  });
});
