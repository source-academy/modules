"""
This file contains a bunch of python scripts that can be used to update all
the tsconfigs or package.jsons of all tabs and bundles at once
(say if a new script needed to be added)
"""

import asyncio as aio
import os
import json
from typing import Any, Callable, Literal

async def get_git_root():
  proc = await aio.create_subprocess_exec('git', 'rev-parse', '--show-toplevel', stdout=aio.subprocess.PIPE)
  stdout, _ = await proc.communicate()
  return stdout.decode().strip()

def get_assets(git_root: str, asset: Literal['bundle', 'tab']):
  """
  Returns an iterable of tuples consisting of the name of either every bundle or every tab
  and the full path to its directory
  """
  for name in os.listdir(f'{git_root}/src/{asset}s'):
    if name == '__mocks__' or name == 'node_modules':
      continue

    full_path = os.path.join(git_root, 'src', f'{asset}s', name)
    if not os.path.isdir(full_path):
      continue
    yield name, full_path

def update_json(git_root: str, asset: Literal['bundle', 'tab'], file_name: Literal['package','tsconfig'], updater: Callable[[str, str, Any], Any]):
  for name, full_path in get_assets(git_root, asset):
    try:
      with open(f'{full_path}/{file_name}.json') as file:
        original = json.load(file)
        updated = updater(name, full_path, original)

        if not updated:
          raise RuntimeError(f'Updated returned an empty object for {asset} {name}')

      with open(f'{full_path}/{file_name}.json', 'w') as file:
        json.dump(updated, file, indent=2)
    except Exception as e:
      print(f'{e} occurred with {full_path}/{file_name}.json')

async def main():
  git_root = await get_git_root()
  def updater(name: str, full_path: str, obj: Any):
    obj['compilerOptions']['noEmit'] = True
    return obj

  update_json(git_root, 'bundle', 'tsconfig', updater)

if __name__ == '__main__':
  aio.run(main())
