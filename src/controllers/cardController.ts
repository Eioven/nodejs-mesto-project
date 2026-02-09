import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import { AuthRequest } from '../middlewares/auth';
import { NotFoundError, ForbiddenError } from '../middlewares/errorHandler';

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const authReq = req as AuthRequest;
    const card = await Card.create({
      name,
      link,
      owner: authReq.user!._id,
    });
    res.status(201).send(card);
  } catch (err) {
    next(err);
  }
};

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const authReq = req as AuthRequest;
    const card = await Card.findById(cardId);

    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    }

    if (card.owner.toString() !== authReq.user!._id) {
      throw new ForbiddenError('Вы можете удалить только свою карточку');
    }

    await Card.findByIdAndDelete(cardId);
    res.send({ message: 'Карточка удалена' });
  } catch (err) {
    next(err);
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: authReq.user!._id } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    res.send(card);
  } catch (err) {
    next(err);
  }
};

export const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: authReq.user!._id } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    res.send(card);
  } catch (err) {
    next(err);
  }
};
