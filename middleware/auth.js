const User = require('../models/User');
const jwt = require('jsonwebtoken');

const {JWT_SECRET} = process.env;

exports.auth = async function (req, res, next) {
    const unity_password = req.body.unity_password;

    if (unity_password && unity_password === process.env.UNITY_PASSWORD) {
        next()
    } else {
        let token = req.cookies.auth;
        User.findOne({token}, (err, user) => {
            if (err) throw err;
            if (!user) return res.json({
                error: true,
                message: "Auth failed"
            });

            req.token = token;
            req.user = user;
            next();
        })
    }
}

exports.cookieJwtAuth = async (req, res, next) => {
    const {token} = req.cookies;

    if (!token) {
        return res.status(401).json({errors: {msg: 'No token, authorization denied', severity: 'error'}});
    }

    try {
        const decoded = jwt.verify(token, `${JWT_SECRET}`);

        req.user = (decoded).user;

        next();
    } catch (error) {
        res.clearCookie('token');

        res.status(401).json({errors: {msg: 'Token is not valid', severity: 'error'}});
    }
};