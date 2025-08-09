export interface RawPackageRecord {
  directory: string
  hasChanges: boolean
  package: {
    name: string
    devDependencies: Record<string, string>
    dependencies: Record<string, string>
  }
}

interface BasePackageRecord {
  /**
   * Directory within which the `package.json` file was found
   */
  directory: string

  /**
   * Full scoped package name
   */
  name: string
  /**
   * `true` if git detected changes from within the package's subdirectories,
   * `false` otherwise
   */
  changes: boolean
  /**
   * `true` if playwright is present under devDependencies. This means that the package
   * might need playwright for its tests
   */
  needsPlaywright: boolean
}

export interface BundlePackageRecord extends BasePackageRecord {
  bundleName: string;
}

export interface TabPackageRecord extends BasePackageRecord {
  tabName: string;
}

export type PackageRecord = BundlePackageRecord | TabPackageRecord | BasePackageRecord;
