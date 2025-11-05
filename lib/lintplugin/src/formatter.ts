import type { ESLint } from 'eslint';

/**
 * CSV Formatter for collating ESLint statistics into a CSV file
 */
const formatResults: ESLint.FormatterFunction = things => {
  const output: Record<string, { total: number, files: Set<string> }> = {};

  for (const file of things) {
    if (!file.stats) {
      throw new Error('Formatter must be used with the --stats option');
    }

    for (const { rules } of file.stats.times.passes) {
      if (!rules) continue;

      for (const [ruleName, { total }] of Object.entries(rules)) {
        if (!(ruleName in output)) {
          output[ruleName] = {
            total: 0,
            files: new Set()
          };
        }

        output[ruleName].total += total;
        output[ruleName].files.add(file.filePath);
      }
    }
  }

  const lines = Object.entries(output).map(([ruleName, { total, files }]) => {
    const fileCount = files.size;
    return `${ruleName},${total},${fileCount},${total / fileCount}`;
  });

  return [
    'ruleName,total time,fileCount,time per file',
    ...lines
  ].join('\n');
};

export default formatResults;
