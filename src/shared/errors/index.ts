export { AppError } from "./app-error";

import { AppError } from "./app-error";

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Access denied") {
    super(message, 403);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Invalid input") {
    super(message, 422);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409);
  }
}

export class PlanExpiredError extends AppError {
  constructor(message = "Your plan has expired") {
    super(message, 403);
  }
}
