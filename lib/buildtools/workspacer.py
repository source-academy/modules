"""
This file contains a bunch of python scripts that can be used to update all
the tsconfigs or package.jsons of all tabs and bundles at once
(say if a new script needed to be added)
"""

import asyncio as aio
import os
import json

async def get_git_root():
  proc = await aio.create_subprocess_exec('git', 'rev-parse', '--show-toplevel', stdout=aio.subprocess.PIPE)
  stdout, _ = await proc.communicate()
  return stdout.decode()

def get_tabs(git_root: str):
  for name in os.listdir(f'{git_root}/src/tabs'):
    full_path = os.path.join(git_root, 'src', 'tabs', name)
    if not os.path.isdir(f'./src/tabs/{name}'):
      continue
    yield name, full_path

def get_bundles():
  for name in os.listdir('./src/bundles'):
    if name == '__mocks__':
      continue

    if not os.path.isdir(f'./src/bundles/{name}'):
      continue
    yield name

def update_tab_packages(git_root: str):
  for name, full_path in get_tabs(git_root):
    with open(f'./src/tabs/{name}/package.json') as file:
      original = json.load(file)
      original['dependencies']['@sourceacademy/modules-lib'] = 'workspace:^'

    with open(f'./src/tabs/{name}/package.json', 'w') as file:
      json.dump(original, file, indent=2)

def create_bundle_manifest():
  with open('modules.json') as file:
    current_manifest = json.load(file)

  for moduleName in current_manifest.keys():
    with open(f'./src/bundles/{moduleName}/manifest.json', 'w') as manifest_file:
      manifest = {}

      if 'tabs' in current_manifest[moduleName]:
        manifest['tabs'] = current_manifest[moduleName]['tabs']

      json.dump(manifest, manifest_file, indent=2)

def update_tab_tsconfigs():
  for name in get_tabs():
    tsconfigPath = f'./src/tabs/{name}/tsconfig.json'
    with open(tsconfigPath) as file:
      original = json.load(file)

    with open(f'./src/tabs/{name}/tsconfig.json', 'w') as file:
      compilerOptions = original.setdefault('compilerOptions', dict())
      compilerOptions['outDir'] = './dist'
      json.dump(original, file, indent=2)

def update_bundle_tsconfigs():
  for name in os.listdir('./src/bundles'):
    if not os.path.isdir(f'./src/bundles/{name}'):
      continue

    with open(f'./src/bundles/{name}/tsconfig.json') as file:
      original = json.load(file)

    if 'compilerOptions' in original:
      original['compilerOptions']['outDir'] = './dist'
    else:
      original['compilerOptions'] = {
        "outDir": './dist'
      }

    with open(f'./src/bundles/{name}/tsconfig.json', 'w') as file:
      json.dump(original, file, indent=2)

def update_bundle_packages():
  for name in get_bundles():
    with open(f'./src/bundles/{name}/package.json') as file:
      original = json.load(file)

      if '@sourceacademy/module-buildtools' in original['devDependencies']:
        del original['devDependencies']['@sourceacademy/module-buildtools']
        original['devDependencies']['@sourceacademy/modules-buildtools'] = "workspace:^"

    with open(f'./src/bundles/{name}/package.json', 'w') as file:
      json.dump(original, file, indent=2)

async def main():
  git_root = await get_git_root()

if __name__ == '__main__':
  # create_bundle_manifest()
  # update_bundle_packages()
  # update_bundle_tsconfigs()
  aio.run(main())
  # update_tab_tsconfigs()
      