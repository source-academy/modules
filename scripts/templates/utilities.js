const snakeCaseRegex = /\b[a-z]+(_[a-z]+)*\b/;
const pascalCaseRegex = /^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/;

function isSnakeCase(string) {
  return snakeCaseRegex.test(string);
}

function isPascalCase(string) {
  return pascalCaseRegex.test(string);
}

module.exports = {
  isSnakeCase,
  isPascalCase,
};
