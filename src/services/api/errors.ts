export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
  statusCode?: number;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  statusCode?: number;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
