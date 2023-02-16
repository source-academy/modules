const snakeCaseRegex = /\b[a-z]+(?:_[a-z]+)*\b/u;
const pascalCaseRegex = /^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/u;
export function isSnakeCase(string) {
    return snakeCaseRegex.test(string);
}
export function isPascalCase(string) {
    return pascalCaseRegex.test(string);
}
