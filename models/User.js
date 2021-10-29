const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const salt = 10;

const User = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true,
        maxlength: 100
    },
    lastname: {
        type: String,
        required: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        required: true,
    },
    password_repeat: {
        type: String,
        required: true,
    },
    walletAddress: {
        type: String,
        required: true,
    },
    models: {
        type: Schema.Types.ObjectId,
        ref: "Model"
    },
}, {timestamps: {createdAt: 'created_at'}});

User.pre('save', function (next) {
    const user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(salt, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                user.password_repeat = hash;
                next();
            })

        })
    } else {
        next();
    }
});

module.exports = mongoose.model('User', User);