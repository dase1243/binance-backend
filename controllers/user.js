const User = require('../models/User');

exports.register = async (req, res) => {
    const newUser = new User(req.body);
    console.log(newUser)

    if (newUser.password !== newUser.password_repeat) return res.status(400).json({message: "passwords don't match"});

    User.findOne({email: newUser.email}, function (err, user) {
        if (user) return res.status(400).json({auth: false, message: "Email already used"});

        newUser.save((err, doc) => {
            if (err) {
                console.log(err);
                return res.status(400).json({success: false, message: err});
            }
            res.status(200).json({
                success: true,
                user: doc
            });
        });
    });
}

exports.login = async (req, res) => {
    let token = req.cookies.auth;
    User.findByToken(token, (err, user) => {
        if (err) return res(err);
        if (user) return res.status(200).json({
            error: false,
            message: "You are already logged in",
            token: token,
        });

        else {
            User.findOne({'email': req.body.email}, function (err, user) {
                if (!user) return res.json({isAuth: false, message: 'Auth failed, email not found'});

                user.comparePassword(req.body.password, (err, isMatch) => {
                    if (!isMatch) return res.json({isAuth: false, message: "Passwords don't match"});

                    user.generateToken((err, user) => {
                        if (err) return res.status(400).send(err);
                        res.cookie('auth', user.token).json({
                            isAuth: true,
                            id: user._id,
                            email: user.email,
                            token: token
                        });
                    });
                });
            });
        }
    });
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
    req.user.deleteToken(req.token, (err, user) => {
        if (err) return res.status(400).send(err);
        res.sendStatus(200);
    });
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
}

exports.getUserById = async (req, res) => {
    try {
        const findUser = await User.findById(req.params.userId);
        res.json(findUser)
    } catch (err) {
        res.json({message: err})
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
}
