const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'SECRET_KEY';

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('http2').constants;

const userModel = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const login = (req, res, next) => {
  const { email, password } = req.body;
  userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      }).send({ token });
    })
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      userModel.create({
        email,
        password: hash,
        name,
      }).then((data) => {
        res.status(HTTP_STATUS_CREATED).send({
          email: data.email,
          name: data.name,
          _id: data._id,
        });
      }).catch((err) => {
        if (err.name === 'ValidationError') {
          return next(new BadRequestError('Передан некорректные данные'));
        }
        if (err.code === 11000) {
          return next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
        }
        return next(err);
      });
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  userModel.findById(userId)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return next(err);
    });
};

const updateUserById = (req, res, next) => {
  const { name, email } = req.body;
  const id = req.user._id;
  userModel.findByIdAndUpdate(
    id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new Error('NotFoundError');
    })
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      }
      if (err.message === 'NotFoundError') {
        return next(new NotFoundError('Пользователь не найден'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Передан некорректные данные'));
      }
      return next(err);
    });
};

module.exports = {
  login,
  createUser,
  getCurrentUser,
  updateUserById,
};
