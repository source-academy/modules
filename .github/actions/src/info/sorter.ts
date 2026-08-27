import type { RawPackageRecord } from '../commons.js';

/**
 * Based on the dependencies and devDependencies fields of packages, create a topological
 * sorting that begins with packages with no dependencies first.
 */
export function topoSortPackages(packages: Record<string, RawPackageRecord>) {
  const nodeCount = Object.keys(packages).length;
  const indegrees: Record<string, number> = {};
  const neighbours: Record<string, string[]> = {};

  // Build the graph
  for (const [packageName, { package: { dependencies, devDependencies } }] of Object.entries(packages)) {
    if (!(packageName in neighbours)) {
      neighbours[packageName] = [];
    }

    if (!(packageName in indegrees)) {
      indegrees[packageName] = 0;
    }

    const keys: string[] = [];
    if (dependencies) {
      keys.push(...Object.keys(dependencies));
    }
    if (devDependencies) {
      keys.push(...Object.keys(devDependencies));
    }

    for (const name of keys) {
      // A dependency starting with @sourceacademy isn't necessarily a local workspace package -
      // e.g. @sourceacademy/conductor is a real published npm package that just happens to share
      // the org scope. Only graph it if it's an actual node in this monorepo; otherwise it has no
      // RawPackageRecord and processRawPackages crashes reading .hasChanges off undefined.
      if (name.startsWith('@sourceacademy') && name in packages) {
        if (!(name in indegrees)) {
          indegrees[name] = 1;
        } else {
          indegrees[name]++;
        }

        neighbours[packageName].push(name);
      }
    }
  }

  // Then use Kahn's algorithm for topo sorting
  const queue = Object.keys(indegrees).filter(key => indegrees[key] === 0);
  const output: string[] = [];

  while (queue.length > 0) {
    const node = queue.pop()!;
    output.unshift(node); // Packages without dependencies should appear first in the sort

    if (neighbours[node]) {
      for (const neighbour of neighbours[node]) {
        if (indegrees[neighbour] === 0) continue;

        indegrees[neighbour]--;
        if (indegrees[neighbour] === 0) {
          queue.push(neighbour);
        }
      }
    }
  }

  if (output.length < nodeCount) {
    throw new Error('Dependency graph has a cycle!');
  }

  return output;
}
