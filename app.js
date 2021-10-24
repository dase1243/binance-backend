const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/user');
const modelRoute = require('./routes/model');
const cors = require('cors')
require('dotenv/config');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

//Middlewares
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/user', userRoute);
app.use('/category', modelRoute);
const {routes} = require('./routes');

//Connect DB
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log('db connected');
})
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.get('/', function (req, res) {
    res.status(200).send(`Welcome to server api`);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`API is running on port ${port}`);
});

routes(app);