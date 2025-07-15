import pathlib from 'path';
import type MarkdownIt from 'markdown-it';
import { parseContent } from './structure';
import type { DirectoryTreePluginOptions } from './types';

/**
 * Markdown-It plugin for turning YAML into nicely formatted directory trees, complete with
 * with path verification to ensure that the specified tree matches the actual structure of the
 * given directory being modelled.
 */
export function directoryTreePlugin(md: MarkdownIt, options: DirectoryTreePluginOptions = {}) {
  const fence = md.renderer.rules.fence!;

  md.renderer.rules.fence = (...args) => {
    const [tokens, idx,, env] = args;
    const token = tokens[idx];

    if (token.info.trim() === 'dirtree') {
      const { realPath, path: _path } = env;
      const docdir = pathlib.resolve(pathlib.dirname(realPath ?? _path));
      const [content, warnings] = parseContent(token.content, docdir, options);

      token.content = content;

      if (warnings.length > 0) {
        const lineStr = token.map === null ? '' : `@${token.map[0]}:${token.map[1]}`;
        const locStr = `${pathlib.resolve(realPath ?? _path)}${lineStr}`;
        console.warn(`[Markdown Tree Plugin] Warnings while generating data at ${locStr}:\n${warnings.join('\n')} `);
      }
    }

    return fence(...args);
  };
}
