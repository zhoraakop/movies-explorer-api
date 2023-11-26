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
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(url),
  },
});

const validationUpdateInfo = celebrate({
  [Segments.BODY]: {
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  },
});

const validationCreateMovie = celebrate({
  [Segments.BODY]: {
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(url).required(),
  },
});

const validationMovieId = celebrate({
  [Segments.PARAMS]: {
    cardId: Joi.string().length(24).hex().required(),
  },
});

module.exports = {
  validationMovieId,
  validationCreateMovie,
  validationCreateUser,
  validationLog,
  validationUpdateInfo,
};
