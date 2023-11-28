const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('http2').constants;

const movieModel = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovies = (req, res, next) => {
  movieModel.find({ 'owner': req.user._id })
    .then((movies) => res.status(HTTP_STATUS_OK).send(movies))
    .catch((err) => next(err));
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  movieModel.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    owner: req.user._id,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(HTTP_STATUS_CREATED).send(movie))
    .catch((err) => {
      if (err.name === 'Validationerr') {
        next(new BadRequestError(`Переданы некорректные данные`));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  movieModel.findById(movieId)
    .orFail(() => new NotFoundError('Фильм с указанным id не существует'))
    .then((movie) => {
      if (movie && req.user._id !== movie.owner.toString()) {
        next(new ForbiddenError('Нельзя удалить фильм другого пользователя'));
      } else {
        movieModel.findByIdAndDelete(movieId)
          .then((deletedMovie) => res.status(HTTP_STATUS_OK).send(deletedMovie))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Удаление фильма с некорректным id'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createMovie,
  deleteMovie,
  getMovies,
}