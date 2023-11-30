const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');


mongoose
  .connect(`${process.env.DB}`, {
    useNewUrlParser: true,
  }).then(() => console.log('CONNECTED TO MONGODB'));

const app = express();

app.use(cors());
app.use(express.json());
app.use(errors());
app.use(cookieParser());
app.use(router);
app.use(errors());
app.use(errorHandler);



app.listen(process.env.PORT);