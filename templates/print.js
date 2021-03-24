/* eslint-disable no-console */
const chalk = require('chalk');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function info(...args) {
  return console.log(...args.map((string) => chalk.grey(string)));
}

function error(...args) {
  return console.log(...args.map((string) => chalk.red(string)));
}

function warn(...args) {
  return console.log(...args.map((string) => chalk.yellow(string)));
}

function success(...args) {
  return console.log(...args.map((string) => chalk.green(string)));
}

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(chalk.blueBright(`${question}\n`), resolve);
  });
}

module.exports = {
  rl,
  info,
  error,
  warn,
  success,
  askQuestion,
};
