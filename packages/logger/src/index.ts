import pino from "pino";
import { config } from "@config";
import { generateUUIDV7 } from "@utils";
import type { FastifyServerOptions } from "fastify";
type LoggerOption = FastifyServerOptions["logger"];

export const logger: LoggerOption = {
  level: config.LOG_LEVEL,
  genReqId: (_req) => generateUUIDV7(),
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
};
