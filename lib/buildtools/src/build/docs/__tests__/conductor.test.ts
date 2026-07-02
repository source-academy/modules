import pathlib from 'path';
import type { ResolvedBundle } from '@sourceacademy/modules-repotools/types';
import * as td from 'typedoc';
import { describe, expect, it, vi } from 'vitest';
import { normalizeConductorDocs, normalizeConductorType } from '../conductor/index.js';
import { initTypedocForJson } from '../typedoc.js';

vi.setConfig({
  testTimeout: 10000
});

function createProject() {
  return new td.ProjectReflection('test', new td.FileRegistry());
}

function register<T extends td.Reflection>(project: td.ProjectReflection, reflection: T) {
  project.registerReflection(reflection, undefined, undefined);
  return reflection;
}

function conductorReference(project: td.ProjectReflection, name: string, qualifiedName = name) {
  const reference = td.ReferenceType.createBrokenReference(name, project, '@sourceacademy/conductor');
  reference.qualifiedName = qualifiedName;
  return reference;
}

function dataType(project: td.ProjectReflection, name: string) {
  return conductorReference(project, name, `DataType.${name}`);
}

function typedValue(project: td.ProjectReflection, typeName: string) {
  const reference = conductorReference(project, 'ITypedValue');
  reference.typeArguments = [dataType(project, typeName)];
  return reference;
}

function asyncGenerator(project: td.ProjectReflection, returnType: td.SomeType) {
  const reference = td.ReferenceType.createBrokenReference('AsyncGenerator', project, 'typescript');
  reference.typeArguments = [
    new td.IntrinsicType('void'),
    returnType,
    new td.UnknownType('unknown')
  ];
  return reference;
}

function createParameter(
  project: td.ProjectReflection,
  signature: td.SignatureReflection,
  name: string,
  type: td.SomeType
) {
  const parameter = register(
    project,
    new td.ParameterReflection(name, td.ReflectionKind.Parameter, signature)
  );
  parameter.type = type;
  return parameter;
}

function addExportedNames(
  project: td.ProjectReflection,
  plugin: td.DeclarationReflection,
  names: string[]
) {
  const exportedNames = register(
    project,
    new td.DeclarationReflection('exportedNames', td.ReflectionKind.Property, plugin)
  );
  plugin.addChild(exportedNames);
  exportedNames.type = new td.TypeOperatorType(
    new td.TupleType(names.map(name => new td.LiteralType(name))),
    'readonly'
  );
  return exportedNames;
}

describe(normalizeConductorType, () => {
  it('maps TypedValue numbers to native numbers', () => {
    const project = createProject();
    const normalized = normalizeConductorType(typedValue(project, 'NUMBER'), project);

    expect(normalized.stringify(td.TypeContext.none)).toEqual('number');
  });

  it('maps closures to Function', () => {
    const project = createProject();
    const normalized = normalizeConductorType(typedValue(project, 'CLOSURE'), project);

    expect(normalized.stringify(td.TypeContext.none)).toEqual('Function');
  });

  it('unwraps AsyncGenerator return values', () => {
    const project = createProject();
    const normalized = normalizeConductorType(
      asyncGenerator(project, typedValue(project, 'NUMBER')),
      project
    );

    expect(normalized.stringify(td.TypeContext.none)).toEqual('number');
  });

  it('leaves native types unchanged', () => {
    const project = createProject();
    const nativeType = new td.ArrayType(new td.IntrinsicType('string'));
    const normalized = normalizeConductorType(nativeType, project);

    expect(normalized.stringify(td.TypeContext.none)).toEqual('string[]');
  });
});

