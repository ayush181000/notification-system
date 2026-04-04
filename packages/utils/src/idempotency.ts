import crypto from "crypto";

export function generateIdempotencyKey(input: unknown): string {
  const str = JSON.stringify(input);
  return crypto.createHash("sha256").update(str).digest("hex");
}
