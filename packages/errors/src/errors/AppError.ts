import { type ErrorCodeType } from "../constants/ErrorCodes";

export class AppError extends Error {
  public readonly httpCode: number;
  public readonly code: string;
  public readonly success: boolean;
  public readonly data?: unknown;

  constructor(error: ErrorCodeType, data?: unknown, customMessage?: string) {
    super(customMessage || error.message);

    this.name = "AppError";
    this.httpCode = error.httpCode;
    this.code = error.code;
    this.success = error.success;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
}
