import fs from 'fs/promises'
import * as td from 'typedoc'
import { bundlesOption } from '@src/commandUtils'
import { createBuildCommand, createBuildCommandHandler, type BuildInputs, type OperationResult } from '../utils'
import { initTypedoc } from './docsUtils'
import drawdown from './drawdown'

const typeToName = (type?: td.SomeType) => type.stringify(td.TypeContext.none)

const parsers = {
  [td.ReflectionKind.Function](obj) {
    // Functions should have only 1 signature
    const [signature] = obj.signatures

    let description: string
    if (signature.comment) {
      description = drawdown(signature.comment.summary.map(({ text }) => text)
        .join(''))
    } else {
      description = 'No description available'
    }

    const params = signature.parameters.map(({ type, name }) => [name, typeToName(type)] as [string, string])

    return {
      kind: 'function',
      name: obj.name,
      description,
      params,
      retType: typeToName(signature.type)
    }
  },
  [td.ReflectionKind.Variable](obj) {
    let description: string
    if (obj.comment) {
      description = drawdown(obj.comment.summary.map(({ text }) => text)
        .join(''))
    } else {
      description = 'No description available'
    }

    return {
      kind: 'variable',
      name: obj.name,
      description,
      type: typeToName(obj.type)
    }
  }
} satisfies Partial<Record<td.ReflectionKind, (element: td.DeclarationReflection) => any>>

async function buildJson(name: string, reflection: td.DeclarationReflection, outDir: string): Promise<OperationResult> {
  try {
    const jsonData = reflection.children.reduce((res, element) => {
      const parser = parsers[element.kind]
      return {
        ...res,
        [element.name]: parser
          ? parser(element)
          : { kind: 'unknown' }
      }
    }, {})

    await fs.writeFile(`${outDir}/jsons/${name}.json`, JSON.stringify(jsonData, null, 2))

    return {
      name,
      severity: 'success'
    }
  } catch (error) {
    return {
      name,
      severity: 'error',
      error
    }
  }
}

export async function buildJsons(
  { bundles }: BuildInputs,
  outDir: string,
  project: td.ProjectReflection
): Promise<Record<'jsons', OperationResult[]>> {
  await fs.mkdir(`${outDir}/jsons`, { recursive: true })

  if (bundles.length === 1) {
    const [bundle] = bundles
    const result = await buildJson(
      bundle,
      project as unknown as td.DeclarationReflection,
      outDir
    )

    return {
      jsons: [result]
    }
  }

  const results = await Promise.all(bundles.map(bundle => buildJson(
    bundle,
    project.getChildByName(bundle) as td.DeclarationReflection,
    outDir
  )))

  return {
    jsons: results
  }
}

const jsonCommandHandler = createBuildCommandHandler(async (inputs, { srcDir, outDir, verbose }) => {
  const [project] = await initTypedoc(inputs.bundles, srcDir, verbose)
  return buildJsons(inputs, outDir, project)
}, false)

export const getBuildJsonsCommand = () => createBuildCommand('jsons', 'Build json documentation')
  .addOption(bundlesOption)
  .action(opts => jsonCommandHandler({ ...opts, tabs: [] }))
