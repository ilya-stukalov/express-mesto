const express = require('express');

const rateLimit = require('express-rate-limit');

const app = express();

const cookieParser = require('cookie-parser');

app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

app.use(limiter);

const helmet = require('helmet');

app.use(helmet());

const mongoose = require('mongoose');

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
      avatar: Joi.string().regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
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

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(errors());

app.use((err, req, res, next) => {
  const {
    statusCode = 500,
    message,
  } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
