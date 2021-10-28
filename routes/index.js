const userRoutes = require('./user');
const modelRoutes = require('./model');

function routes(app) {
  app.use('/api/user', userRoutes);
  app.use('/api/model/', modelRoutes);
}

module.exports = { routes };
