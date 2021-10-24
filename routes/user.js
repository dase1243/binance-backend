const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/getUser', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users)
    } catch (err) {
        res.json({message: err})
    }
})

router.post('/addUser', async (req, res) => {
    const {
        username,
        firstname,
        lastname,
        email,
        password,
        password_repeat,
        token,
        model_id,
        printed
    } = req.body;

    const user = new User({
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        password_repeat: password_repeat,
        token: token,
        model_id: model_id,
        printed: printed
    });

    try {
        const savedUser = await user.save();
        if (savedUser) {
            const users = await User.find();
            res.json(users)
        }
    } catch (err) {
        res.json({message: err})
    }
})

router.get('/:userId', async (req, res) => {
    try {
        const findUser = await User.findById(req.params.userId);
        res.json(findUser)
    } catch (err) {
        res.json({message: err})
    }
})


router.delete('/deleteUser/:userId', async (req, res) => {
    try {
        const deleteUser = await User.deleteOne({_id: req.params.userId});
        if (deleteUser) {
            const users = await User.find();
            res.json(users)
        }
    } catch (err) {
        res.json({message: err})
    }
})

router.patch('/updateUser/:userId', async (req, res) => {
    const {username, model_id, printed} = req.body;
    try {
        const updateUser = await User.updateOne({_id: req.params.userId}, {
            $set: {
                username: username,
                model_id: model_id,
                printed: printed
            }
        });
        if (updateUser) {
            const users = await User.find();
            res.json(users)
        }
    } catch (err) {
        res.json({message: err})
    }
})

module.exports = router;