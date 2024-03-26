// Snake case regex has been changed from `/\b[a-z]+(?:_[a-z]+)*\b/u` to `/\b[a-z0-9]+(?:_[a-z0-9]+)*\b/u`
// to be consistent with the naming of the `arcade_2d` and `physics_2d` modules.
// This change should not affect other modules, since the set of possible names is only expanded.
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
