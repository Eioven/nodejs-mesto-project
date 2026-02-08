import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { AuthRequest } from '../middlewares/auth';
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ConflictError,
} from '../middlewares/errorHandler';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    if (!email || !password) {
      throw new BadRequestError('Email и пароль обязательны для регистрации');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name, about, avatar, email, password: hashedPassword,
    });
    res.status(201).send(user);
  } catch (err: any) {
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с таким email уже существует'));
    } else {
      next(err);
    }
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      throw new UnauthorizedError('Необходима авторизация');
    }

    const { name, about } = req.body;

    if (!name || !about) {
      throw new BadRequestError('Переданы некорректные данные при обновлении профиля');
    }

    const user = await User.findByIdAndUpdate(
      authReq.user._id,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }

    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      throw new UnauthorizedError('Необходима авторизация');
    }

    const user = await User.findById(authReq.user._id);

    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }

    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      throw new UnauthorizedError('Необходима авторизация');
    }

    const { avatar } = req.body;

    if (!avatar) {
      throw new BadRequestError('Переданы некорректные данные при обновлении аватара');
    }

    const user = await User.findByIdAndUpdate(
      authReq.user._id,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }

    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError('Email и пароль обязательны для входа');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    }

    const token = jwt.sign(
      { _id: user._id },
      'some-secret-key',
      { expiresIn: '7d' },
    );

    res.status(200).send({ token });
  } catch (err) {
    next(err);
  }
};
