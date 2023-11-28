const { celebrate, Joi, Segments } = require('celebrate');
const validator = require('validator');

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
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле image не является ссылкой');
    }),
    trailerLink: Joi.string().required(),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле thumbnail не является ссылкой');
    }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    owner: Joi.string().required(),
  },
});

const validationDeleteMovie = celebrate({
  [Segments.PARAMS]: {
    movieId: Joi.string().hex().length(24),
  },
});

module.exports = {
  validationDeleteMovie,
  validationCreateMovie,
  validationCreateUser,
  validationLog,
  validationUpdateInfo,
};
