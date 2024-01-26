import { build as esbuild } from 'esbuild';
import fs from 'fs/promises';
import { outputBundle } from '../bundle';
import { esbuildOptions } from '../moduleUtils';

const testBundle = `
  import context from 'js-slang/context';

  export const foo = () => 'foo';
  export const bar = () => {
    context.moduleContexts.test0.state = 'bar';
  };
`

test('building a bundle', async () => {
  const { outputFiles } = await esbuild({
    ...esbuildOptions,
    stdin: {
      contents: testBundle,
    },
    outdir: '.',
    outbase: '.',
    external: ['js-slang*'],
  });

  const [{ text: compiledBundle }] = outputFiles!;

  const result = await outputBundle('test0', compiledBundle, 'build');
  expect(result).toMatchObject({
    fileSize: 10,
    severity: 'success',
  })

  expect(fs.stat)
    .toHaveBeenCalledWith('build/bundles/test0.js')

  expect(fs.writeFile)
    .toHaveBeenCalledTimes(1)

  const call = (fs.writeFile as jest.MockedFunction<typeof fs.writeFile>).mock.calls[0];

  expect(call[0]).toEqual('build/bundles/test0.js')
  const removeExports = (call[1] as string).slice("export default".length, -1);
  const bundleText = `(${removeExports})`;
  const mockContext = {
    moduleContexts: {
      test0: {
        state: null,
      }
    }
  }
  const bundleFuncs = eval(bundleText)(x => ({
    'js-slang/context': mockContext,
  }[x]));
  expect(bundleFuncs.foo()).toEqual('foo');
  expect(bundleFuncs.bar()).toEqual(undefined);
  expect(mockContext.moduleContexts).toMatchObject({
    test0: {
      state: 'bar',
    },
  });
});
