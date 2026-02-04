import { Router } from 'express';
import {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} from '../controllers/cardController';

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', dislikeCard);

export default cardRouter;
