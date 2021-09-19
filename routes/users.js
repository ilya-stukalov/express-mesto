const router = require('express')
  .Router();

const {
  celebrate,
  Joi,
} = require('celebrate');

const {
  getUsers,
  getUsersById,
  updateUserInfo,
  updateUserAvatar,
  getInfoAboutMe,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', getInfoAboutMe);

router.patch('/users/me',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string()
          .min(2)
          .max(30)
          .required(),
        about: Joi.string()
          .min(2)
          .max(30)
          .required(),
      }),
  }), updateUserInfo);

router.patch('/users/me/avatar',
  celebrate({
    body: Joi.object()
      .keys({
        avatar: Joi.string()
          .required()
          .regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
      }),
  }), updateUserAvatar);

router.get('/users/:id',
  celebrate({
    params: Joi.object()
      .keys({
        id: Joi.string()
          .length(24)
          .hex(),
      }),
  }), getUsersById);

module.exports = router;
