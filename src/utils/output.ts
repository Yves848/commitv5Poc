import * as Chalk from 'ansi-colors';
import * as figlet from 'figlet';

// tslint:disable-next-line: variable-name
export const _console = console.log;

export const chalk = Chalk;

export const colorText = (text: any, color: Chalk.StyleFunction) => {
  return color(text);
};

export const bigText = (text: string, color: string = 'white') => {
  figlet(text, (error: any, data: any) => {
    if (error) {
      return process.exit(1);
    }
    _console(chalk[color](data));
  });
};

export const smallText = (text: string, color: string = 'white') => {
  _console(chalk[color](text));
};
