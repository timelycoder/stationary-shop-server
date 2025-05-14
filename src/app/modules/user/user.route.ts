import { Router } from 'express';
import { userController } from './user.controller';

import auth from '../../../middlewares/auth';

const userRoute = Router();

userRoute.post('/create-admin', userController.createAdmin);
userRoute.get('/:userId', userController.getSingleUser);
userRoute.put('/:userId', userController.updateUser);
userRoute.delete('/:userId', userController.deleteUser);

userRoute.get('/', auth('admin', 'user'), userController.getUser);

export default userRoute;
