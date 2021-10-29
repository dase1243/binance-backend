const express = require('express');
const model = require('../controllers/model')
const router = express.Router();
const {auth} = require('../middleware/auth');

router.post('/getAll', auth, model.getAll);

router.get('/getSmartContractInfo/:modelId', model.getSmartContractInfo);

router.post('/getById/:_id', auth, model.getById);

router.get('/getByUserId/:userId', auth, model.getByUserId)

router.post('/create/:userId', auth, model.create)

router.post('/update', auth, model.update)

module.exports = router;