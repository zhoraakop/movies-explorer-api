const router = require('express').Router();

const auth = require('../middlewares/auth');

const { login, createUser, logout } = require('../controllers/users');
const users = require('./user');
const movies = require('./movie');
const { validationCreateUser, validationLog } = require('../middlewares/validation');
const NotFoundError = require('../errors/NotFoundError');

router.post('/api/signup', validationCreateUser, createUser);
router.post('/api/signin', validationLog, login);
router.post('/api/signout', logout);

router.use(auth);
router.use('/api/users', users);
router.use('/api/movies', movies);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
