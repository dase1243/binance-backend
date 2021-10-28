const Model = require('../models/Model');
const User = require('../models/User');

exports.getAll = async (req, res) => {
    return res.json(await Model.find())
}

exports.getById = async (req, res) => {
    const {_id} = req.params.modelId;
    return res.json(await Model.findOne({_id}))
}

exports.create = async (req, res) => {
    try {
        const {userId} = req.params;
        const user = await User.findOne({_id: userId})
        console.log("user: ", user)
        return res.json(await Model.create({
                ...req.body,
                user
            })
        )
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