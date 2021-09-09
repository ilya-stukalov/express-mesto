const router = require('express').Router();

const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

// GET запрос для получения Cards
router.get('/cards', getCards);

// POST запрос для создания Card
router.post('/cards', createCard);

router.delete('/cards/:id', deleteCard);

router.put('/cards/:cardId/likes', likeCard);

router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
