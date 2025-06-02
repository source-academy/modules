const { defineConfig } = require('@yarnpkg/types');

module.exports = defineConfig({
  async constraints({ Yarn }) {
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
