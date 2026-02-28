// Matches the ErrorResponse your Spring Boot GlobalExceptionHandler returns
export interface ApiError {
  errorCode: string;
  message: string;
  fieldErrors?: { [key: string]: string };
  timestamp: string;
}
