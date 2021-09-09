import {
  ERROR_CODE, ERROR_NOT_FOUND, STATUS_OK, ERROR_SERVER,
} from '../utils/constants';

const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_OK).send({ data: users }))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Внутренняя ошибка сервера' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((users) => res.status(STATUS_OK).send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(ERROR_SERVER).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.getUsersById = (req, res) => {
  User.findById(req.params.id)
    .then((users) => {
      res.status(STATUS_OK).send(users);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Такого пользователя нет' });
        return;
      }
      res.status(ERROR_SERVER).send({ message: `Внутренняя ошибка сервера: ${err}` });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Такого пользователя нет' });
      }
      return res.status(STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(ERROR_SERVER).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: `${req.body.avatar}` }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Такого пользователя нет' });
      }
      return res.status(STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(ERROR_SERVER).send({ message: 'Внутренняя ошибка сервера' });
    });
};
