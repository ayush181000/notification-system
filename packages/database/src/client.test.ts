import { describe, it, expect } from "vitest";
import { db } from "./client";

describe("Database Connection", () => {
  it("should connect successfully", async () => {
    const result = await db.execute("SELECT 1");
    expect(result).toBeDefined();
  });
});
