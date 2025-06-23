# Bundles as Libraries

Since bundles are designed to be imported from Source user code, they can also be imported from other bundles (and tabs!). The steps required for configuraing your bundle to be able to be do so can be found [here](/modules/2-bundle/6-compiling#for-other-bundles).

Bundles can then be added as dependencies as if they were any other `npm` or Yarn package:

```sh
yarn add @sourceacademy/bundle-curve@workspace:^
```

> [!TIP]
> Because our bundles aren't designed to be published within the wider `npm` ecosystem, the only versions available are the ones in the workspace,
> which means when you are adding dependencies like these you need to specify `workspace:^` as the version.
