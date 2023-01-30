import buildDocsCommand from '../index';
import { promises as fs } from 'fs';
import { initTypedoc } from '../docUtils';

jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn().mockResolvedValue(true),
    writeFile: jest.fn().mockResolvedValue(true),
    stat: jest.fn().mockResolvedValue({ size: 0 }),
  }
}))

jest.mock('../../buildUtils');
jest.mock('../docUtils');

describe('Test the build docs command', () => {
  it('Should build html and all jsons when no modules are specified', async () => {
    await buildDocsCommand.parseAsync([], { from: 'user' });

    expect(initTypedoc).toHaveBeenCalledTimes(1);
    expect(fs.mkdir).toHaveBeenCalledTimes(1);
  })
});