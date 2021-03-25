const TypeDoc = require('typedoc');
const paths = require('./paths');
const modules = require('../../modules.json');

async function main() {
  const app = new TypeDoc.Application();
  app.options.addReader(new TypeDoc.TSConfigReader());
  app.options.addReader(new TypeDoc.TypeDocReader());

  app.bootstrap({
    entryPoints: Object.keys(modules).map(
      (bundle) => `${paths.root}/src/bundles/${bundle}/functions.ts`
    ),
    theme: 'minimal',
    readme: `${paths.root}/scripts/docs/README.md`,
    excludeInternal: true,
    categorizeByGroup: true,
    name: 'Source Academy Modules',
  });

  const project = app.convert();

  if (project) {
    const outputDir = 'build/documentation';
    await app.generateDocs(project, outputDir);
    await app.generateJson(project, outputDir + '/documentation.json');
  }
}

main().catch(console.error);
