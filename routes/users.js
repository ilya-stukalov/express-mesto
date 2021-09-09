const router = require('express').Router();

const { getUsers, createUser, getUsersById, updateUserInfo, updateUserAvatar } = require('../controllers/users');

// GET запрос для получения Users
router.get('/users', getUsers);

// GET запрос для получения User по id
router.get('/users/:id', getUsersById);

// POST запрос для создания User
router.post('/users', createUser);

// to do:
router.patch('/users/me', updateUserInfo);

// to do:
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
