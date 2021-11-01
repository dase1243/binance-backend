const Model = require('../models/Model');
const User = require('../models/User');
const path = require('path')
const fs = require('fs');
const {ref, getStorage, uploadBytes, getDownloadURL} = require("firebase/storage");
const {initializeApp} = require("firebase/app");

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

const firebaseApp = initializeApp(firebaseConfig);

exports.getAll = async (req, res) => {
    return res.json(await Model.find())
}

exports.getSmartContractInfo = async (req, res) => {
    const model = await Model.findOne({_id: req.params.modelId});
    if (!model) {
        return res.status(400).json({success: false, message: "No model with such id"});
    }
    return res.json({
        image: model.base_image,
        description: model.description,
        name: model.name
    })
}

exports.getById = async (req, res) => {
    const _id = req.params.modelId;

    let model = await Model.findOne({_id}).populate("user");
    if (!model) {
        return res.status(400).json({success: false, message: "No model with such id"});
    }

    return res.json({model, success: true})
}

const saveFile = async (file, filename) => {
    try {
        const fileName = filename + path.extname(file.name);
        if (!fs.existsSync(path.resolve('static'))) {
            fs.mkdirSync('static');
        }
        const filePath = path.resolve('static', fileName);
        await file.mv(filePath);
        return fileName;
    } catch (e) {
        console.log(e)
    }
}

async function getByteArray(filePath) {
    let fileData = await fs.readFileSync(filePath).toString('hex');
    let result = []
    for (let i = 0; i < fileData.length; i += 2)
        result.push('0x' + fileData[i] + '' + fileData[i + 1])
    return result;
}

async function storeImageAtFireStorage(fileName) {
    const storage = getStorage(firebaseApp, "gs://binance-hack-c03b1");
    console.log('storage is created')

    console.log('fileName: ', fileName)
    const tempImageStorage = ref(storage, fileName);
    const metadata = {
        contentType: `image/${path.extname(fileName)}`,
    };

    let filePath = path.resolve('static', fileName);
    console.log('FilePath: ', filePath)

    let byteArray = await getByteArray(filePath);
    console.log('File converted to bytes')

    try {
        await uploadBytes(tempImageStorage, new Uint8Array(byteArray), metadata)
            .then((snapshot) => {
                console.log(`Image ${fileName} is uploaded!`);
            })

        return await getDownloadURL(ref(storage, fileName))
            .then(async (url) => {
                console.log(`Image Download URL ${url} is generated!`);
                return url
            })
            .catch((error) => {
                console.log(error)
            });
    } catch (e) {
        console.log(`Image ${fileName} wasn\'t uploaded! Upload had error ${e}`);
        throw Error(e);
    }
}

exports.createWithBaseImage = async (req, res) => {
    console.log('Inside createWithBaseImage')
    try {
        console.log('Inside create')
        const {userId} = req.params;
        const user = await User.findOne({_id: userId})

        console.log('user: ', user)

        // for removing and replacing old ones
        const createdModels = await Model.find({user: user._id})
        // console.log('created models: ', createdModels)

        if (createdModels.length !== 0) {
            let modelCreated;
            for (let i = 0; i < createdModels.length; i++) {
                modelCreated = createdModels[i]
                modelCreated.remove()
            }
        }

        let model = await Model.create({
            ...req.body,
            name: req.body.name.split(' ').join('_'),
            base_image: 'empty',
            nft_image: 'empty',
            user
        });

        try {
            let fileName = await saveFile(req.files.image, model._id + "-base");

            model.base_image = await storeImageAtFireStorage(fileName)

            // console.log('Model after fileStorage: ', model)

            await model.save();

            return res.json(model)
        } catch (e) {
            console.log("Couldn't store file at Fire Storage")
            model.remove()
            return res.json({
                error: true,
                message: e
            })
        }
    } catch (e) {
        console.log(e)
        return res.json({
            error: true,
            message: e
        })
    }
}

exports.uploadNftTokenImage = async (req, res) => {
    console.log('Inside uploadNftTokenImage')
    const {modelId} = req.params;

    const model = await Model.findOne({_id: modelId})

    if (!model) {
        return res.status(400).json({success: false, message: "No models with such id"});
    }


    try {
        console.log('req.files.image: ', req.files.image)
        let fileName = await saveFile(req.files.image, modelId + "-nft");

        try {
            model.nft_image = await storeImageAtFireStorage(fileName)

            console.log('Model after fileStorage: ', model)

            await model.save();

            return res.json(model)
        } catch (e) {
            console.log("Couldn't store file at Fire Storage")
            model.remove()
            return res.json({
                error: true,
                message: e
            })
        }
    } catch (e) {
        console.log(e)
        return res.json({
            error: true,
            message: e
        })
    }
}

exports.getByUserId = async (req, res) => {
    console.log('req.params: ', req.params)
    const {userId} = req.params;
    const user = await User.findOne({_id: userId}).populate('Model');

    if (!user) {
        return res.status(400).json({success: false, message: "No user with such id"});
    }

    const model = await Model.findOne({user: user._id})

    if (!model) {
        return res.status(400).json({success: false, message: "No models for such user"});
    }

    return res.json(model);
}

exports.getModelIdByUserId = async (req, res) => {
    const {userId} = req.params;
    const user = await User.findOne({_id: userId}).populate('Model');

    if (!user) {
        return res.status(400).json({success: false, message: "No user with such id"});
    }

    const model = await Model.findOne({user: user._id})

    if (!model) {
        return res.status(400).json({success: false, message: "No models for such user"});
    }

    return res.json({modelId: model._id});
}

exports.getModelByUserId = async (req, res) => {
    console.log('here')
    const {userId} = req.params;
    const user = await User.findOne({_id: userId});

    if (!user) {
        return res.status(400).json({success: false, message: "No user with such id"});
    }

    const model = await Model.findOne({user: user._id})

    if (!model) {
        return res.status(400).json({success: false, message: "No models for such user"});
    }

    return res.json(model);
}

exports.update = async (req, res) => {
    const {_id} = req.params.id;
    try {
        const updateModel = res.json(
            await Model.updateOne(
                {_id},
                {
                    $set: req.body
                }
            )
        )
        if (updateModel) {
            const model = await Model.findOne({_id});
            res.json(model)
        }
    } catch
        (err) {
        res.json({message: err})
    }
}

exports.uploadModelPrintedStatus = async (req, res) => {
    const {modelId} = req.params;
    const {printed} = req.body;
    try {
        const model = await Model.findOne({_id: modelId})

        if (!model) {
            return res.status(400).json({success: false, message: "No models for such user"});
        }

        model.printed = printed;

        model.save();

        res.json(model)
    } catch
        (err) {
        res.json({message: err})
    }
}