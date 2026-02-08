import { Router } from 'express';
import {
  getUsers, getUserById, getCurrentUser, updateProfile, updateAvatar,
} from '../controllers/userController';
import { auth } from '../middlewares/auth';

const userRouter = Router();
userRouter.get('/users', auth, (req, res, next) => getUsers(req, res, next));
userRouter.get('/users/me', auth, (req, res, next) => getCurrentUser(req, res, next));
userRouter.get('/users/:userId', auth, (req, res, next) => getUserById(req, res, next));
userRouter.patch('/users/me', auth, (req, res, next) => updateProfile(req, res, next));
userRouter.patch('/users/me/avatar', auth, (req, res, next) => updateAvatar(req, res, next));

export default userRouter;
