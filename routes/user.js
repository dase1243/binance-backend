const express = require('express');
const User = require('../models/User');
const router = express.Router();
const {auth} = require('../middleware/auth');
const user = require('../controllers/user');

router.get('/getAllUsers', auth, user.getAllUsers)

router.post('/addUser', auth, user.addUser)

router.get('/:userId', auth, user.getUserById)

router.post('/:email', auth, user.getUserByEmail)

router.delete('/deleteUser/:userId', auth, user.deleteUser)

router.patch('/updateUser/:userId', auth, user.updateUser)

router.patch('/updateUserModel/:userId', auth, user.updateUserModel)

router.post('/register', user.register);

router.post('/login', user.login);

router.get('/profile', auth, user.profile);

router.get('/logout', auth, user.logout);

module.exports = router;