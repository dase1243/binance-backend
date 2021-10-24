const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/user');
const modelRoute = require('./routes/model');
const cors = require('cors')
const User = require('./models/User');
const {auth} = require('./auth');
require('dotenv/config');

//Middlewares
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/user', userRoute);
app.use('/category', modelRoute);

//Connect DB
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log('db connected');
})

app.get('/', function (req, res) {
    res.status(200).send(`Welcome to login , sign-up api`);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`API is running on port ${port}`);
});

app.post('/api/register', function (req, res) {
    // taking a user
    const newUser = new User(req.body);
    console.log(newUser)

    if (newUser.password !== newUser.password_repeat) return res.status(400).json({message: "passwords don't match"});

    User.findOne({email: newUser.email}, function (err, user) {
        if (user) return res.status(400).json({auth: false, message: "email exits"});

        newUser.save((err, doc) => {
            if (err) {
                console.log(err);
                return res.status(400).json({success: false});
            }
            res.status(200).json({
                success: true,
                user: doc
            });
        });
    });
});

app.post('/api/login', function (req, res) {
    let token = req.cookies.auth;
    User.findByToken(token, (err, user) => {
        if (err) return res(err);
        if (user) return res.status(400).json({
            error: true,
            message: "You are already logged in"
        });

        else {
            User.findOne({'email': req.body.email}, function (err, user) {
                if (!user) return res.json({isAuth: false, message: ' Auth failed ,email not found'});

                user.comparePassword(req.body.password, (err, isMatch) => {
                    if (!isMatch) return res.json({isAuth: false, message: "passwords does match"});

                    user.generateToken((err, user) => {
                        if (err) return res.status(400).send(err);
                        res.cookie('auth', user.token).json({
                            isAuth: true,
                            id: user._id
                            , email: user.email
                        });
                    });
                });
            });
        }
    });
});

app.get('/api/profile', auth, function (req, res) {
    res.json({
        isAuth: true,
        id: req.user._id,
        email: req.user.email,
        name: req.user.firstname + req.user.lastname
    })
});

app.get('/api/logout', auth, function (req, res) {
    req.user.deleteToken(req.token, (err, user) => {
        if (err) return res.status(400).send(err);
        res.sendStatus(200);
    });
});
