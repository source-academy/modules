const snakeCaseRegex = /\b[a-z0-9]+(?:_[a-z0-9]+)*\b/u;
const pascalCaseRegex = /^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/u;

export function isSnakeCase(string: string) {
  return snakeCaseRegex.test(string);
}

export function isPascalCase(string: string) {
  return pascalCaseRegex.test(string);
}
export type Options = {
  srcDir: string;
  manifest: string;
};
