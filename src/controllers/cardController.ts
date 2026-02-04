import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';

export const createCard = async (req: Request, res: Response) => {
  const { name, link } = req.body;

  if (!req.user) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  try {
    const card = await Card.create({
      name,
      link,
      owner: req.user.id,
    });
    return res.status(201).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию' });
  }
};

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    res.status(500).send({ message: 'Ошибка по умолчанию' });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;

    if (!req.user) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
    }

    if (card.owner.toString() !== req.user.id) {
      return res.status(403).send({ message: 'Forbidden: You can only delete your own cards' });
    }

    await Card.findByIdAndDelete(cardId);
    return res.status(200).send({ message: 'Card deleted successfully' });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: 'Передан некорректный _id карточки' });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию' });
  }
};

export const likeCard = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user.id } },
      { new: true },
    );

    if (!card) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }

    return res.status(200).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: 'Передан некорректный _id карточки' });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию' });
  }
};

export const dislikeCard = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user.id } },
      { new: true },
    );

    if (!card) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }

    return res.status(200).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: 'Передан некорректный _id карточки' });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию' });
  }
};
