import * as Chalk from 'ansi-colors';
import * as figlet from 'figlet';

export const chalk = Chalk;

export const colorText = (text: any, color: Chalk.StyleFunction) => {
  return color(text);
};

export const bigText = (text: string, color: string = 'white') => {
  figlet(text, (error: any, data: any) => {
    if (error) {
      return process.exit(1);
    }
    console.log(chalk[color](data));
  });
};

export class LogBase {
  log(message?: any, ...params: any[]) {
    console.log(chalk.white.bgBlack(new Date().toISOString()), message, ...params);
  }

  warning(message?: any, ...params: any[]) {
    console.log(chalk.red.bgBlack(new Date().toISOString()), message, ...params);
  }

  error(message?: any, ...params: any[]) {
    console.log(chalk.whiteBright.bgRedBright(new Date().toISOString()), message, ...params);
  }

  info(message?: any, ...params: any[]) {
    console.log(chalk.greenBright.bgBlack(new Date().toISOString()), message, ...params);
  }
}
