const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NftToken = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    model_id: {
        type: String,
        required: true
    },
    image_uri: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    token_id: {
        type: String,
        required: true
    },
}, {timestamps: {createdAt: 'created_at'}});

module.exports = mongoose.model('NftToken', NftToken);