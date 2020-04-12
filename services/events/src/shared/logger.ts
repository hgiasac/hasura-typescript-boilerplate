import * as winston from "winston";
import { LOG_LEVEL } from "./env";

export const LOG_LEVEL_WARN = "warn";
export const LOG_LEVEL_ERROR = "error";
export const LOG_LEVEL_INFO = "info";
export const LOG_LEVEL_DEBUG = "debug";

export function initLogger() {
  return winston.createLogger({
    level: LOG_LEVEL,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    defaultMeta: { service: "events" },
    transports: [
      new winston.transports.Console(),
    ]
  });
}

export const logger = initLogger();
