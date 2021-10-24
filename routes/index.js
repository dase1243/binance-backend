const userRoutes = require('./user');
const modelRoutes = require('./model');

function routes(app) {
  app.use('/api', userRoutes);
  app.use('/api', modelRoutes);
}

module.exports = { routes };
