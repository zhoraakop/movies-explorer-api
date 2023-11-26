const router = require('express').Router();

const auth = require('../middlewares/auth');

const { login, createUser } = require('../controllers/users');
const users = require('./user');
const movies = require('./movie');
const { validationCreateUser, validationLog } = require('../middlewares/validation');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLog, login);

router.use(auth);
router.use('/users', users);
router.use('/movies', movies);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
