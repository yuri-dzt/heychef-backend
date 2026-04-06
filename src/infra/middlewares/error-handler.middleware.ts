import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../../shared/errors';
import { logger } from '../../shared/logger';

export const ErrorHandlerMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    res.status(422).json({ message: 'Validation error', errors: messages });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  logger.error(err.message, {
    name: err.name,
    stack: err.stack,
  });

  res.status(500).json({ message: 'Internal server error' });
};
