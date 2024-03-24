/* eslint-disable no-await-in-loop */
import fs from 'fs/promises'

import type { Interface } from 'readline/promises'
import { type ModuleManifest, retrieveManifest } from '@src/manifest'

import { check as _check } from './module'
import { askQuestion, success, warn } from './print'
import { type Options, isPascalCase } from './utilities'

export function check(manifest: ModuleManifest, tabName: string) {
  return Object.values(manifest)
    .flatMap((x) => x.tabs)
    .includes(tabName)
}

async function askModuleName(manifest: ModuleManifest, rl: Interface) {
  while (true) {
    const name = await askQuestion('Add a new tab to which module?', rl)
    if (!_check(manifest, name)) {
      warn(`Module ${name} does not exist.`)
    } else {
      return name
    }
  }
}

async function askTabName(manifest: ModuleManifest, rl: Interface) {
  while (true) {
    const name = await askQuestion(
      'What is the name of your new tab? (eg. BinaryTree)', rl
    )
    if (check(manifest, name)) {
      warn('A tab with the same name already exists.')
    } else if (!isPascalCase(name)) {
      warn('Tab names must be in pascal case. (eg. BinaryTree)')
    } else {
      return name
    }
  }
}

export async function addNew({ manifest: manifestFile, srcDir }: Options, rl: Interface) {
  const manifest = await retrieveManifest(manifestFile)

  const moduleName = await askModuleName(manifest, rl)
  const tabName = await askTabName(manifest, rl)

  // Copy module tab template into correct destination and show success message
  const tabDestination = `${srcDir}/tabs/${tabName}`
  await fs.mkdir(tabDestination, { recursive: true })
  await fs.copyFile(
    './scripts/src/templates/templates/__tab__.tsx',
    `${tabDestination}/index.tsx`
  )
  await fs.writeFile(
    manifestFile,
    JSON.stringify(
      {
        ...manifest,
        [moduleName]: { tabs: [...manifest[moduleName].tabs, tabName] }
      },
      null,
      2
    )
  )
  success(
    `Tab ${tabName} for module ${moduleName} created at ${tabDestination}.`
  )
}
