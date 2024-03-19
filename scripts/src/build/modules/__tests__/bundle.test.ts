import { build as esbuild } from 'esbuild';
import { commonEsbuildOptions, outputBundleOrTab } from '../commons';
import { mockStream } from './streamMocker';

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

	const rawBundleTextPromise = mockStream()

	const result = await outputBundleOrTab(file, 'build');
	expect(result.severity)
		.toEqual('success')

	const bundleText = (await rawBundleTextPromise).slice('export default'.length)
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
