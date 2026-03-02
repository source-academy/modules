// @ts-check

const pathlib = require('path');
const { defineConfig } = require('@yarnpkg/types');

const { name: rootWorkspaceName } = require(pathlib.join(__dirname, './package.json'));

module.exports = defineConfig({
  async constraints({ Yarn }) {
    for (const workspace of Yarn.workspaces()) {
      // Make sure all workspaces have type: "module"
      workspace.set('type', 'module');

      // All the vitest dependencies should have the same version as vitest
      const vitestDep = Yarn.dependency({ workspace, ident: 'vitest' });

      if (vitestDep !== null) {
        for (const otherVitestDep of Yarn.dependencies({ workspace })) {
          const depName = otherVitestDep.ident;
          // Except for the eslint plugin
          if (depName.startsWith('@vitest') && depName !== '@vitest/eslint-plugin') {
            otherVitestDep.update(vitestDep.range);
          }
        }
      }

      // If react is present, @types/react should also be present and use
      // the same version range
      const reactDep = Yarn.dependency({ workspace, ident: 'react' });
      if (reactDep !== null && reactDep.type === 'dependencies') {
        workspace.set('devDependencies.@types/react', reactDep.range);
      }

      // If react-dom is present, @types/react-dom should also be present and use
      // the same version range
      const reactDomDep = Yarn.dependency({ workspace, ident: 'react-dom' });
      if (reactDomDep !== null && reactDomDep.type === 'dependencies') {
        workspace.set('devDependencies.@types/react-dom', reactDomDep.range);
      }
    }

    // Make sure that if the dependency is defined in the root workspace
    // that all child workspaces use the same version of that dependency
    const [rootWorkspace] = Yarn.workspaces({ ident: rootWorkspaceName });

    // There should not be any resolutions value for js-slang,
    // which might be present if you linked js-slang to a local copy
    rootWorkspace.set('resolutions.js-slang', undefined);

    // Make sure that if the dependency is defined in the root workspace
    // that all child workspaces use the same version of that dependency
    for (const workspaceDep of Yarn.dependencies({ workspace: rootWorkspace })) {
      for (const otherDep of Yarn.dependencies({ ident: workspaceDep.ident })) {
        if (otherDep.type === 'peerDependencies') continue;

        otherDep.update(workspaceDep.range);
      }
    }

    for (const dep of Yarn.dependencies()) {
      // Dependencies that are from this repository should use
      // the correct version
      if (
        dep.ident.startsWith('@sourceacademy/modules') ||
        dep.ident.startsWith('@sourceacademy/bundle') ||
        dep.ident.startsWith('@sourceacademy/tab')
      ) {
        dep.update('workspace:^');
      }

      // @types dependencies should be devDependencies, not dependencies
      if (dep.ident.startsWith('@types') && dep.type === 'dependencies') {
        dep.workspace.set(`devDependencies.${dep.ident}`, dep.range);
        dep.update(undefined);
      }
    }

    // Repotools should not be allowed to depend on any other packages in this
    // repository
    const [repotools] = Yarn.workspaces({ ident: '@sourceacademy/modules-repotools' });
    for (const dep of Yarn.dependencies({ workspace: repotools })) {
      if (dep.ident.startsWith('@sourceacademy/modules')) dep.update(undefined);
    }
  }
});
