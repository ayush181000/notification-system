import { generateUUIDV7 } from "@utils";
import type { CreateTenantBody } from "./tenant.schema";
import { db, tenants } from "@database";

class TenantService {
  static async create(input: CreateTenantBody) {
    const apiKey = generateUUIDV7();
    const result = await db
      .insert(tenants)
      .values({
        apiKey: apiKey,
        name: input.name,
      })
      .returning();

    return result[0];
  }
}

export default TenantService;
