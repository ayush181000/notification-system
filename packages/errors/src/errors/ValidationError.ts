export class ValidationError extends Error {
  public readonly httpCode: number;
  public readonly code: string;
  public readonly success: boolean;
  public readonly data?: unknown;
  public readonly error?: string;

  constructor(error: string) {
    super("Validation failed");

    this.httpCode = 400;
    this.code = "VALIDATION_ERROR";
    this.success = false;
    this.name = "ValidationError";
    this.message = "Validation failed";
    this.error = error;
  }
}
