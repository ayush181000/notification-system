import type { FastifyReply, FastifyRequest } from "fastify";
import { successResponseHelper } from "@utils";

export const createTenantController = async (
  request: FastifyRequest<{ Body: {} }>,
  reply: FastifyReply,
) => {
  return successResponseHelper(reply);
};
