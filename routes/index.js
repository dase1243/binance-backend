const userRoutes = require('./user');
const modelRoutes = require('./model');
const nftTokenRoutes = require('./nft_token');

function routes(app) {
    app.use('/api/user/', userRoutes);
    app.use('/api/model/', modelRoutes);
    app.use('/api/nft_token/', nftTokenRoutes);
}

module.exports = {routes};
