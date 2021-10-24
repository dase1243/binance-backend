const express = require('express');
const Model = require('../models/Model');
const User = require('../models/User');
const router = express.Router();

router.get('/getModel', async (req, res) => {
    try {
        const Models = await Model.find();
        res.json(Models)
    } catch (err) {
        res.json({message: err})
    }
})

router.get('/getOneModel/:modelId', async (req, res) => {
    try {
        const findModel = await Model.findById(req.params.modelId);
        res.json(findModel)
    } catch (err) {
        res.json({message: err})
    }
})

router.post('/addModel', async (req, res) => {

    const model = new Model({
        name: req.body.name,
    });

    try {
        const savedModel = await model.save();
        if (savedModel) {
            const Models = await Model.find();
            res.json(Models)
        }
    } catch (err) {
        res.json({message: err})
    }
})


router.post('/deleteModel', async (req, res) => {
    const {id} = req.body;
    try {
        const deleteModel = await Model.deleteOne({_id: id});
        const deleteTodos = await User.deleteMany({model_id: id});

        if (deleteModel && deleteTodos) {
            const Models = await Model.find();
            res.json(Models)
        }
    } catch (err) {
        res.json({message: err})
    }
})

router.patch('/updateModel/:modelId', async (req, res) => {
    try {
        const updateModel = await Model.updateOne({_id: req.params.modelId}, {$set: {name: req.body.name}});
        if (updateModel) {
            const Models = await Model.find();
            res.json(Models)
        }
    } catch (err) {
        res.json({message: err})
    }
})

module.exports = router;