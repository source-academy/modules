import { createInterface, type Interface } from 'readline/promises';
import chalk from 'chalk';

export const getRl = () => createInterface({
  input: process.stdin,
  output: process.stdout
});

export function info(...args: string[]) {
  return console.log(...args.map(string => chalk.grey(string)));
}

export function error(...args: string[]) {
  return console.log(...args.map(string => chalk.red(string)));
}

export function warn(...args: string[]) {
  return console.log(...args.map(string => chalk.yellow(string)));
}

export function success(...args: string[]) {
  return console.log(...args.map(string => chalk.green(string)));
}

export function askQuestion(question: string, rl: Interface) {
  return rl.question(chalk.blueBright(`${question}\n`));
}
