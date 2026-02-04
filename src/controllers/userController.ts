import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: 'Ошибка по умолчанию' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
    }
    return res.status(200).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: 'Передан некорректный _id пользователя' });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  try {
    const user = await User.create({ name, about, avatar });
    return res.status(201).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  const { name, about } = req.body;

  if (!name || !about) {
    return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
    }

    return res.status(200).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: 'Передан некорректный _id пользователя' });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию' });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  const { avatar } = req.body;

  if (!avatar) {
    return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
    }

    return res.status(200).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    }
    if (err instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: 'Передан некорректный _id пользователя' });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию' });
  }
};
