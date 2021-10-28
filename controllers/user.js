const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const newUser = new User(req.body);

    if (newUser.password !== newUser.password_repeat)
        return res.status(403).json({message: "Passwords are not the same", severity: 'error'});

    User.findOne({email: newUser.email}, function (err, user) {
        if (user) return res.status(400).json({auth: false, message: "Email already used"});

        newUser.save((err, doc) => {
            if (err) {
                console.log(err);
                return res.status(400).json({success: false, message: "Invalid inputs"});
            }
            res.status(200).json({
                success: true,
                user: doc,
                message: "success"
            });
        });
    });
}

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({isAuth: false, message: 'Invalid Credentials'});
        }

        const isMatch = await bcrypt.compare(password, String(user.password));

        if (!isMatch) {
            return res.status(400).json({isAuth: false, message: 'Invalid Credentials'});
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        const userData = {
            _id: user.id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            createdAt: user.createdAt,
        };

        jwt.sign(payload, `${process.env.JWT_SECRET}`, {expiresIn: '3600m'}, async (err, token) => {
            if (err) {
                throw err;
            }

            const dateNow = Date.now();
            const expires = new Date(dateNow + 1000 * 60 * 3600);

            res.cookie('token', token, {
                expires,
                httpOnly: true,
                // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // must be 'none' to enable cross-site delivery
                sameSite: 'none', // must be 'none' to enable cross-site delivery
                secure: true, // must be true if sameSite='none'
            });

            res.json({userData, token, isAuth: true, expiresTime: String(Number(expires))});
        });
    } catch (error) {
        console.warn(error);
        res.status(500).json({errors: {msg: 'Server error', severity: 'error'}, isAuth: false});
    }
}

exports.profile = async (req, res) => {
    res.json({
        isAuth: true,
        id: req.user._id,
        email: req.user.email,
        name: req.user.firstname + req.user.lastname
    })
}

exports.logout = async (req, res) => {
    const {expires} = req.query;

    try {
        res.clearCookie('token', {
            expires: new Date(Number(expires)),
            httpOnly: true,
            // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // must be 'none' to enable cross-site delivery
            sameSite: 'none', // must be 'none' to enable cross-site delivery
            secure: true, // must be true if sameSite='none'
        });

        res.json({msg: 'Successfully logout'});
    } catch (error) {
        console.warn(error);
        return next(ApiError.internal('Server error'))
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users)
    } catch (err) {
        res.json({message: err})
    }
}

exports.addUser = async (req, res) => {
    const {
        username,
        firstname,
        lastname,
        email,
        password,
        model_id,
    } = req.body;

    const user = new User({
        username,
        firstname,
        lastname,
        email,
        password,
        model_id,
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
}

exports.getUserById = async (req, res) => {
    try {
        const findUser = await User.findById(req.params.userId);
        res.status(200).json(findUser)
    } catch (err) {
        res.status(400).json({message: err})
    }
}

exports.getUserByEmail = async (req, res) => {
    console.log('here too')
    try {
        const findUser = await User.findOne({email: req.params.email});
        return res.status(200).json(findUser);
    } catch (err) {
        console.log(err)
        return res.json({message: err})
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const deleteUser = await User.deleteOne({_id: req.params.userId});
        if (deleteUser) {
            const users = await User.find();
            res.json(users)
        }
    } catch (err) {
        res.json({message: err})
    }
}

exports.updateUser = async (req, res) => {
    const {userId} = req.params.id;
    try {
        const updateUser = await User.updateOne(
            {userId},
            {
                $set: req.body
            }
        );
        if (updateUser) {
            const user = await User.findOne({_id: req.params.userId});
            res.json(user)
        }
    } catch (err) {
        res.json({message: err})
    }
}

exports.updateUserModel = async (req, res) => {
    const {model} = req.body;
    try {
        const updateUser = await User.updateOne({_id: req.params.userId}, {
            $set: {
                model_id: model,
            }
        });
        if (updateUser) {
            const user = await User.findOne({_id: req.params.userId});
            res.status(200).json(user)
        }
    } catch (err) {
        res.json({message: err})
    }
}
