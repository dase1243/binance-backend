const express = require('express');
const nft_token = require('../controllers/nft_token')
const router = express.Router();
const {auth} = require('../middleware/auth');

router.post('/create', auth, nft_token.create)

router.get('/getByModelId/:modelId', auth, nft_token.getByModelId)

router.get('/getSmartContractInfo/:modelId', auth, nft_token.getSmartContractInfo);

router.get('/getAllNftsByUserId/:userId', auth, nft_token.getAllNftsByUserId);

router.get('/getAllNftsByUserEmail/:userEmail', auth, nft_token.getAllNftsByUserEmail);

module.exports = router;