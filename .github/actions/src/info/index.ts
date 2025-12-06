import pathlib from 'path';
import * as core from '@actions/core';
import type { SummaryTableRow } from '@actions/core/lib/summary.js';
import { getPluginConfiguration } from '@yarnpkg/cli';
import { Configuration, Project, structUtils, type Workspace } from '@yarnpkg/core';
import { npath, ppath, type PortablePath } from '@yarnpkg/fslib';
import packageJson from '../../../../package.json' with { type: 'json' };
import { checkDirForChanges } from '../commons.js';
import { gitRoot } from '../gitRoot.js';

/**
 * Represents all the information we need to know about a
 * particular workspace in this repository
 */
interface BasePackageInformation<T extends string | null = null> {
  /**
   * Type field for indicating what kind of package this is
   * (library, tab, bundle or none of the above)
   */
  type: T;

  /**
   * The full scoped name of the package
   */
  name: string;

  /**
   * The path to the directory containing the package, relative to
   * the git root
   */
  directory: PortablePath;

  /**
   * Boolean value indicating if there were any changes made to the
   * package relative to the version present on the master branch
   */
  hasChanges: boolean;

  /**
   * Boolean value indicating if the package relies on Playwright
   * (and thus requires an extra setup step)
   */
  needsPlaywright: boolean;
}

/**
 * Represents a library package
 */
type LibPackageInformation = BasePackageInformation<'lib'>;

/**
 * Represents a bundle package
 */
type BundlePackageInformation = BasePackageInformation<'bundle'> & {
  bundleName: string;
};

/**
 * Represents a tab package
 */
type TabPackageInformation = BasePackageInformation<'tab'> & {
  tabName: string;
};

/**
 * Represents the 4 types of packages that can be found in this workspace
 */
type PackageInformation =
  BasePackageInformation |
  BundlePackageInformation |
  LibPackageInformation |
  TabPackageInformation;

const moduleNameRE = /(bundle|tab)-(.+)/u;

type DeterminePkgResult = ['bundle' | 'tab', string] | ['lib' | null, null];

/**
 * Function for determining what the type of the package in the given workspace is
 */
function determinePkgType(workspace: Workspace, libDir: PortablePath): DeterminePkgResult {
  const { manifest: { name } } = workspace;
  const match = moduleNameRE.exec(name!.name);

  if (match) {
    const [assetType, assetName] = match;
    return [assetType as 'tab' | 'bundle', assetName];
  }

  // If the workspace was found under the lib folder, we consider it a 'library'
  const libPath = ppath.relative(libDir, workspace.cwd);
  if (libPath.startsWith('.')) return ['lib', null];

  return [null, null];
}

/**
 * Retrieve all packages from within the git repository, sorted into the different types
 */
