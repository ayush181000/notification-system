import pino from "pino";
import { config } from "@config";

export const logger = pino({
  level: config.LOG_LEVEL,
  safe: true,

  base: {
    service: "notification-system",
  },

  timestamp: pino.stdTimeFunctions.isoTime,

  transport:
    config.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        }
      : undefined,
  errorKey: "error",
});
