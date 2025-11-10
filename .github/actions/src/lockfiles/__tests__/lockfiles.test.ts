import type fs from 'fs/promises';
import type pathlib from 'path';
import * as exec from '@actions/exec';
import { describe, expect, it, vi } from 'vitest';
import * as utils from '../utils.js';

vi.mock(import('../../gitRoot.js'), () => ({
  gitRoot: 'root'
}));

const mockedExec = vi.spyOn(exec, 'getExecOutput');

describe(utils.extractPackageName, () => {
  it('works with packages that start with @', () => {
    expect(utils.extractPackageName('@sourceacademy/tab-Rune@workspace:^'))
      .toEqual('@sourceacademy/tab-Rune');
  });

  it('works with regular package names', () => {
    expect(utils.extractPackageName('lodash@npm:^4.17.20'))
      .toEqual('lodash');
  });

  it('throws an error on an invalid package name', () => {
    expect(() => utils.extractPackageName('something weird'))
      .toThrowError('Invalid package name: something weird');
  });
});

describe(utils.getPackageReason, async () => {
  const { join }: typeof pathlib = await vi.importActual('path');
  const { readFile }: typeof fs = await vi.importActual('fs/promises');

  const textPath = join(import.meta.dirname, 'sample_why.txt');
  const sampleText = await readFile(textPath, 'utf-8');

  it('works', async () => {
    mockedExec.mockResolvedValueOnce({
      stdout: sampleText,
      stderr: '',
      exitCode: 0
    });

    const retValue = await utils.getPackageReason('lodash');
    expect(retValue).toMatchInlineSnapshot(`
      [
        "@sourceacademy/bundle-ar",
        "@sourceacademy/bundle-arcade_2d",
        "@sourceacademy/bundle-binary_tree",
        "@sourceacademy/bundle-communication",
        "@sourceacademy/bundle-copy_gc",
        "@sourceacademy/bundle-csg",
        "@sourceacademy/bundle-curve",
        "@sourceacademy/bundle-game",
        "@sourceacademy/bundle-mark_sweep",
        "@sourceacademy/bundle-midi",
        "@sourceacademy/bundle-nbody",
        "@sourceacademy/bundle-painter",
        "@sourceacademy/bundle-physics_2d",
        "@sourceacademy/bundle-pix_n_flix",
        "@sourceacademy/bundle-plotly",
        "@sourceacademy/bundle-remote_execution",
        "@sourceacademy/bundle-repeat",
        "@sourceacademy/bundle-repl",
        "@sourceacademy/bundle-robot_simulation",
        "@sourceacademy/bundle-rune",
        "@sourceacademy/bundle-rune_in_words",
        "@sourceacademy/bundle-scrabble",
        "@sourceacademy/bundle-sound",
        "@sourceacademy/bundle-sound_matrix",
        "@sourceacademy/bundle-stereo_sound",
        "@sourceacademy/bundle-unittest",
        "@sourceacademy/bundle-unity_academy",
        "@sourceacademy/bundle-wasm",
        "@sourceacademy/lint-plugin",
        "@sourceacademy/markdown-plugin-directory-tree",
        "@sourceacademy/modules-buildtools",
        "@sourceacademy/modules-devserver",
        "@sourceacademy/modules-docserver",
        "@sourceacademy/modules-github-actions",
        "@sourceacademy/modules-lib",
        "@sourceacademy/modules-repotools",
        "@sourceacademy/modules",
        "@sourceacademy/tab-ArcadeTwod",
        "@sourceacademy/tab-AugmentedReality",
        "@sourceacademy/tab-CopyGc",
        "@sourceacademy/tab-Csg",
        "@sourceacademy/tab-Curve",
        "@sourceacademy/tab-Game",
        "@sourceacademy/tab-MarkSweep",
        "@sourceacademy/tab-Nbody",
        "@sourceacademy/tab-Painter",
        "@sourceacademy/tab-Physics2D",
        "@sourceacademy/tab-Pixnflix",
        "@sourceacademy/tab-Plotly",
        "@sourceacademy/tab-Repeat",
        "@sourceacademy/tab-Repl",
        "@sourceacademy/tab-RobotSimulation",
        "@sourceacademy/tab-Rune",
        "@sourceacademy/tab-Sound",
        "@sourceacademy/tab-SoundMatrix",
        "@sourceacademy/tab-StereoSound",
        "@sourceacademy/tab-Unittest",
        "@sourceacademy/tab-UnityAcademy",
      ]
    `);
    expect(mockedExec).toHaveBeenCalledOnce();
  });
});
