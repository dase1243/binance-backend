const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Model = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        data: Buffer,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    unityGameModel: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    printed: {
        type: Boolean,
        required: true
    }

}, {timestamps: {createdAt: 'created_at'}});

module.exports = mongoose.model('Model', Model);