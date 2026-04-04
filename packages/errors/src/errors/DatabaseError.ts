import { AppError } from "./AppError";
import { ERROR_CODES } from "../constants/ErrorCodes";

export class DatabaseError extends AppError {
  constructor(data?: unknown, message?: string) {
    super(ERROR_CODES.DATABASE_ERROR, data, message);
  }
}
