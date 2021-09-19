const router = require('express')
  .Router();

const {
  celebrate,
  Joi,
} = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string()
          .required()
          .min(2)
          .max(30),
        link: Joi.string()
          .required()
          .regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
      }),
  }),
  createCard);

router.delete('/cards/:id',
  celebrate({
    params: Joi.object()
      .keys({
        id: Joi.string()
          .length(24)
          .hex(),
      }),
  }), deleteCard);

router.put('/cards/:cardId/likes',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string()
          .length(24)
          .hex(),
      }),
  }),
  likeCard);

router.delete('/cards/:cardId/likes',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string()
          .length(24)
          .hex(),
      }),
  }), dislikeCard);

module.exports = router;
