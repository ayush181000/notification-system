import { type FastifyReply, type FastifyRequest } from "fastify";
import { AppError } from "../errors/AppError";
import { logger } from "@logger";
import { ERROR_CODES } from "../constants/ErrorCodes";

export function globalErrorHandler(
  error: any,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Known error
  if (error instanceof AppError) {
    logger.warn({
      err: error,
      code: error.code,
      path: request.url,
    });

    return reply.status(error.httpCode).send({
      success: error.success,
      code: error.code,
      message: error.message,
      data: error.data ?? null,
    });
  }

  // Unknown error
  logger.error({
    err: error,
    path: request.url,
  });

  return reply.status(500).send({
    success: ERROR_CODES.INTERNAL_ERROR.success,
    code: ERROR_CODES.INTERNAL_ERROR.code,
    message: ERROR_CODES.INTERNAL_ERROR.message,
  });
}
