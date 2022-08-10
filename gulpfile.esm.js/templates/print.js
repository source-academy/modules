import { grey, red, yellow, green, blueBright } from 'chalk';
import { createInterface } from 'readline';

export const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function info(...args) {
  return console.log(...args.map((string) => grey(string)));
}

export function error(...args) {
  return console.log(...args.map((string) => red(string)));
}

export function warn(...args) {
  return console.log(...args.map((string) => yellow(string)));
}

export function success(...args) {
  return console.log(...args.map((string) => green(string)));
}

export function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(blueBright(`${question}\n`), resolve);
  });
}
