import type { FastifyReply, FastifyRequest } from "fastify";
import { isPgUniqueViolation } from "@database";

/** Function definnition */
export const asyncHandlerFunction =
  (fn: any) => async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      return await fn(req, reply);
    } catch (error) {
      isPgUniqueViolation(error);
      throw error;
    }
  };

/** Decorator definnition */
export function AsyncHandler(
  originalMethod: Function,
  _context: ClassMethodDecoratorContext,
) {
  return async function (this: any, ...args: any[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (error) {
      isPgUniqueViolation(error);
      throw error;
    }
  };
}
