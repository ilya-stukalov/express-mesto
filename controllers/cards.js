import {
  ERROR_CODE, ERROR_NOT_FOUND, STATUS_OK, ERROR_SERVER,
} from '../utils/constants';

const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(STATUS_OK).send({ data: cards }))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Ошибка сервера' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(ERROR_SERVER).send({ message: 'Ошибка сервера' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      res.status(STATUS_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Такой карточки нет' });
        return;
      }
      res.status(ERROR_SERVER).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    res.status(STATUS_OK).send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      return;
    }
    res.status(ERROR_SERVER).send({ message: 'Внутренняя ошибка сервера' });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    res.status(STATUS_OK).send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      return;
    }
    res.status(ERROR_SERVER).send({ message: 'Внутренняя ошибка сервера' });
  });
