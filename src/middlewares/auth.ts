import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../app/modules/user/user.model';
import config from '../app/config';

const auth = (...requiredRole: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error('you are not authorised');
    }
    const decoded = jwt.verify(token, `${config.jwt_secret}`) as JwtPayload;
    const { id, role } = decoded;
    const user = await User.findById(id);
    if (!user) {
      throw new Error('user not found');
    }

    if (requiredRole && !requiredRole.includes(role)) {
      throw new Error('you are not authorised');
    }

    req.user = decoded as JwtPayload;

    next();
  });
};
export default auth;
