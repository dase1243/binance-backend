const NftToken = require('../models/NftToken')
const axios = require("express/lib/request");
const User = require('../models/User');
const moralis = require('moralis/node');
const http = require("express/lib/request");
const request = require('request-promise');

exports.create = async (req, res) => {
    const {name, model_id, description, image_uri, token_id} = req.body

    try {
        const createdNftToken = await NftToken.create({
            name, model_id, description, image_uri, token_id
        })

        res.json(createdNftToken)
    } catch (e) {
        console.log("Couldn't create NFT token object")
        return res.json({
            error: true,
            message: e
        })
    }
}

exports.getByModelId = async (req, res) => {
    try {
        const findNftToken = await NftToken.findOne({
            model_id: req.params.modelId
        })

        if (!findNftToken) {
            return res.status(400).json({success: false, message: "No NFT Token with such model_id"});
        }

        res.json(findNftToken)
    } catch (e) {
        console.log("Couldn't retrieve NFT Toekn by model_id")
        return res.json({
            error: true,
            message: e
        })
    }
}

exports.getSmartContractInfo = async (req, res) => {
    const findNftToken = await NftToken.findOne({
        model_id: req.params.modelId
    })

    if (!findNftToken) {
        return res.status(400).json({success: false, message: "No NFT Token with such model_id"});
    }

    return res.json({
        image: findNftToken.image_uri,
        description: findNftToken.description,
        name: findNftToken.name
    })
}


exports.getAllNftsByUserId = async (req, res) => {
    const findUser = await User.findById(req.params.userId).populate('models');

    if (!findUser) {
        return res.status(400).json({success: false, message: "No user with such id"});
    }

    const nftAddress = process.env.NFT_CONTRACT_ADDR;

    const bscNFTs = await getNfts(findUser.walletAddress, nftAddress);

    res.json(bscNFTs)
}

exports.getAllNftsByUserEmail = async (req, res) => {
    console.log('Inside getAllNftsByUserEmail')
    const findUser = await User.findOne({email: req.params.userEmail}).populate('models');
    if (!findUser) {
        return res.status(400).json({success: false, message: "No user with such email"});
    }

    const nftAddress = process.env.NFT_CONTRACT_ADDR;

    const bscNFTs = await getNfts(findUser.walletAddress, nftAddress);

    let list = []
    const nfts = await bscNFTs.result.map(async (nft) => {
        let url = nft.token_uri;

        await request(url, {json: true})
            .then(async (res) => {
                nft.token_description = res.description
                nft.token_image = res.image
                nft.token_name = res.name
                return nft
            })

        list.push(nft)
    });

    await Promise.all(nfts)

    res.json(list)
}

async function getNfts(playerAddr, nftContractAddr) {
    const options = {chain: 'bsc testnet', address: playerAddr, token_address: nftContractAddr};
    return await moralis.Web3API.account.getNFTsForContract(options);
}
