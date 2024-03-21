import fs from 'fs/promises';
import * as td from 'typedoc';
import { createBuildCommand, createBuildCommandHandler, type OperationResult } from '../utils';
import drawdown from './drawdown';
import { initTypedoc } from './docsUtils';

const typeToName = (type?: td.SomeType, alt: string = 'unknown') => (type ? (type as td.ReferenceType | td.IntrinsicType).name : alt);

const parsers = {
	[td.ReflectionKind.Function](obj) {
		// Functions should have only 1 signature
		const [signature] = obj.signatures;

		let description: string;
		if (signature.comment) {
			description = drawdown(signature.comment.summary.map(({ text }) => text)
				.join(''));
		} else {
			description = 'No description available';
		}

		const params = signature.parameters.reduce((res, { type, name }) => ({
			...res,
			[name]: typeToName(type)
		}), {});

		return {
			kind: 'function',
			name: obj.name,
			description,
			params,
			retType: typeToName(signature.type, 'void')
		};
	},
	[td.ReflectionKind.Variable](obj) {
		let description: string;
		if (obj.comment) {
			description = drawdown(obj.comment.summary.map(({ text }) => text)
				.join(''));
		} else {
			description = 'No description available';
		}

		return {
			kind: 'variable',
			name: obj.name,
			description,
			type: typeToName(obj.type)
		};
	}
} satisfies Partial<Record<td.ReflectionKind, (element: td.DeclarationReflection) => any>>;

async function buildJson(name: string, reflection: td.DeclarationReflection, outDir: string): Promise<OperationResult> {
	try {
		const jsonData = reflection.children.reduce((res, element) => {
			const parser = parsers[element.kind];
			return {
				...res,
				[element.name]: parser
					? parser(element)
					: { kind: 'unknown' }
			};
		}, {});

		await fs.writeFile(`${outDir}/jsons/${name}.json`, JSON.stringify(jsonData, null, 2));

		return {
			name,
			severity: 'success'
		}
	} catch (error) {
		return {
			name,
			severity: 'error',
			error
		};
	}
}

export async function buildJsons(
	bundles: string[],
	outDir: string,
	project: td.ProjectReflection
): Promise<Record<'jsons', OperationResult[]>> {
	await fs.mkdir(`${outDir}/jsons`, { recursive: true })

	if (bundles.length === 1) {
		const [bundle] = bundles;
		const result = await buildJson(
			bundle,
      project as unknown as td.DeclarationReflection,
      outDir
		);

		return {
			jsons: [result]
		}
	}

	const results = await Promise.all(bundles.map((bundle) => buildJson(
		bundle,
    project.getChildByName(bundle) as td.DeclarationReflection,
    outDir
	)));

	return {
		jsons: results
	}
}

const jsonCommandHandler = createBuildCommandHandler(async ({ bundles }, { srcDir, outDir, verbose }) => {
	const [project] = await initTypedoc(bundles, srcDir, verbose)
	return buildJsons(bundles, outDir, project)
})

export const getBuildJsonsCommand = () => createBuildCommand('jsons', 'Build json documentation')
	.argument('[bundles...]')
	.action((bundles, opts) => jsonCommandHandler({
		bundles,
		tabs: []
	}, opts))
