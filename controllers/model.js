const Model = require('../models/Model');
const User = require('../models/User');
const uuid = require("uuid");
const path = require('path')
const fs = require('fs');

exports.getAll = async (req, res) => {
    return res.json(await Model.find())
}

exports.getSmartContractInfo = async (req, res) => {
    const model = await Model.findOne({_id: req.params.modelId});
    if (!model) {
        return res.status(400).json({success: false, message: "No model with such id"});
    }
    return res.json({
        image: process.env.URL + "/modelImages/" + model.image,
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

const saveFile = (file) => {
    try {
        const fileName = uuid.v4() + path.extname(file.name);
        const filePath = path.resolve('static', fileName);
        file.mv(filePath);
        return fileName;
    } catch (e) {
        console.log(e)
    }
}

exports.create = async (req, res) => {
    try {
        const {userId} = req.params;
        const user = await User.findOne({_id: userId})

        console.log("user: ", user)
        console.log("req.files: ", req.files)
        console.log("req.body: ", req.body)

        const fileName = saveFile(req.files.image);

        const bitmap = fs.readFileSync(fileName);

        let model = await Model.create({
            ...req.body,
            name: req.body.name.split(' ').join('_'),
            image: new Buffer(bitmap).toString('base64'),
            user
        });

        return res.json(model)
    } catch (e) {
        console.log(e)
        return res.json({
            error: true,
            message: e
        })
    }
}

exports.uploadTokenImage = async (req, res) => {
    try {
        // const {userId} = req.params;
        // const user = await User.findOne({_id: userId})
        const fileName = saveFile(req.files.image);

        // let model = await Model.create({
        //     ...req.body,
        //     name: req.body.name.split(' ').join('_'),
        //     image: fileName,
        //     user
        // });

        return res.json({success: true})
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