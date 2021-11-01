const NftToken = require('../models/NftToken')

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

