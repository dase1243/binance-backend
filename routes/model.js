const express = require('express');
const model = require('../controllers/model')
const router = express.Router();
const {auth} = require('../middleware/auth');

router.get('/getAll', auth, model.getAll);

router.get('/getSmartContractInfo/:modelId', model.getSmartContractInfo);

router.get('/getById/:modelId', auth, model.getById);

router.get('/getByUserId/:userId', auth, model.getByUserId)

router.get('/getModelIdByUserId/:userId', auth, model.getModelIdByUserId)

router.get('/getModelByUserId/:userId', auth, model.getModelByUserId)

router.post('/create/:userId', auth, model.create)

router.post('/uploadTokenImage/:modelId', auth, model.uploadTokenImage)

router.post('/update', auth, model.update)

module.exports = router;