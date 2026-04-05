import { DatabaseError } from "@errors";

export function isPgUniqueViolation(error: unknown): void {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    (error as any).code === "23505"
  ) {
    throw new DatabaseError(undefined, "Duplicate resource");
  }
}
