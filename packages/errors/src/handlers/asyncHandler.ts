import { type FastifyReply, type FastifyRequest } from "fastify";

export const asyncHandler =
  (fn: any) => async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      return await fn(req, reply);
    } catch (error) {
      throw error;
    }
  };
