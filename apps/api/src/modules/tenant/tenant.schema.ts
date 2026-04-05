import { z } from "zod";

export const createTenantSchema = z.object({
  name: z.string(),
});

export type CreateTenantBody = z.infer<typeof createTenantSchema>;
