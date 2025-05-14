import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const notFoundRoute = (req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'Route not found',
  });

  next();
};

export default notFoundRoute;
