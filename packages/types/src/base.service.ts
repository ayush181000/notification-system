export abstract class BaseService {
  protected static ok<T>(data: T): ServiceResult<T> {
    return { success: true, data };
  }

  protected static fail(message: string): ServiceResult<never> {
    return {
      success: false,
      error: message,
    };
  }
}

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
