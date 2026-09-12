import { isAxiosError } from "axios";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number = 500, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static fromError(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error;
    }

    if (isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message =
        error.response?.data?.message ??
        error.response?.data?.error ??
        error.message ??
        "An unexpected error occurred";
      return new ApiError(message, status, error.response?.data);
    }

    if (error instanceof Error) {
      return new ApiError(error.message, 500);
    }

    return new ApiError("An unknown error occurred", 500);
  }
}
