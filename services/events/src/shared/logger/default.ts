import { DEBUG } from "../env";

export interface ILogger {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

export const ConsoleLogger: ILogger = {
  debug: (...args) => {
    if (DEBUG) {
      console.log(...args);
    }
  },
  info: console.log,
  warn: console.warn,
  error: console.error,
};
