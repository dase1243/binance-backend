const User = require('../models/User');

module.exports = async function (req, res, next) {
    let token = req.cookies.auth;
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({
            error: true
        });

        req.token = token;
        req.user = user;
        next();
    })
}
