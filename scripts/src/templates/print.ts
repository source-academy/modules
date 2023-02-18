import chalk from 'chalk';
import { createInterface } from 'readline';

export const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function info(...args) {
  return console.log(...args.map((string) => chalk.grey(string)));
}

export function error(...args) {
  return console.log(...args.map((string) => chalk.red(string)));
}

export function warn(...args) {
  return console.log(...args.map((string) => chalk.yellow(string)));
}

export function success(...args) {
  return console.log(...args.map((string) => chalk.green(string)));
}

export function askQuestion(question: string) {
  return new Promise<string>((resolve) => {
    rl.question(chalk.blueBright(`${question}\n`), resolve);
  });
}
