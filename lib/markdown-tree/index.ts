import fs from 'fs';
import pathlib from 'path';
import type MarkdownIt from 'markdown-it';

interface DirectoryTreePluginOptions {
  ignoreDotFiles?: boolean
  ignores?: string[]
  indentChar?: string
  maxDepth?: number
  recurseFiles?: boolean
}

export const defaultIgnores = ['node_modules', 'package.json', '__mocks__', '__tests__'];

export function directoryCreator(directory: string, options: DirectoryTreePluginOptions = {}) {
  const indentChar = options.indentChar ?? '  ';
  const ignoreDotFiles = options.ignoreDotFiles ?? true;
  const recurseFiles = options.recurseFiles ?? false;
  const ignores = options.ignores ?? defaultIgnores;
  const maxDepth = options.maxDepth;

  function* recurser(srcDir: string, basename: string, indent: number): Generator<string> {
    const files = fs.readdirSync(srcDir, { withFileTypes: true });
    const indentStr = indentChar.repeat(indent);

    if (files.length === 0) {
      yield `${indentStr} ${basename}`;
      return;
    }

    yield `${indentStr} ${basename}:`;

    for (const each of files) {
      if (ignores.includes(each.name)) continue;

      if (ignoreDotFiles && each.name.startsWith('.')) {
        continue;
      }

      if (each.isDirectory() && (maxDepth !== undefined && indent < maxDepth)) {
        const fullPath = pathlib.join(srcDir, each.name);
        yield* recurser(fullPath, each.name, indent + 1);
      }

      if (!recurseFiles) continue;

      yield `${indentChar.repeat(indent + 1)} ${each.name}`;
    }
  }

  const lines: string[] = [];
  for (const line of recurser(directory, directory, 0)) {
    lines.push(line);
  }

  return lines.join('\n');
}

export function directoryTreePlugin(md: MarkdownIt, options: DirectoryTreePluginOptions = {}) {
  const fence = md.renderer.rules.fence!;
  const RE = /dirtree\s+(?:\[(.+)])?/;

  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args;
    const token = tokens[idx];

    if ('src' in token && typeof token.src === 'string') {
      const srcDir = token.src;

      if (!fs.existsSync(srcDir)) {
        token.attrPush(['content', `Could not locate ${srcDir}`]);
      } else if (!fs.statSync(srcDir).isDirectory()) {
        token.attrPush(['content', `${srcDir} is not a directory`]);
        // token.content = `${srcDir} is not a directory`;
      } else {
        token.attrPush(['content', directoryCreator(srcDir, options)]);
        // token.content = directoryCreator(srcDir, options);
      }

      console.log('rendering a fenced code block:', token);
    }

    return fence(...args);
  };

  md.block.ruler.before('fence', 'dirtree', (state, startLine, _, silent) => {
    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];

    const end = state.skipSpacesBack(max, pos);
    const rawPath = state.src.slice(pos + 3, end);

    const match = RE.exec(rawPath);

    if (silent) return true;

    if (!match) return false;
    console.log('i never got here');

    const filepath = match[1];
    const { realPath, path: _path } = state.env;
    const resolvedPath = pathlib.resolve(pathlib.dirname(realPath ?? _path), filepath);

    const token = state.push('fence', 'code', 0);

    console.log('what about the token here: ', token);

    // @ts-expect-error Provide extra information via the token object
    token.src = resolvedPath;
    state.line = startLine + 1;

    return true;
  });
}
