// @ts-check

const { defineConfig } = require('@yarnpkg/types');

module.exports = defineConfig({
  async constraints({ Yarn }) {
    // Make sure all workspaces have type: "module"
    for (const workspace of Yarn.workspaces()) {
      workspace.set('type', 'module');
    }

    // make sure that all dependencies have the same version
    for (const dependency of Yarn.dependencies()) {
      if (dependency.type === 'peerDependencies')
        continue;

      for (const otherDependency of Yarn.dependencies({ident: dependency.ident})) {
        if (otherDependency.type === 'peerDependencies')
          continue;

        dependency.update(otherDependency.range);
      }
    }
  }
});
