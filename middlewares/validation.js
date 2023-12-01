const { celebrate, Joi, Segments } = require('celebrate');

const url = /\b(https?):\/\/(www\.)?[-A-Za-z0-9-._~:/?#[\]@!$&'()*+,;=]+\.([a-z]{2,6})+(\/[-A-Za-z0-9-._~:/?#[\]@!$&'()*+,;=]*)*/;

const validationLog = celebrate({
  [Segments.BODY]: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
});

const validationCreateUser = celebrate({
  [Segments.BODY]: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  },
});

const validationUpdateInfo = celebrate({
  [Segments.BODY]: {
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  },
});

const validationCreateMovie = celebrate({
  [Segments.BODY]: {
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(url),
    trailerLink: Joi.string().required().pattern(url),
    thumbnail: Joi.string().required().pattern(url),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  },
});

const validationDeleteMovie = celebrate({
  [Segments.PARAMS]: {
    movieId: Joi.string().hex().length(24).required(),
  },
});

module.exports = {
  validationDeleteMovie,
  validationCreateMovie,
  validationCreateUser,
  validationLog,
  validationUpdateInfo,
};
