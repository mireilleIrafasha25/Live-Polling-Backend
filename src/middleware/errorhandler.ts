import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors'; 
import { AppError } from '../utils/errors';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  const response: any = {
    success: false,
    status: statusCode,
    message: err.message || 'Internal Server Error',
  };

  //  Include validation errors from Zod
  if (err instanceof ValidationError) {
    response.errors = err.errors; 
  }

  // Show stack only in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
