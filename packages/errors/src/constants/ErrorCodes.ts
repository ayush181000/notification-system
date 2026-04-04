export const ERROR_CODES = {
  INTERNAL_ERROR: {
    httpCode: 500,
    code: "INTERNAL_ERROR",
    message: "Something went wrong",
    success: false,
  },

  BAD_REQUEST: {
    httpCode: 400,
    code: "BAD_REQUEST",
    message: "Invalid request",
    success: false,
  },

  DUPLICATE_RESOURCE: {
    httpCode: 409,
    code: "DUPLICATE_RESOURCE",
    message: "Resource already exists",
    success: false,
  },

  DATABASE_ERROR: {
    httpCode: 500,
    code: "DATABASE_ERROR",
    message: "Database operation failed",
    success: false,
  },
} as const;

export type ErrorCodeType = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
