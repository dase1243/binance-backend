const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const salt = 10;

const userSchema = mongoose.Schema({
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
    token: {
        type: String
    },
    model_id: {
        type: String,
        required: true
    },
    printed: {
        type: Boolean,
        required: true
    }
}, {timestamps: {createdAt: 'created_at'}});

userSchema.pre('save', function (next) {
    const user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(salt, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                user.password2 = hash;
                next();
            })

        })
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) return cb(next);
        cb(null, isMatch);
    });
}

userSchema.methods.generateToken = function (cb) {
    const user = this;
    user.token = jwt.sign(user._id.toHexString(), process.env.SECRET);
    user.save(function (err, user) {
        if (err) return cb(err);
        cb(null, user);
    })
}

userSchema.statics.findByToken = function (token, cb) {
    const user = this;

    jwt.verify(token, process.env.SECRET, function (err, decode) {
        user.findOne({"_id": decode, "token": token}, function (err, user) {
            if (err) return cb(err);
            cb(null, user);
        })
    })
};

userSchema.methods.deleteToken = function (token, cb) {
    const user = this;

    user.update({$unset: {token: 1}}, function (err, user) {
        if (err) return cb(err);
        cb(null, user);
    })
}

module.exports = mongoose.model('User', userSchema);