export async function getAllPackages(rawGitRoot: string) {
  const gitRoot = npath.toPortablePath(rawGitRoot);

  const pluginConfig = getPluginConfiguration();
  const config = await Configuration.find(gitRoot, pluginConfig);
  const { project } = await Project.find(config, gitRoot);

  const libDir = ppath.join(gitRoot, 'lib');
  const playwright = structUtils.makeIdent(null, 'playwright');

  const bundles: Record<string, BundlePackageInformation> = {};
  const tabs: Record<string, TabPackageInformation> = {};
  const libs: Record<string, LibPackageInformation> = {};
  const packages: Record<string, PackageInformation> = {};

  /**
   * Retrieves all the information for the given workspace and recursively
   * processes workspaces it is dependent upon.
   *
   * Returns a boolean value indicating if changes were detected for the
   * given workspace, or any changes were detected in its dependencies.
   */
  async function processWorkspace(workspace: Workspace): Promise<boolean> {
    const currentDir = workspace.cwd;
    const name = workspace.manifest.name;
    if (!name) {
      throw new Error(`Workspace at ${currentDir} has no name!`);
    }

    if (name.scope !== 'sourceacademy') {
      throw new Error(`Unknown package scope ${name.scope} at ${currentDir}`);
    }

    // Ignore the root package
    if (name.name === 'modules') return false;

    if (name.name in packages) {
      return packages[name.name].hasChanges;
    }

    const scopedName = `@${name.scope}/${name.name}`;
    const needsPlaywright = workspace.manifest.hasDependency(playwright);

    let pkgInfo: PackageInformation;
    const [pkgType, assetName] = determinePkgType(workspace, libDir);
    switch (pkgType) {
      case 'bundle': {
        pkgInfo = {
          name: scopedName,
          directory: currentDir,
          hasChanges: false,
          needsPlaywright,
          type: pkgType,
          bundleName: assetName
        };
        bundles[name.name] = pkgInfo;
        break;
      }
      case 'tab': {
        pkgInfo = {
          name: scopedName,
          directory: currentDir,
          hasChanges: false,
          needsPlaywright,
          type: pkgType,
          tabName: assetName
        };
        tabs[name.name] = pkgInfo;
        break;
      }
      case 'lib': {
        pkgInfo = {
          name: scopedName,
          directory: currentDir,
          hasChanges: false,
          needsPlaywright,
          type: pkgType
        };
        libs[name.name] = pkgInfo;
        break;
      }
      case null: {
        pkgInfo = {
          name: scopedName,
          directory: currentDir,
          hasChanges: false,
          needsPlaywright,
          type: null
        };
        break;
      }
    }

    packages[name.name] = pkgInfo;

    const dependentChanges = await Promise.all([...workspace.getRecursiveWorkspaceDependencies()].map(processWorkspace));
    const result = dependentChanges.some(x => x) || await checkDirForChanges(currentDir);

    packages[name.name].hasChanges = result;
    return result;
  }

  await Promise.all(project.workspaces.map(processWorkspace));

  return {
    bundles,
    tabs,
    libs,
    packages
  };
}

/**
 * Use the Github actions core.setOutput function, but this is just here
 * for type safety
 */
function setOutputs(
  bundles: BundlePackageInformation[],
  tabs: TabPackageInformation[],
  libs: LibPackageInformation[],
  devserver: PackageInformation,
  docserver: PackageInformation,
) {
  core.setOutput('bundles', bundles.filter(x => x.hasChanges));
  core.setOutput('tabs', tabs.filter(x => x.hasChanges));
  core.setOutput('libs', libs.filter(x => x.hasChanges));
  core.setOutput('devserver', devserver);
  core.setOutput('docserver', docserver);
}

export async function main() {
  const { packages, bundles, tabs, libs } = await getAllPackages(gitRoot);

  const { repository } = packageJson;
  const repoUrl = repository.substring(0, repository.length - 4); // Remove the .git at the end

  const summaryItems = Object.values(packages).map((packageInfo): SummaryTableRow => {
    const relpath = pathlib.relative(gitRoot, packageInfo.directory);
    const url = new URL(relpath, `${repoUrl}/tree/master/`);

    return [
      `<code>${packageInfo.name}</code>`,
      `<a href="${url}">${relpath}</a>`,
      `<code>${packageInfo.hasChanges ? 'true' : 'false'}</code>`,
      `<code>${packageInfo.needsPlaywright ? 'true' : 'false'}</code>`
    ];
  });

  summaryItems.unshift([
    {
      data: 'Package Name',
      header: true,
    },
    {
      data: 'Package Path',
      header: true
    },
    {
      data: 'Has Changes',
      header: true
    },
    {
      data: 'Needs Playwright',
      header: true
    }
  ]);

  core.summary.addHeading('Package Information');
  core.summary.addTable(summaryItems);
  await core.summary.write();

  setOutputs(
    Object.values(bundles),
    Object.values(tabs),
    Object.values(libs),
    packages['@sourceacademy/modules-devserver'],
    packages['@sourceacademy/modules-docserver']
  );

  const workflows = await checkDirForChanges(pathlib.join(gitRoot, '.github/workflows'));
  core.setOutput('workflows', workflows);
}

if (process.env.GITHUB_ACTIONS) {
  // Only run automatically when it CI/CD environment
  try {
    await main();
  } catch (error: any) {
    core.setFailed(error);
    throw error;
  }
}
