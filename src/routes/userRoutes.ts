import { Router } from 'express';
import {
  getUsers, getUserById, createUser, updateProfile, updateAvatar,
} from '../controllers/userController';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', updateProfile);
userRouter.patch('/me/avatar', updateAvatar);

export default userRouter;
