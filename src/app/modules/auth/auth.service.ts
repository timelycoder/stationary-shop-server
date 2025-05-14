import config from '../../config';
import { IUser } from '../user/user.interface';
import User from '../user/user.model';
import { ILoginUser } from './auth.interface';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (payload: IUser) => {
  const result = await User.create(payload);
  return result;
};

const login = async (payload: ILoginUser) => {
  const user = await User.findOne({ email: payload?.email }).select('+password');
  if (!user) {
    throw new Error('user not found!!');
  }

  const userStatus = user?.userStatus;

  if (userStatus == 'inactive') {
    throw new Error('user is not active');
  }

  const isPasswordMatch = await bcrypt.compare(payload?.password, user?.password);
  if (!isPasswordMatch) {
    throw new Error('password does not match');
  }

  const token = jwt.sign(
    { email: user?.email, role: user?.role, id: user?._id },
    `${config.jwt_secret}`,
    {
      expiresIn: '1d',
    },
  );

  const verifiedUser = {
    id: user?._id,
    name: user?.name,
    age: user?.age,
    email: user?.email,
    photo: user?.photo,
    role: user?.role,
    userStatus: user?.userStatus,
    shippingAddress: user?.shippingAddress,
  };
  return { token, verifiedUser };
};

export const AuthService = {
  register,
  login,
};
