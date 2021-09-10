const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

/* const path = require('path'); */
const {
  dbOptions,
} = require('./utils/constants');

const { PORT = 3000 } = process.env;

app.use((req, res, next) => {
  req.user = {
    _id: '61366e3e4aa070723f2782a7',
  };
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use('/', require('./routes/users'));

app.use('/', require('./routes/cards'));

app.use('*', require('./routes/otherRoutes'));

// Подключение к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', dbOptions);

/* app.use(express.static(path.join(__dirname, 'public'))); */

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
