import { DEBUG } from "../env";

export type Logger = {
  readonly debug: (...args: readonly any[]) => void
  readonly info: (...args: readonly any[]) => void
  readonly warn: (...args: readonly any[]) => void
  readonly error: (...args: readonly any[]) => void
};

export const ConsoleLogger: Logger = {
  debug: (...args) => {
    if (DEBUG) {
      console.log(...args);
    }
  },
  info: console.log,
  warn: console.warn,
  error: console.error
};
