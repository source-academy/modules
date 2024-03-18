import { build as esbuild } from 'esbuild';
import fs from 'fs/promises';
import { outputBundle } from '../commons';
import { commonEsbuildOptions } from '../commons';

const testBundle = `
  import context from 'js-slang/context';

  export const foo = () => 'foo';
  export const bar = () => {
    context.moduleContexts.test0.state = 'bar';
  };
`

test('building a bundle', async () => {
	const { outputFiles: [file] } = await esbuild({
		...commonEsbuildOptions,
		stdin: {
			contents: testBundle
		},
		outdir: '.',
		outbase: '.',
		external: ['js-slang*']
	});


	const result = await outputBundle(file, 'build');
	expect(result.severity)
		.toEqual('success')

	expect(fs.writeFile)
		.toHaveBeenCalledTimes(1)

	const call = (fs.writeFile as jest.MockedFunction<typeof fs.writeFile>).mock.calls[0];

	expect(call[0])
		.toEqual('build/bundles/test0.js')
	const bundleText = `(${call[1]})`;
	const mockContext = {
		moduleContexts: {
			test0: {
				state: null
			}
		}
	}
	const bundleFuncs = eval(bundleText)((x) => ({
		'js-slang/context': mockContext
	}[x]));
	expect(bundleFuncs.foo())
		.toEqual('foo');
	expect(bundleFuncs.bar())
		.toEqual(undefined);
	expect(mockContext.moduleContexts)
		.toMatchObject({
			test0: {
				state: 'bar'
			}
		});
});
