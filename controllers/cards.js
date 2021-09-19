const {
  STATUS_OK,
} = require('../utils/constants');

const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-error');

const Forbidden = require('../errors/forbidden-error');

const InvalidData = require('../errors/invalid-data');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res
      .status(STATUS_OK)
      .send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const {
    name,
    link,
  } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res
      .status(STATUS_OK)
      .send({ data: card }))
    .catch((err) => {
      if (err.name !== 'ValidationError') {
        next(new InvalidData(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const id = req.user._id;
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      if (card.owner.toString() !== id) {
        throw new Forbidden('Нет прав');
      }
      Card.findByIdAndRemove(req.params.id)
        .then((deletedCard) => {
          res.status(STATUS_OK)
            .send({ data: deletedCard });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Нет карточки с таким id');
    }
    res.status(STATUS_OK)
      .send({ data: card });
  })
  .catch((err) => next(err));

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Нет карточки с таким id');
    }
    res.status(STATUS_OK)
      .send({ data: card });
  })
  .catch((err) => next(err));
