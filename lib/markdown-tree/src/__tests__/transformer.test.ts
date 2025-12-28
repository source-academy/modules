import { createHighlighter, type ShikiTransformer, type ThemedToken } from 'shiki';
import { describe, expect, it as baseIt } from 'vitest';
import { dirtreeTransformer, grammar } from '../transformer.js';
import { parseContent } from '../structure.js';

interface Fixtures {
  transformer: ShikiTransformer;
  transform: (input: string) => ThemedToken[][];
  highlighter: Awaited<ReturnType<typeof createHighlighter>>;
}

const it = baseIt.extend<Fixtures>({
  transformer: ({}, use) => {
    const transformer = dirtreeTransformer({
      lightColours: ['1', '2', '3', '4'],
    });
    return use(transformer);
  },
  highlighter: async ({}, use) => {
    const highlighter = await createHighlighter({
      langs: [grammar],
      themes: ['github-light'],
    });
    await use(highlighter);
    highlighter.dispose();
  },
  transform: ({ highlighter, transformer }, use) => use((input: string) => {
    const [generated] = parseContent(input, '/dummy/dir', {});
    
    const { tokens } = highlighter.codeToTokens(generated, {
      theme: 'github-light',
      transformers: [transformer],
      // @ts-expect-error dirtree is not in the official Shiki lang list
      lang: 'dirtree',
    });
    return transformer.tokens!.call({
      options: {
        lang: 'dirtree'
      }
    } as any, tokens)!
  })
});

/**
 * Convert each line of tokens into a joined string,
 * verifying that the beginning offsets for each line are correct
 * \
 * Also collects the colours used in each line
 */
function tokenJoiner(tokens: ThemedToken[][]): {
  lines: string[],
  colours: string[][]
 } {
  let lineOffset = 0;

  const output: string[] = [];
  const colours: string[][] = [];

  for (const line of tokens) {
    expect(line[0].offset).toEqual(lineOffset);
    const joinedLine = line.map(token => token.content).join('');
    output.push(joinedLine);

    const lineColours: string[] = [];
    for (const token of line) {
      if (token.content === '    ') continue; // skip spaces
      if (token.htmlStyle === undefined) continue;

      lineColours.push(token.htmlStyle['--shiki-light']);
    }
    colours.push(lineColours);

    lineOffset += joinedLine.length + 1; // +1 for newline
  }

  return { lines: output, colours };
}

describe(dirtreeTransformer, () => {
  it('correctly highlights a simple directory tree', ({ transform }) => {
    const input = `
      name: root
      children:
      - dir1
      - dir2
    `;

    const tokens = transform(input);
    const { lines, colours } = tokenJoiner(tokens);

    expect(lines.length).toEqual(3); // 3 lines
    expect(lines[0]).toEqual('root');

    expect(lines[1]).toEqual('├── dir1');
    expect(colours[1]).toEqual(['1', '1']);

    expect(lines[2]).toEqual('└── dir2');
    expect(colours[2]).toEqual(['1', '1']);
  });

  it('correctly handles indent levels with no overlap', ({ transform }) => {
    const input = `
      name: root
      children:
      - name: dir1
        children:
        - name: dir2
          children:
          - dir3
    `;
    const tokens = transform(input);
    const { lines, colours } = tokenJoiner(tokens);

    expect(lines.length).toEqual(4); // 4 lines
    expect(lines[0]).toEqual('root');

    expect(lines[1]).toEqual('└── dir1');
    expect(colours[1]).toEqual(['1', '1']);

    expect(lines[2]).toEqual('    └── dir2');
    expect(colours[2]).toEqual(['2', '2']);

    expect(lines[3]).toEqual('        └── dir3');
    expect(colours[3]).toEqual(['3', '3']);
  });

  it('correctly handles indent levels with overlaps', ({ transform }) => {
    const input = `
      name: root
      children:
      - name: dir1
        children:
        - name: dir2
          children:
          - dir3
        - dir4
      - dir5
    `;
    const tokens = transform(input);
    const { lines, colours } = tokenJoiner(tokens);
    expect(lines.length).toEqual(6); // 6 lines

    expect(lines[0]).toEqual('root');

    expect(lines[1]).toEqual('├── dir1');
    expect(colours[1]).toEqual(['1', '1']);

    expect(lines[2]).toEqual('│   ├── dir2');
    expect(colours[2]).toEqual(['1', '2', '2']);

    expect(lines[3]).toEqual('│   │   └── dir3');
    expect(colours[3]).toEqual(['1', '2', '3', '3']);

    expect(lines[4]).toEqual('│   └── dir4');
    expect(colours[4]).toEqual(['1', '2', '2']);

    expect(lines[5]).toEqual('└── dir5');
    expect(colours[5]).toEqual(['1', '1']);
  });
});
