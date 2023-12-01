const router = require('express').Router();

const {
  updateUserById,
  getCurrentUser,
} = require('../controllers/users');
const { validationUpdateInfo } = require('../middlewares/validation');

router.get('/me', getCurrentUser);
router.patch('/me', validationUpdateInfo, updateUserById);

module.exports = router;
