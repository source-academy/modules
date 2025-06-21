// @ts-check

const { defineConfig } = require('@yarnpkg/types');
const { name } = require('./package.json');

module.exports = defineConfig({
  async constraints({ Yarn }) {
    // Make sure all workspaces have type: "module"
    for (const workspace of Yarn.workspaces()) {
      workspace.set('type', 'module');
    }

    // Make sure that if the dependency is defined in the root workspace
    // that all child workspaces use the same version of that dependency
    const [mainWorkspace] = Yarn.workspaces({ ident: name });

    for (const workspaceDep of Yarn.dependencies({ workspace: mainWorkspace })) {
      if (workspaceDep.type === 'peerDependencies') continue;

      for (const otherDep of Yarn.dependencies({ ident: workspaceDep.ident })) {
        if (otherDep.type === 'peerDependencies') continue;

        otherDep.update(workspaceDep.range);
      }
    }
  }
});
