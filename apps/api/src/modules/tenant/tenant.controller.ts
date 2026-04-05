import type { FastifyReply, FastifyRequest } from "fastify";
import { successResponseHelper } from "@utils";
import { AsyncHandler } from "@errors";
import TenantService from "./tenant.service";
import type { CreateTenantBody } from "./tenant.schema";

class TenantController {
  @AsyncHandler
  static async createTenantController(
    request: FastifyRequest<{ Body: CreateTenantBody }>,
    reply: FastifyReply,
  ) {
    const result = TenantService.create(request.body);
    return successResponseHelper(reply, result, 201);
  }
}

export default TenantController;
