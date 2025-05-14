import { IUser } from './user.interface';
import User from './user.model';

const createAdmin = async (payload: IUser): Promise<IUser> => {
  payload.role = 'admin';
  const result = await User.create(payload);

  return result;
};

const getUser = async () => {
  const result = await User.find().select('-password');
  return result;
};

const getSingleUser = async (id: string) => {
  const result = await User.findById(id).select('-password');
  return result;
};

const updateUser = async (id: string, data: IUser) => {
  const result = await User.findByIdAndUpdate(id, data, {
    new: true,
  });
  return result;
};

const deleteUser = async (id: string) => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

export const userService = {
  createAdmin,
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
