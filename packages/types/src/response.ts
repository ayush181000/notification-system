export type ApiResponse<T extends Record<string, any> = any> =
  | {
      success: true;
      code: string;
      message: string;
      data: T;
      error?: string | null;
    }
  | {
      success: false;
      code: string;
      message: string;
      data?: T;
      error: string | null;
    };
