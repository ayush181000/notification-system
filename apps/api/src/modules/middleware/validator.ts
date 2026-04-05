import { prettifyError, z } from "zod";
import type { FastifyReply, FastifyRequest } from "fastify";
import { ValidationError } from "@errors/src";

export function validateBody(schema: z.ZodObject) {
  return function (request: FastifyRequest, _reply: FastifyReply) {
    const result = schema.safeParse(request.body);
    if (!result.success) {
      throw new ValidationError(prettifyError(result.error));
    }
    request.body = result.data;
  };
}

export function validateHeaders(schema: z.ZodObject) {
  return function (request: FastifyRequest, _reply: FastifyReply) {
    const result = schema.safeParse(request.headers);
    if (!result.success) {
      throw new ValidationError(prettifyError(result.error));
    }
    request.body = result.data;
  };
}
