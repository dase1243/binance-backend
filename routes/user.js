const express = require('express');
const User = require('../models/User');
const router = express.Router();
const {auth} = require('../middleware/auth');
const user = require('../controllers/user');

router.post('/register', user.register);

router.post('/login', user.login);

router.get('/getAllUsers', auth, user.getAllUsers)

router.post('/addUser', auth, user.addUser)

router.get('/getUserById/:userId', auth, user.getUserById)

router.get('/getUserByEmail/:email', auth, user.getUserByEmail)

router.delete('/deleteUser/:userId', auth, user.deleteUser)

router.post('/updateUser/:userId', auth, user.updateUser)

router.post('/updateUserModel/:userId', auth, user.updateUserModel)

router.post('/updateUserTokenAmount/:userId', auth, user.updateUserTokenAmount)

router.get('/profile', auth, user.profile);

router.get('/logout', auth, user.logout);

module.exports = router;