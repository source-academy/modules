// @ts-check

const { defineConfig } = require('@yarnpkg/types');
const { name } = require('./package.json');

module.exports = defineConfig({
  async constraints({ Yarn }) {
    // Make sure all workspaces have type: "module"
    for (const workspace of Yarn.workspaces()) {
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
    }

    // Make sure that if the dependency is defined in the root workspace
    // that all child workspaces use the same version of that dependency
    const [rootWorkspace] = Yarn.workspaces({ ident: name });

    // There should not be any resolutions value for js-slang,
    // which might be present if you linked js-slang to a local copy
    rootWorkspace.set('resolutions.js-slang', undefined);

    for (const workspaceDep of Yarn.dependencies({ workspace: rootWorkspace })) {
      if (workspaceDep.type === 'peerDependencies') continue;

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
    }

    // Repotools should not be allowed to depend on any other packages in this
    // repository
    const [repotools] = Yarn.workspaces({ ident: '@sourceacademy/modules-repotools' });
    for (const dep of Yarn.dependencies({ workspace: repotools })) {
      if (dep.ident.startsWith('@sourceacademy/modules')) dep.update(undefined);
    }
  }
});
