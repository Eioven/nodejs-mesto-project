import { Router } from 'express';
import {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} from '../controllers/cardController';
import { auth } from '../middlewares/auth';

const cardRouter = Router();

cardRouter.get('/', auth, (req, res, next) => getCards(req, res, next));
cardRouter.post('/', auth, (req, res, next) => createCard(req, res, next));
cardRouter.delete('/:cardId', auth, (req, res, next) => deleteCard(req, res, next));
cardRouter.put('/:cardId/likes', auth, (req, res, next) => likeCard(req, res, next));
cardRouter.delete('/:cardId/likes', auth, (req, res, next) => dislikeCard(req, res, next));

export default cardRouter;