describe(normalizeConductorDocs, () => {
  it('promotes plugin methods and removes Conductor implementation details', () => {
    const project = createProject();

    const implementation = register(
      project,
      new td.DeclarationReflection('repeat', td.ReflectionKind.Function, project)
    );
    project.addChild(implementation);

    const implementationSignature = register(
      project,
      new td.SignatureReflection('repeat', td.ReflectionKind.CallSignature, implementation)
    );
    implementation.signatures = [implementationSignature];
    implementationSignature.comment = new td.Comment([
      { kind: 'text', text: 'Returns a repeated function.' }
    ]);
    implementationSignature.parameters = [
      createParameter(project, implementationSignature, 'evaluator', conductorReference(project, 'IDataHandler')),
      createParameter(project, implementationSignature, 'func', typedValue(project, 'CLOSURE')),
      createParameter(project, implementationSignature, 'n', typedValue(project, 'NUMBER'))
    ];
    implementationSignature.type = asyncGenerator(project, typedValue(project, 'CLOSURE'));

    const plugin = register(
      project,
      new td.DeclarationReflection('default', td.ReflectionKind.Class, project)
    );
    project.addChild(plugin);
    plugin.extendedTypes = [
      conductorReference(project, 'RenamedModulePluginBase')
    ];

    addExportedNames(project, plugin, ['repeat']);

    const method = register(
      project,
      new td.DeclarationReflection('repeat', td.ReflectionKind.Method, plugin)
    );
    plugin.addChild(method);

    const methodSignature = register(
      project,
      new td.SignatureReflection('repeat', td.ReflectionKind.CallSignature, method)
    );
    method.signatures = [methodSignature];
    methodSignature.parameters = [
      createParameter(project, methodSignature, 'func', typedValue(project, 'CLOSURE')),
      createParameter(project, methodSignature, 'n', typedValue(project, 'NUMBER'))
    ];
    methodSignature.type = asyncGenerator(project, typedValue(project, 'CLOSURE'));

    const classesGroup = new td.ReflectionGroup('Classes', project);
    classesGroup.children = [plugin];
    const functionsGroup = new td.ReflectionGroup('Functions', project);
    functionsGroup.children = [implementation];
    project.groups = [classesGroup, functionsGroup];

    normalizeConductorDocs(project);

    expect(project.children?.map(child => child.name)).toEqual(['repeat']);
    expect(project.groups?.map(group => group.title)).toEqual(['Functions']);

    const publicFunction = project.children?.[0];
    expect(publicFunction?.kind).toEqual(td.ReflectionKind.Function);

    const [signature] = publicFunction?.signatures ?? [];
    expect(signature.comment?.summary.map(({ text }) => text).join('')).toEqual('Returns a repeated function.');
    expect(signature.parameters?.map(parameter => [
      parameter.name,
      parameter.type?.stringify(td.TypeContext.none)
    ])).toEqual([
      ['func', 'Function'],
      ['n', 'number']
    ]);
    expect(signature.type?.stringify(td.TypeContext.none)).toEqual('Function');
  });

  it('uses @functionDeclaration decorator types for promoted Conductor methods', () => {
    const project = createProject();
    const fixturePath = pathlib.resolve(import.meta.dirname, 'fixtures/conductorDeclarations.ts');

    const plugin = register(
      project,
      new td.DeclarationReflection('default', td.ReflectionKind.Class, project)
    );
    project.addChild(plugin);
    addExportedNames(project, plugin, ['make_widget']);

    const method = register(
      project,
      new td.DeclarationReflection('make_widget', td.ReflectionKind.Method, plugin)
    );
    plugin.addChild(method);
    method.sources = [new td.SourceReference(fixturePath, 22, 10)];

    const property = register(
      project,
      new td.DeclarationReflection('sample_widget', td.ReflectionKind.Property, plugin)
    );
    plugin.addChild(property);
    property.sources = [new td.SourceReference(fixturePath, 19, 3)];
    property.type = typedValue(project, 'OPAQUE');

    const methodSignature = register(
      project,
      new td.SignatureReflection('make_widget', td.ReflectionKind.CallSignature, method)
    );
    method.signatures = [methodSignature];
    methodSignature.parameters = [
      createParameter(project, methodSignature, 'count', typedValue(project, 'NUMBER')),
      createParameter(project, methodSignature, 'mapper', typedValue(project, 'CLOSURE'))
    ];
    methodSignature.type = asyncGenerator(project, typedValue(project, 'OPAQUE'));

    normalizeConductorDocs(project);

    const publicFunction = project.children?.find(child => child.name === 'make_widget');
    const [signature] = publicFunction?.signatures ?? [];
    const publicVariable = project.children?.find(child => child.name === 'sample_widget');

    expect(signature.parameters?.map(parameter => [
      parameter.name,
      parameter.type?.stringify(td.TypeContext.none)
    ])).toEqual([
      ['count', 'number'],
      ['mapper', '(widget: Widget) => Widget']
    ]);
    expect(signature.type?.stringify(td.TypeContext.none)).toEqual('Widget');
    expect(publicVariable?.kind).toEqual(td.ReflectionKind.Variable);
    expect(publicVariable?.type?.stringify(td.TypeContext.none)).toEqual('Widget');
  });

  it('normalizes the migrated repeat bundle docs', async () => {
    const repeatBundle: ResolvedBundle = {
      type: 'bundle',
      name: 'repeat',
      manifest: {},
      directory: pathlib.resolve(import.meta.dirname, '../../../../../../src/bundles/repeat')
    };
    const app = await initTypedocForJson(repeatBundle, td.LogLevel.None);
    const project = await app.convert();
    expect(project).toBeDefined();

    normalizeConductorDocs(project!);

    const names = project!.children?.map(child => child.name);
    expect(names).toEqual(expect.arrayContaining(['repeat', 'twice', 'thrice']));
    expect(names).not.toContain('default');

    const publicFunctions = project!.children?.filter(child => {
      return child.kind === td.ReflectionKind.Function
        && ['repeat', 'twice', 'thrice'].includes(child.name);
    }) ?? [];
    const signatureText = publicFunctions
      .flatMap(func => func.signatures ?? [])
      .map(signature => [
        signature.parameters?.map(parameter => parameter.type?.stringify(td.TypeContext.none)).join(', '),
        signature.type?.stringify(td.TypeContext.none)
      ].join(' => '))
      .join('\n');

    expect(signatureText).not.toContain('AsyncGenerator');
    expect(signatureText).not.toContain('ITypedValue');
    expect(publicFunctions.find(func => func.name === 'repeat')?.signatures?.[0].parameters?.map(parameter => parameter.name))
      .toEqual(['func', 'n']);
  });

  it('uses declaration decorators in the migrated rune bundle docs', async () => {
    const runeBundle: ResolvedBundle = {
      type: 'bundle',
      name: 'rune',
      manifest: {},
      directory: pathlib.resolve(import.meta.dirname, '../../../../../../src/bundles/rune')
    };
    const app = await initTypedocForJson(runeBundle, td.LogLevel.None);
    const project = await app.convert();
    expect(project).toBeDefined();

    normalizeConductorDocs(project!);

    const show = project!.children?.find(child => child.name === 'show');
    const [signature] = show?.signatures ?? [];
    const blank = project!.children?.find(child => child.name === 'blank');

    expect(signature.parameters?.map(parameter => [
      parameter.name,
      parameter.type?.stringify(td.TypeContext.none)
    ])).toEqual([
      ['rune', 'Rune']
    ]);
    expect(signature.type?.stringify(td.TypeContext.none)).toEqual('Rune');
    expect(blank?.kind).toEqual(td.ReflectionKind.Variable);
    expect(blank?.type?.stringify(td.TypeContext.none)).toEqual('Rune');
  });
});
