const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const NotFoundError = require('../errors/not-found-error');

const NotAuthError = require('../errors/not-auth-error');

const UserExistError = require('../errors/user-exist-error');

const InvalidData = require('../errors/invalid-data');

const {
  STATUS_OK,
} = require('../utils/constants');

const User = require('../models/user');

module.exports.getInfoAboutMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(STATUS_OK)
        .send(user);
    })
    .catch((err) => next(err));
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res
      .status(STATUS_OK)
      .send({ data: users }))
    .catch((err) => next(err));
};
// TO DO: не возвращает ошибку о том, что пользователь уже есть
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((users) => {
      res.status(STATUS_OK)
        .send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        throw new UserExistError('Пользователь с таким email существует');
      }
      if (err.name === 'ValidationError') {
        throw new InvalidData(err.message);
      }
    })
    .catch(next);
};

module.exports.getUsersById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(STATUS_OK)
        .send(user);
    })
    .catch((err) => next(err));
};

module.exports.updateUserInfo = (req, res, next) => {
  const {
    name,
    about,
  } = req.body;
  User.findByIdAndUpdate(req.user._id, {
    name,
    about,
  }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(STATUS_OK)
        .send({ data: user });
    })
    .catch((err) => next(err));
};

module.exports.updateUserAvatar = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(token);
  User.findByIdAndUpdate(req.user._id, { avatar: `${req.body.avatar}` }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(STATUS_OK)
        .send({ data: user });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;
  // TO DO: как импортнуть
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '1h' });
      res
        .cookie('jwt', token, {
          // token - наш JWT токен, который мы отправляем
          maxAge: 3600000,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => {
      throw new NotAuthError(err.message);
    })
    .catch(next);
};
