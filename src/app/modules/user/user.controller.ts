import { StatusCodes } from 'http-status-codes';

import { userService } from './user.service';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

const createAdmin = catchAsync(async (req, res) => {
  const payload = req.body;

  const result = await userService.createAdmin(payload);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'User created successfully',
    data: result,
  });
});

const getUser = catchAsync(async (req, res) => {
  const result = await userService.getUser();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Users getting successfully',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  const result = await userService.getSingleUser(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User getting successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const body = req.body;
  const result = await userService.updateUser(userId, body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User updated successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  await userService.deleteUser(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'user deleted successfully',
    data: {},
  });
});

export const userController = {
  createAdmin,
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
