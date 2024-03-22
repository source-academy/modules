import { PassThrough } from 'stream';
import fs from 'fs/promises';
import type { MockedFunction } from 'jest-mock';

const mockedFsOpen = (fs.open as MockedFunction<typeof fs.open>);

export function mockStream() {
  const stream = new PassThrough();
  mockedFsOpen.mockResolvedValueOnce({
    createWriteStream: () => stream as any,
    close() {
      stream.end();
      return this;
    }
  } as any);

  return new Promise<string>((resolve, reject) => {
    const data: string[] = [];

    stream.on('data', (chunk) => {
      data.push(chunk.toString());
    });

    stream.on('error', reject);

    stream.on('end', () => resolve(data.join('')));
  });
}
