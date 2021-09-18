const express = require('express');

const rateLimit = require('express-rate-limit');

const app = express();

const cookieParser = require('cookie-parser');

app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 1000, // можно совершить максимум 100 запросов с одного IP
});

app.use(limiter);

const mongoose = require('mongoose');

const {
  dbOptions,
} = require('./utils/constants');

const { PORT = 3000 } = process.env;

const bodyParser = require('body-parser');

const {
  celebrate,
  Joi,
  errors,
} = require('celebrate');

const auth = require('./middlewares/auth');

const {
  createUser,
  login,
} = require('./controllers/users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.post('/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      avatar: Joi.string().required().regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
    }),
  }),
  createUser);

app.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }), login);

app.use(auth);

app.use('/', require('./routes/users'));

app.use('/', require('./routes/cards'));

app.use('*', require('./routes/otherRoutes'));

mongoose.connect('mongodb://localhost:27017/mestodb', dbOptions);

app.use(errors());

app.use((err, req, res, next) => {
  const {
    statusCode = 500,
    message,
  } = err;

  if (err.kind === 'ObjectId') {
    res.status(400)
      .send({
        message: 'Неверно переданы данные',
      });
  } else {
    res
      .status(statusCode)
      .send({
        // проверяем статус и выставляем сообщение в зависимости от него
        message: statusCode === 500
          ? 'На сервере произошла ошибка'
          : message,
      });
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
