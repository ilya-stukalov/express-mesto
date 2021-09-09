/* const fs = require('fs');
 */

const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

/* const path = require('path'); */

const { PORT = 3000 } = process.env;

const app = express();

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

// Подключение к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
});

/* app.use(express.static(path.join(__dirname, 'public'))); */

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
