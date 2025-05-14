import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  const stack = process.env.NODE_ENV === 'development' ? err.stack : undefined;

  res.status(statusCode).json({
    success: false,
    message,
    stack,
  });
};

export default globalErrorHandler;
