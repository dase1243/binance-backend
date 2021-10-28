const Model = require('../models/Model');
const User = require('../models/User');

exports.getAll = async (req, res) => {
    return res.json(await Model.find())
}

exports.getSmartContractInfo = async (req, res) => {
    const model = await Model.findOne({_id: req.params.modelId});
    return res.json({
        image: process.env.URL + "/modelImages/" + model.image,
        description: model.description,
        name: model.name
    })
}

exports.getById = async (req, res) => {
    const {_id} = req.params.modelId;
    return res.json(await Model.findOne({_id}))
}

const saveFile = (file) => {
    try {
        const fileName = uuid.v4() + '.jpg';
        const filePath = path.resolve('static', fileName);
        file.mv(filePath);
        return fileName;
    } catch (e) {
        console.log(e)
    }
}

exports.create = async (req, res) => {
    try {
        console.log('here')
        const {userId} = req.params;
        console.log(req.body)
        const user = await User.findOne({_id: userId})
        const fileName = saveFile(req.files.image);

        let model = await Model.create({
            ...req.body,
            image: fileName,
            user
        });

        return res.json(model)
    } catch (e) {
        return res.json({
            error: true,
            message: e
        })
    }
}

exports.getByUserId = async (req, res) => {
    const {userId} = req.params.userId;
    const user = res.json(await User.findOne({_id: userId}));
    return user.models;
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